<?php

use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::get('history/registrations', [\App\Http\Controllers\HistoryController::class, 'registrations'])->name('history.registrations');
    Route::get('history/renewals', [\App\Http\Controllers\HistoryController::class, 'renewals'])->name('history.renewals');
    Route::get('history/entries', [\App\Http\Controllers\HistoryController::class, 'entries'])->name('history.entries');

    // Rider Registration & Renewal Pages
    Route::get('rider/registration', function () {
        $commons = app(\App\Services\Soap\CommonsService::class);

        return inertia('rider/registration', [
            'disciplines' => $commons->getDisciplineList(),
            'categories' => $commons->getCategoryList(),
            'cities' => $commons->getCityList(),
            'countries' => $commons->getCountryList(),
            'genders' => $commons->getGenderList(),
            'visaCategories' => $commons->getVisaCategoryList(),
        ]);
    })->name('rider.registration');

    Route::get('rider/renewal', function () {
        return inertia('rider/renewal', [
            'seasons' => app(\App\Services\Soap\CommonsService::class)->getSeasonList(),
        ]);
    })->name('rider.renewal');

    // Show Jumping Entry Page
    Route::get('jumping/entry', function () {
        return inertia('jumping/entry', [
            'userRiders' => [],
            'userHorses' => [],
        ]);
    })->name('jumping.entry');

    // API Endpoints (rate limited: 10 requests per minute)
    Route::middleware('throttle:10,1')->group(function () {
        Route::post('rider/register', [\App\Http\Controllers\RiderController::class, 'initiateRegistration'])->name('rider.register');
        Route::post('rider/renew', [\App\Http\Controllers\RiderController::class, 'initiateRenewal'])->name('rider.renew');
        Route::post('jumping/validate', [\App\Http\Controllers\ShowJumpingController::class, 'validateEligibility'])->name('jumping.validate');
        Route::post('jumping/entry', [\App\Http\Controllers\ShowJumpingController::class, 'initiateEntry'])->name('jumping.entry.submit');
    });
});

require __DIR__.'/settings.php';
