<?php

use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;

beforeEach(function () {
    config()->set('database.connections.mssql', [
        'driver' => 'sqlite',
        'database' => ':memory:',
        'prefix' => '',
        'foreign_key_constraints' => false,
    ]);

    Schema::connection('mssql')->create('UserProfile', function ($table) {
        $table->increments('UserID');
        $table->string('Email');
        $table->string('Password');
        $table->string('FullName')->nullable();
        $table->string('MobileNumber')->nullable();
        $table->string('City')->nullable();
        $table->string('Country')->nullable();
        $table->string('Address')->nullable();
        $table->timestamp('RegistrationDate')->nullable();
        $table->string('Status')->nullable();
    });
});

function createLocalUser(string $password = 'Password123!'): User
{
    return User::factory()->create([
        'email' => 'profile@test.ae',
        'password' => $password,
    ]);
}

function createProfile(string $password = 'Password123!'): void
{
    DB::connection('mssql')->table('UserProfile')->insert([
        'Email' => 'profile@test.ae',
        'Password' => Hash::make($password),
        'FullName' => 'Profile Test',
        'Status' => 'Active',
    ]);
}

test('login succeeds when userprofile matches', function () {
    createLocalUser();
    createProfile();

    $response = $this->post(route('login.store'), [
        'email' => 'profile@test.ae',
        'password' => 'Password123!',
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('dashboard', absolute: false));
});

test('login denied when userprofile password mismatches', function () {
    createLocalUser();
    createProfile('DifferentPassword999!');

    $response = $this->from(route('login'))->post(route('login.store'), [
        'email' => 'profile@test.ae',
        'password' => 'Password123!',
    ]);

    $this->assertGuest();
    $response->assertSessionHasErrors();
});

test('login succeeds with warning when userprofile row missing', function () {
    createLocalUser();

    $response = $this->post(route('login.store'), [
        'email' => 'profile@test.ae',
        'password' => 'Password123!',
    ]);

    $this->assertAuthenticated();
});

test('login denied with wrong local password regardless of profile', function () {
    createLocalUser();
    createProfile();

    $this->from(route('login'))->post(route('login.store'), [
        'email' => 'profile@test.ae',
        'password' => 'WrongPassword!',
    ]);

    $this->assertGuest();
});
