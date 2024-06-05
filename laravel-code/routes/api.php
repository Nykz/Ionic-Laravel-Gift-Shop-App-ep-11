<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\GiftController;
use App\Http\Controllers\CouponController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AddressController;
use App\Http\Controllers\OrderController;

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');


Route::post('signup', [UserController::class, 'store']);
Route::post('login', [UserController::class, 'login']);


Route::group(['middleware' => ['auth:sanctum']], function() {

    // users
    Route::get('profile', [UserController::class, 'show']);
    Route::get('logout', [UserController::class, 'logout']);

    // gifts
    Route::resource('gift', GiftController::class);
    Route::post('gifts/{id}', [GiftController::class, 'update']);
    Route::post('bulk_gifts', [GiftController::class, 'bulkInsert']);

    // coupons
    Route::post('bulk_coupons', [CouponController::class, 'bulkInsert']);
    Route::resource('coupon', CouponController::class);

    // addresses
    Route::resource('address', AddressController::class);

    // orders
    Route::resource('order', OrderController::class);

});