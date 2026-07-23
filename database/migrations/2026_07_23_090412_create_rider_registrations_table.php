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
        Schema::create('rider_registrations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('cart_id')->unique();
            $table->string('rider_name');
            $table->date('date_of_birth');
            $table->string('nationality', 3);
            $table->string('passport_number')->nullable();
            $table->integer('discipline_id');
            $table->integer('category_id');
            $table->enum('status', ['pending_payment', 'completed', 'failed'])->default('pending_payment');
            $table->string('tran_ref')->nullable();
            $table->text('soap_response')->nullable();
            $table->text('error_message')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'status']);
            $table->index('cart_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rider_registrations');
    }
};
