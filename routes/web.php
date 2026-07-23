<?php

use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

// PayTabs return URL (user redirected here after payment)
Route::get('payment/return', [\App\Http\Controllers\PayTabsController::class, 'returnUrl'])->name('payment.return');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    // Rider Registration & Renewal
    Route::post('rider/register', [\App\Http\Controllers\RiderController::class, 'initiateRegistration'])->name('rider.register');
    Route::post('rider/renew', [\App\Http\Controllers\RiderController::class, 'initiateRenewal'])->name('rider.renew');

    // Show Jumping
    Route::post('jumping/validate', [\App\Http\Controllers\ShowJumpingController::class, 'validateEligibility'])->name('jumping.validate');
    Route::post('jumping/entry', [\App\Http\Controllers\ShowJumpingController::class, 'initiateEntry'])->name('jumping.entry');
});

require __DIR__.'/settings.php';
