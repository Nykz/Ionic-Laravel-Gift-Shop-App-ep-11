<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Order;
use App\Models\OrderItem;
use Validator;
use Carbon\Carbon;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user_id = Auth::user()->id;
        $orders = Order::where('user_id', $user_id)->with('order_items')->get();
        $server = config('app.server');

        return response()->json([
            'data' => $orders,
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
        $user_id = Auth::user()->id;

        $validator = Validator::make($request->all(), [
            'grandTotal' => 'required',
            'totalItem' => 'required',
            'totalPrice' => 'required',
            'total_delivery_charge' => 'required',
            'items' => 'required|array',
            'payment_mode' => 'required',
            'address' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json(['error'=>$validator->errors()], 422);
        }

        $data = [
            "user_id" => $user_id,
            "grandTotal" => $request->grandTotal,
            'totalItem' => $request->totalItem,
            'totalPrice' => $request->totalPrice,
            'total_delivery_charge' => $request->total_delivery_charge,
            'tax' => $request->tax,
            'address' => $request->address,
            'payment_mode' => $request->payment_mode,
            'payment_status' => $request->payment_status,
            'transaction_id' => $request->transaction_id,
        ];

        if ($request->has('coupon')) {
            $data['coupon'] = $request->coupon;
            $data['discount'] = $request->discount;
        }

        $order = Order::create($data);

        $order_id = $order->id;
        $items = $request->items;

        $newArray = array_map(function ($item) use ($order_id) {
            return [
                'order_id' => $order_id,
                'created_at' => now(),
                'updated_at' => now(),
                'item_id' => $item['item_id'],
                'name' => $item['name'],
                'description' => $item['description'],
                'price' => $item['price'],
                'quantity' => $item['quantity'],
                'cover' => $item['cover'],
            ];
        }, $items);

        $orderItems = OrderItem::insert($newArray);

        return response()->json([
            'success' => 1,
            'message' => 'Order placed successfully',
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
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
}
