<?php

use App\Models\User;
use Laravel\Fortify\Features;

beforeEach(function () {
    $this->skipUnlessFortifyHas(Features::registration());
});

test('registration screen can be rendered', function () {
    $response = $this->get(route('register'));

    $response->assertOk();
});

test('new users can register', function () {
    $response = $this->post(route('register.store'), [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'phone' => '+971501234567',
        'city' => 'Dubai',
        'country' => 'AE',
        'password' => 'Password123!',
        'password_confirmation' => 'Password123!',
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('dashboard', absolute: false));

    expect(User::where('email', 'test@example.com')->exists())->toBeTrue();
});

test('registration requires phone', function () {
    $response = $this->from(route('register'))->post(route('register.store'), [
        'name' => 'Test User',
        'email' => 'nophone@example.com',
        'city' => 'Dubai',
        'password' => 'Password123!',
        'password_confirmation' => 'Password123!',
    ]);

    $response->assertSessionHasErrors('phone');
    $this->assertGuest();
    expect(User::where('email', 'nophone@example.com')->exists())->toBeFalse();
});

test('registration requires city', function () {
    $response = $this->from(route('register'))->post(route('register.store'), [
        'name' => 'Test User',
        'email' => 'nocity@example.com',
        'phone' => '+971501234567',
        'password' => 'Password123!',
        'password_confirmation' => 'Password123!',
    ]);

    $response->assertSessionHasErrors('city');
    $this->assertGuest();
    expect(User::where('email', 'nocity@example.com')->exists())->toBeFalse();
});

test('registration requires matching password confirmation', function () {
    $response = $this->from(route('register'))->post(route('register.store'), [
        'name' => 'Test User',
        'email' => 'mismatch@example.com',
        'phone' => '+971501234567',
        'city' => 'Dubai',
        'password' => 'Password123!',
        'password_confirmation' => 'Different123!',
    ]);

    $response->assertSessionHasErrors('password');
    $this->assertGuest();
});

test('registration requires unique email', function () {
    User::factory()->create(['email' => 'taken@example.com']);

    $response = $this->from(route('register'))->post(route('register.store'), [
        'name' => 'Test User',
        'email' => 'taken@example.com',
        'phone' => '+971501234567',
        'city' => 'Dubai',
        'password' => 'Password123!',
        'password_confirmation' => 'Password123!',
    ]);

    $response->assertSessionHasErrors('email');
    $this->assertGuest();
});

test('country is optional and defaults are accepted', function () {
    $response = $this->post(route('register.store'), [
        'name' => 'No Country',
        'email' => 'nocountry@example.com',
        'phone' => '+971501234567',
        'city' => 'Dubai',
        'password' => 'Password123!',
        'password_confirmation' => 'Password123!',
    ]);

    $this->assertAuthenticated();
    expect(User::where('email', 'nocountry@example.com')->exists())->toBeTrue();
});
