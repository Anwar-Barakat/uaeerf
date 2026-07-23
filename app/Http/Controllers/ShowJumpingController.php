<?php

namespace App\Http\Controllers;

use App\Data\CreateShowJumpingEntryRepositoryData;
use App\Data\ShowJumpingEntryData;
use App\Repositories\ShowJumpingEntryRepository;
use App\Services\PayTabsService;
use App\Services\Soap\ShowJumpingCriteriaService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class ShowJumpingController extends Controller
{
    public function __construct(
        protected PayTabsService $payTabsService,
        protected ShowJumpingCriteriaService $criteriaService,
        protected ShowJumpingEntryRepository $entryRepo
    ) {}

    public function validateEligibility(Request $request)
    {
        $validated = $request->validate([
            'rider_id' => 'required|integer',
            'horse_id' => 'required|integer',
            'event_id' => 'required|integer',
            'class_id' => 'required|integer',
        ]);

        try {
            $result = $this->criteriaService->validateRiderHorseCombination($validated);

            return response()->json([
                'success' => true,
                'eligible' => $result['riderEligible'] && $result['horseEligible'],
                'rider_eligible' => $result['riderEligible'],
                'horse_eligible' => $result['horseEligible'],
                'details' => $result,
            ]);

        } catch (\Exception $e) {
            Log::error('Eligibility validation failed', [
                'error' => $e->getMessage(),
                'data' => $validated,
            ]);

            return response()->json([
                'success' => false,
                'error' => 'Failed to validate eligibility',
                'message' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    public function initiateEntry(ShowJumpingEntryData $data)
    {
        $user = Auth::user();
        try {
            $eligibility = $this->criteriaService->validateRiderHorseCombination([
                'rider_id' => $data->rider_id,
                'horse_id' => $data->horse_id,
                'event_id' => $data->event_id,
                'class_id' => $data->class_id,
            ]);

            if (!($eligibility['riderEligible'] && $eligibility['horseEligible'])) {
                return back()->withErrors(['eligibility' => 'Rider or horse not eligible for this competition']);
            }

        } catch (\Exception $e) {
            Log::error('Show jumping eligibility check failed', ['error' => $e->getMessage()]);

            return back()->withErrors(['eligibility' => 'Failed to validate eligibility. Please try again.']);
        }
        $cartId = PayTabsService::generateCartId('jumping', $user->id);
        $repositoryData = CreateShowJumpingEntryRepositoryData::fromEntryData(
            $user->id,
            $cartId,
            $data
        );

        $this->entryRepo->create($repositoryData);
        $paymentData = $this->payTabsService->createShowJumpingPayment([
            'name' => $user->name,
            'email' => $user->email,
            'phone' => $user->phone ?? '0501234567',
            'city' => $user->city ?? 'Dubai',
            'country' => 'AE',
        ], [
            'event_name' => $data->event_name,
        ], $cartId);

        if (empty($paymentData['redirect_url'])) {
            Log::error('PayTabs jumping payment missing redirect_url', ['cart_id' => $cartId]);

            return back()->withErrors(['payment' => 'Unable to start payment. Please try again.']);
        }

        return Inertia::location($paymentData['redirect_url']);
    }

    public function processEntry(string $cartId, string $tranRef): void
    {
        $entry = $this->entryRepo->findByCartId($cartId);

        if (!$entry) {
            Log::error('Show jumping entry not found', ['cart_id' => $cartId]);
            return;
        }

        if ($entry->status === 'completed') {
            Log::info('Show jumping entry already processed', ['cart_id' => $cartId]);
            return;
        }

        try {
            $this->entryRepo->processWithTransaction(function () use ($entry, $cartId, $tranRef) {
                $this->entryRepo->insertToClassEntriesWeb($entry, $tranRef);
                $this->entryRepo->markCompleted($cartId, $tranRef);

                Log::info('Show jumping entry completed', [
                    'cart_id' => $cartId,
                    'tran_ref' => $tranRef,
                    'rider_id' => $entry->rider_id,
                    'horse_id' => $entry->horse_id,
                ]);
            });

        } catch (\Exception $e) {
            Log::error('Show jumping entry database insert failed', [
                'cart_id' => $cartId,
                'error' => $e->getMessage(),
            ]);

            $this->entryRepo->markFailed($cartId, $e->getMessage());
        }
    }
}
