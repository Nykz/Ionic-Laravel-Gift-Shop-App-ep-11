<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Validator;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
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
            'name' => 'required|min:3|max:100',
            'email' => 'required|email',
            'phone' => 'required|min:10|max:10',
            'password' => 'required|min:8'
        ]);

        if ($validator->fails()) {
            return response()->json(['error'=>$validator->errors()], 422);
        }

        $query = User::where(function ($query) use ($request)  {
            return $query->where('email','=', $request->email)
                ->orWhere('phone','=', $request->phone);
            })
            ->first();

        if($query) {
            return response()->json([
                'success' => 0, 
                'message' => 'Account with same Email or Phone number already exists.'
            ], 401);
        }

        $input = $request->all();
        $input['password'] = bcrypt($input['password']);
        $user = User::create($input);

        $token = $user->createToken($request->email)->plainTextToken;

        return response()->json([
            'success' => 1,
            'token' => $token
        ], 200);
    }

    /**
     * Display the specified resource.
     */
    public function show()
    {
        $user = Auth::user();

        return response()->json([
            "name" => $user->name,
            "email" => $user->email,
            "phone" => $user->phone,
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
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|string',
            'password' => 'required|string'
        ]);

        if ($validator->fails()) {
            return response()->json(['error'=>$validator->errors()], 422);
        }

        $credentials = request(['email','password']);

        // if(Auth::attempt(['email' => $email, 'password' => $password]))
        if(!Auth::attempt($credentials))
        {
            return response()->json([
                'message' => 'You are an Unauthorised user.'
            ], 401);
        }

        $user = $request->user();

        // Delete existing tokens for the user
        $user->tokens()->delete();

        $tokenResult = $user->createToken($request->email);
        $token = $tokenResult->plainTextToken;

        return response()->json([
            'success' => 1,
            'token' => $token
        ], 200);
    }

    public function logout(Request $request)
    {
        $user = Auth::user();
        // Delete existing tokens for the user
        $user->tokens()->delete();

        return response()->json([
            'success' => 1,
        ], 200);
    }
}
