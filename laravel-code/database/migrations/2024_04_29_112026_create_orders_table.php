<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('user_id')->unsigned();
            $table->foreign('user_id')->references('id')->on('users');
            $table->decimal('grandTotal', 10, 2);
            $table->integer('totalItem');
            $table->decimal('totalPrice', 10, 2);
            $table->decimal('total_delivery_charge', 10, 2);
            $table->decimal('discount', 10, 2)->default(0);
            $table->string('coupon')->nullable();
            $table->decimal('tax', 10, 2)->default(0);
            $table->boolean('payment_status')->default(0);
            $table->string('payment_mode');
            $table->string('transaction_id')->nullable();
            $table->text('address');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
