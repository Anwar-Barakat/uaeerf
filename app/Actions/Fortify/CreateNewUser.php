<?php

namespace App\Actions\Fortify;

use App\Concerns\PasswordValidationRules;
use App\Concerns\ProfileValidationRules;
use App\Models\User;
use App\Models\UserProfile;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules, ProfileValidationRules;

    /**
     * Validate and create a newly registered user.
     *
     * @param  array<string, string>  $input
     */
    public function create(array $input): User
    {
        Validator::make($input, [
            ...$this->profileRules(),
            'password' => $this->passwordRules(),
            'phone' => ['required', 'string', 'max:20'],
            'city' => ['required', 'string'],
            'country' => ['nullable', 'string'],
        ])->validate();

        // Create local user (SQLite - for Laravel auth)
        $user = User::create([
            'name' => $input['name'],
            'email' => $input['email'],
            'password' => $input['password'],
        ]);

        // Sync to MSSQL UserProfile (if driver available)
        try {
            UserProfile::create([
                'Email' => $input['email'],
                'Password' => Hash::make($input['password']),
                'FullName' => $input['name'],
                'MobileNumber' => $input['phone'],
                'City' => $input['city'],
                'Country' => $input['country'] ?? 'AE',
                'Address' => $input['address'] ?? '',
                'RegistrationDate' => now(),
                'Status' => 'Active',
            ]);

            Log::info('User synced to MSSQL UserProfile', ['email' => $input['email']]);
        } catch (\Exception $e) {
            // Log error but don't fail registration
            // MSSQL sync will happen later when driver is available
            Log::warning('Failed to sync user to MSSQL UserProfile', [
                'email' => $input['email'],
                'error' => $e->getMessage(),
            ]);
        }

        return $user;
    }
}
