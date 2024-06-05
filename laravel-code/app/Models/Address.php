<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Address extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'user_id',  
        'address', 
        'house_no',
        'city', 
        'state',
        'country',
        'pincode',
        'save_as',
        'primary',
        'landmark',
        'lat',
        'lng',
    ];
}
