<?php

use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

// PayTabs return URL (user redirected here after payment)
Route::get('payment/return', [\App\Http\Controllers\PayTabsController::class, 'returnUrl'])->name('payment.return');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    // Rider Registration & Renewal Pages
    Route::get('rider/registration', function () {
        return inertia('rider/registration', [
            'disciplines' => app(\App\Services\Soap\CommonsService::class)->getDisciplineList(),
            'categories' => app(\App\Services\Soap\CommonsService::class)->getCategoryList(),
        ]);
    })->name('rider.registration');

    Route::get('rider/renewal', function () {
        return inertia('rider/renewal', [
            'seasons' => app(\App\Services\Soap\CommonsService::class)->getSeasonList(),
            'userRiders' => [],
        ]);
    })->name('rider.renewal');

    // Show Jumping Entry Page
    Route::get('jumping/entry', function () {
        return inertia('jumping/entry', [
            'userRiders' => [],
            'userHorses' => [],
        ]);
    })->name('jumping.entry');

    // API Endpoints
    Route::post('rider/register', [\App\Http\Controllers\RiderController::class, 'initiateRegistration'])->name('rider.register');
    Route::post('rider/renew', [\App\Http\Controllers\RiderController::class, 'initiateRenewal'])->name('rider.renew');
    Route::post('jumping/validate', [\App\Http\Controllers\ShowJumpingController::class, 'validateEligibility'])->name('jumping.validate');
    Route::post('jumping/entry', [\App\Http\Controllers\ShowJumpingController::class, 'initiateEntry'])->name('jumping.entry.submit');
});

require __DIR__.'/settings.php';
