<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ShowJumpingEntry extends Model
{
    protected $connection = 'mssql';

    protected $table = 'show_jumping_entries';

    protected $fillable = [
        'user_id',
        'cart_id',
        'rider_id',
        'horse_id',
        'event_id',
        'class_id',
        'event_name',
        'status',
        'tran_ref',
        'error_message',
        'completed_at',
    ];

    protected $casts = [
        'completed_at' => 'datetime',
    ];
}
