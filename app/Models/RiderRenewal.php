<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RiderRenewal extends Model
{
    protected $connection = 'mssql';

    protected $fillable = [
        'user_id',
        'cart_id',
        'rider_id',
        'season_id',
        'status',
        'tran_ref',
        'soap_response',
        'error_message',
        'completed_at',
    ];

    protected $casts = [
        'completed_at' => 'datetime',
    ];
}
