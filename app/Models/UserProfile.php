<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserProfile extends Model
{
    /**
     * MSSQL connection for UAEERF UserProfile table
     */
    protected $connection = 'mssql';

    /**
     * Table name in MSSQL database
     */
    protected $table = 'UserProfile';

    /**
     * Primary key (adjust based on actual schema)
     */
    protected $primaryKey = 'UserID';

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'Email',
        'Password',
        'FullName',
        'MobileNumber',
        'City',
        'Country',
        'Address',
        'DateOfBirth',
        'Gender',
        'RegistrationDate',
        'Status',
    ];

    /**
     * The attributes that should be hidden for serialization.
     */
    protected $hidden = [
        'Password',
    ];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'RegistrationDate' => 'datetime',
        'DateOfBirth' => 'date',
    ];

    /**
     * Timestamps (adjust if MSSQL table uses different column names)
     */
    public $timestamps = false;
}
