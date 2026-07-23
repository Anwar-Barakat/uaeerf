<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserProfile extends Model
{
    protected $connection = 'mssql';

    protected $table = 'UserProfile';

    protected $primaryKey = 'UserID';

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

    protected $hidden = [
        'Password',
    ];

    protected $casts = [
        'RegistrationDate' => 'datetime',
        'DateOfBirth' => 'date',
    ];

    public $timestamps = false;
}
