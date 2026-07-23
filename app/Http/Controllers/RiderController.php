<?php

namespace App\Http\Controllers;

use App\Data\CreateRiderRepositoryData;
use App\Data\RiderRegistrationData;
use App\Data\RiderRenewalData;
use App\Repositories\RiderRegistrationRepository;
use App\Repositories\RiderRenewalRepository;
use App\Services\PayTabsService;
use App\Services\Soap\RegistrationsService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class RiderController extends Controller
{
    public function __construct(
        protected PayTabsService $payTabsService,
        protected RegistrationsService $registrationsService,
        protected RiderRegistrationRepository $registrationRepo,
        protected RiderRenewalRepository $renewalRepo
    ) {}

    public function initiateRegistration(RiderRegistrationData $data)
    {
        $user = Auth::user();
        $cartId = PayTabsService::generateCartId('rider_reg', $user->id);
        $repositoryData = CreateRiderRepositoryData::fromRegistrationData(
            $user->id,
            $cartId,
            $data
        );

        $this->registrationRepo->create($repositoryData->toArray());
        $paymentData = $this->payTabsService->createRiderRegistrationPayment([
            'name' => $user->name,
            'email' => $user->email,
            'phone' => $user->phone ?? '0501234567',
            'city' => $user->city ?? 'Dubai',
            'country' => 'AE',
        ], $cartId);

        return response()->json([
            'success' => true,
            'cart_id' => $cartId,
            'redirect_url' => $paymentData['redirect_url'] ?? null,
            'tran_ref' => $paymentData['tran_ref'] ?? null,
        ]);
    }

    public function initiateRenewal(RiderRenewalData $data)
    {
        $user = Auth::user();
        $cartId = PayTabsService::generateCartId('rider_renewal', $user->id);
        $this->renewalRepo->create([
            'user_id' => $user->id,
            'cart_id' => $cartId,
            'rider_id' => $data->rider_id,
            'season_id' => $data->season_id,
        ]);
        $paymentData = $this->payTabsService->createRiderRenewalPayment([
            'name' => $user->name,
            'email' => $user->email,
            'phone' => $user->phone ?? '0501234567',
            'city' => $user->city ?? 'Dubai',
            'country' => 'AE',
        ], $cartId);

        return response()->json([
            'success' => true,
            'cart_id' => $cartId,
            'redirect_url' => $paymentData['redirect_url'] ?? null,
            'tran_ref' => $paymentData['tran_ref'] ?? null,
        ]);
    }

    public function processRegistration(string $cartId, string $tranRef): void
    {
        $registration = $this->registrationRepo->findByCartId($cartId);

        if (!$registration) {
            Log::error('Rider registration not found', ['cart_id' => $cartId]);
            return;
        }

        if ($registration->status === 'completed') {
            Log::info('Rider registration already processed', ['cart_id' => $cartId]);
            return;
        }

        try {
            $this->registrationRepo->processWithTransaction(function () use ($registration, $cartId, $tranRef) {

                $soapResult = $this->registrationsService->submitHorseNewRegistration([
                    'RiderName' => $registration->rider_name,
                    'DateOfBirth' => $registration->date_of_birth,
                    'Nationality' => $registration->nationality,
                    'PassportNumber' => $registration->passport_number,
                    'DisciplineID' => $registration->discipline_id,
                    'CategoryID' => $registration->category_id,
                    'TransactionReference' => $tranRef,
                ]);
                $this->registrationRepo->markCompleted(
                    $cartId,
                    $tranRef,
                    json_encode($soapResult)
                );

                Log::info('Rider registration completed', [
                    'cart_id' => $cartId,
                    'tran_ref' => $tranRef,
                ]);
            });

        } catch (\Exception $e) {
            Log::error('Rider registration SOAP call failed', [
                'cart_id' => $cartId,
                'error' => $e->getMessage(),
            ]);

            $this->registrationRepo->markFailed($cartId, $e->getMessage());
        }
    }

    public function processRenewal(string $cartId, string $tranRef): void
    {
        $renewal = $this->renewalRepo->findByCartId($cartId);

        if (!$renewal) {
            Log::error('Rider renewal not found', ['cart_id' => $cartId]);
            return;
        }

        if ($renewal->status === 'completed') {
            Log::info('Rider renewal already processed', ['cart_id' => $cartId]);
            return;
        }

        try {
            $this->renewalRepo->processWithTransaction(function () use ($renewal, $cartId, $tranRef) {

                $soapResult = $this->registrationsService->submitHorseRenewal([
                    'RiderID' => $renewal->rider_id,
                    'SeasonID' => $renewal->season_id,
                    'TransactionReference' => $tranRef,
                ]);
                $this->renewalRepo->markCompleted(
                    $cartId,
                    $tranRef,
                    json_encode($soapResult)
                );

                Log::info('Rider renewal completed', [
                    'cart_id' => $cartId,
                    'tran_ref' => $tranRef,
                ]);
            });

        } catch (\Exception $e) {
            Log::error('Rider renewal SOAP call failed', [
                'cart_id' => $cartId,
                'error' => $e->getMessage(),
            ]);

            $this->renewalRepo->markFailed($cartId, $e->getMessage());
        }
    }
}
