<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Gift;
use Validator;
use Config;

class GiftController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $gifts = Gift::where('status', 1);

        $query = $request->get('query');
        if(isset($query)) {
            $gifts = $gifts->where(function ($qry) use ($query) {
                return $qry->where('name', 'like', '%' . $query . '%')
                ->orWhere('description', 'like', '%' . $query . '%');
            });
        }
        $gifts = $gifts->get();

        $server = config('app.server');

        return response()->json([
            'data' => $gifts,
            'server_base_url' => $server,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required',
            'cover' => 'required|image|max:2048',
            'price' => 'required',
            'status' => 'required',
            'description' => 'required',
        ]);

        if($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        $input = $request->all();

        if($request->hasFile('cover')) {

            $filenameWithExt = $request->file('cover')->getClientOriginalName();
            $filename = pathinfo($filenameWithExt, PATHINFO_FILENAME);
            $extension = $request->file('cover')->getClientOriginalExtension();
            $fileNameToStore = $filename.'_'.time().'.'.$extension;

            $path = $request->file('cover')->storeAs('public/gifts', $fileNameToStore);
            $input['cover']='/gifts/'.$fileNameToStore;

        }

        $gift = Gift::create($input);

        return response()->json([
            'success' => 1,
            'data' => $gift
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $gift = Gift::find($id);
        $server = config('app.server');

        return response()->json([
            'data' => $gift,
            'server_base_url' => $server,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $validator = Validator::make($request->all(), [
            'cover' => 'image|max:2048',
        ]);

        if ($validator->fails()) {
            // Get the validation errors
            $errors = $validator->errors();

            // Append your custom error message
            $errors->add('cover', 'Maximum file size to upload is 2MB (2048KB)');
        
            // Return the response with the modified errors
            return response()->json(['errors' => $errors], 422);
        }

        $input = $request->all();
            
        if($request->hasFile('cover'))
        {
            $filenameWithExt = $request->file('cover')->getClientOriginalName();
            $filename = pathinfo($filenameWithExt, PATHINFO_FILENAME);
            $extension = $request->file('cover')->getClientOriginalExtension();
            $fileNameToStore = $filename.'_'.time().'.'.$extension;
            $path = $request->file('cover')
                ->storeAs('public/gifts', $fileNameToStore);
            $input['cover']='/gifts/'.$fileNameToStore;
        }

        $gift = Gift::find($id)->update($input);

        return response()->json([
            'success' => 1,
            'data'   =>  $gift
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $item = Gift::find($id);

        if($item->delete())
        {
            return response()->json(['success' => 1]);
        }

        return response()->json(['success' => 0]);
    }

    public function bulkInsert(Request $request)
    {
        $items = $request->all();

        $result = Gift::insert($items);

        return response()->json([
            'success' => 1,
            'data' => $result
        ]);
    }
}
