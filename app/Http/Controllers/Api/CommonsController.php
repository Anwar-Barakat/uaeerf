<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\Soap\CommonsService;
use Illuminate\Http\JsonResponse;
use SoapFault;

class CommonsController extends Controller
{
    public function __construct(
        protected CommonsService $commonsService
    ) {}

    /**
     * Get all cities
     */
    public function cities(): JsonResponse
    {
        try {
            $cities = $this->commonsService->getCityList();
            return response()->json([
                'success' => true,
                'data' => $cities,
            ]);
        } catch (SoapFault $e) {
            return response()->json([
                'success' => false,
                'error' => 'Failed to fetch cities',
                'message' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Get jumping division levels
     */
    public function divisions(): JsonResponse
    {
        try {
            $divisions = $this->commonsService->getJumpingDivisionLevelList();
            return response()->json([
                'success' => true,
                'data' => $divisions,
            ]);
        } catch (SoapFault $e) {
            return response()->json([
                'success' => false,
                'error' => 'Failed to fetch divisions',
                'message' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Get all categories
     */
    public function categories(): JsonResponse
    {
        try {
            $categories = $this->commonsService->getCategoryList();
            return response()->json([
                'success' => true,
                'data' => $categories,
            ]);
        } catch (SoapFault $e) {
            return response()->json([
                'success' => false,
                'error' => 'Failed to fetch categories',
                'message' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Get all countries
     */
    public function countries(): JsonResponse
    {
        try {
            $countries = $this->commonsService->getCountryList();
            return response()->json([
                'success' => true,
                'data' => $countries,
            ]);
        } catch (SoapFault $e) {
            return response()->json([
                'success' => false,
                'error' => 'Failed to fetch countries',
                'message' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Get GCC countries only
     */
    public function gccCountries(): JsonResponse
    {
        try {
            $countries = $this->commonsService->getGCCCountryList();
            return response()->json([
                'success' => true,
                'data' => $countries,
            ]);
        } catch (SoapFault $e) {
            return response()->json([
                'success' => false,
                'error' => 'Failed to fetch GCC countries',
                'message' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Get all disciplines
     */
    public function disciplines(): JsonResponse
    {
        try {
            $disciplines = $this->commonsService->getDisciplineList();
            return response()->json([
                'success' => true,
                'data' => $disciplines,
            ]);
        } catch (SoapFault $e) {
            return response()->json([
                'success' => false,
                'error' => 'Failed to fetch disciplines',
                'message' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Get all seasons
     */
    public function seasons(): JsonResponse
    {
        try {
            $seasons = $this->commonsService->getSeasonList();
            return response()->json([
                'success' => true,
                'data' => $seasons,
            ]);
        } catch (SoapFault $e) {
            return response()->json([
                'success' => false,
                'error' => 'Failed to fetch seasons',
                'message' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Get all genders
     */
    public function genders(): JsonResponse
    {
        try {
            $genders = $this->commonsService->getGenderList();
            return response()->json([
                'success' => true,
                'data' => $genders,
            ]);
        } catch (SoapFault $e) {
            return response()->json([
                'success' => false,
                'error' => 'Failed to fetch genders',
                'message' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Get all common data in single request (for page load)
     */
    public function all(): JsonResponse
    {
        try {
            return response()->json([
                'success' => true,
                'data' => [
                    'cities' => $this->commonsService->getCityList(),
                    'divisions' => $this->commonsService->getJumpingDivisionLevelList(),
                    'categories' => $this->commonsService->getCategoryList(),
                    'countries' => $this->commonsService->getCountryList(),
                    'disciplines' => $this->commonsService->getDisciplineList(),
                    'seasons' => $this->commonsService->getSeasonList(),
                    'genders' => $this->commonsService->getGenderList(),
                ],
            ]);
        } catch (SoapFault $e) {
            return response()->json([
                'success' => false,
                'error' => 'Failed to fetch common data',
                'message' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Clear all cached lists (admin only)
     */
    public function clearCache(): JsonResponse
    {
        $this->commonsService->clearCache();

        return response()->json([
            'success' => true,
            'message' => 'Cache cleared successfully',
        ]);
    }
}
