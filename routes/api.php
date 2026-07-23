<?php

use App\Http\Controllers\Api\CommonsController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Common lists (publicly accessible, cached 24h)
Route::prefix('commons')->group(function () {
    Route::get('cities', [CommonsController::class, 'cities']);
    Route::get('divisions', [CommonsController::class, 'divisions']);
    Route::get('categories', [CommonsController::class, 'categories']);
    Route::get('countries', [CommonsController::class, 'countries']);
    Route::get('gcc-countries', [CommonsController::class, 'gccCountries']);
    Route::get('disciplines', [CommonsController::class, 'disciplines']);
    Route::get('seasons', [CommonsController::class, 'seasons']);
    Route::get('genders', [CommonsController::class, 'genders']);
    Route::get('all', [CommonsController::class, 'all']);
});

// PayTabs webhook (no auth - verified by signature)
Route::post('paytabs/webhook', [\App\Http\Controllers\PayTabsController::class, 'webhook']);

// Admin routes (protected)
Route::middleware(['auth'])->prefix('admin')->group(function () {
    Route::post('commons/clear-cache', [CommonsController::class, 'clearCache']);
});
