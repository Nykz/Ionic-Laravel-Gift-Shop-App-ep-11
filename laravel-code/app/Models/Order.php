<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'grandTotal',  
        'totalItem', 
        'totalPrice',
        'total_delivery_charge',
        'discount',
        'coupon',
        'payment_mode',
        'payment_status',
        'transaction_id',
        'address',
    ];

    public function order_items(): HasMany {
    	return $this->hasMany(OrderItem::class);
    }
}
