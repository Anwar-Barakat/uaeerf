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
        Schema::create('show_jumping_entries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('cart_id')->unique();
            $table->integer('rider_id');
            $table->integer('horse_id');
            $table->integer('event_id');
            $table->integer('class_id');
            $table->string('event_name');
            $table->enum('status', ['pending_payment', 'completed', 'failed'])->default('pending_payment');
            $table->string('tran_ref')->nullable();
            $table->text('error_message')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'status']);
            $table->index('cart_id');
            $table->index(['rider_id', 'horse_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('show_jumping_entries');
    }
};
