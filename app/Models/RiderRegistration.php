<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RiderRegistration extends Model
{
    protected $connection = 'mssql';

    protected $fillable = [
        'user_id',
        'cart_id',
        'rider_name',
        'date_of_birth',
        'nationality',
        'passport_number',
        'discipline_id',
        'category_id',
        'status',
        'tran_ref',
        'soap_response',
        'error_message',
        'completed_at',
    ];

    protected $casts = [
        'date_of_birth' => 'date',
        'completed_at' => 'datetime',
    ];
}
