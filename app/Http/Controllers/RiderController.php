<?php

namespace App\Http\Controllers;

use App\Data\CreateRiderRepositoryData;
use App\Data\CreateRiderRenewalRepositoryData;
use App\Data\RiderRegistrationData;
use App\Data\RiderRenewalData;
use App\Repositories\RiderRegistrationRepository;
use App\Repositories\RiderRenewalRepository;
use App\Services\PayTabsService;
use App\Services\Soap\RegistrationsService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

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
        $data->nationality = $this->resolveNationalityCode($data->nationality_id);
        $cartId = PayTabsService::generateCartId('rider_reg', $user->id);
        $repositoryData = CreateRiderRepositoryData::fromRegistrationData(
            $user->id,
            $cartId,
            $data
        );

        $this->registrationRepo->create($repositoryData);
        $paymentData = $this->payTabsService->createRiderRegistrationPayment([
            'name' => $user->name,
            'email' => $user->email,
            'phone' => $user->phone ?? '0501234567',
            'city' => $user->city ?? 'Dubai',
            'country' => 'AE',
        ], $cartId);

        if (empty($paymentData['redirect_url'])) {
            Log::error('PayTabs registration payment missing redirect_url', ['cart_id' => $cartId]);

            return back()->withErrors(['payment' => 'Unable to start payment. Please try again.']);
        }

        return Inertia::location($paymentData['redirect_url']);
    }

    public function initiateRenewal(RiderRenewalData $data)
    {
        $user = Auth::user();
        $cartId = PayTabsService::generateCartId('rider_renewal', $user->id);
        $repositoryData = CreateRiderRenewalRepositoryData::fromRenewalData($user->id, $cartId, $data);
        $this->renewalRepo->create($repositoryData);
        $paymentData = $this->payTabsService->createRiderRenewalPayment([
            'name' => $user->name,
            'email' => $user->email,
            'phone' => $user->phone ?? '0501234567',
            'city' => $user->city ?? 'Dubai',
            'country' => 'AE',
        ], $cartId);

        if (empty($paymentData['redirect_url'])) {
            Log::error('PayTabs renewal payment missing redirect_url', ['cart_id' => $cartId]);

            return back()->withErrors(['payment' => 'Unable to start payment. Please try again.']);
        }

        return Inertia::location($paymentData['redirect_url']);
    }

    protected function resolveNationalityCode(string $nationalityId): string
    {
        try {
            foreach (app(\App\Services\Soap\CommonsService::class)->getCountryList() as $country) {
                if ((string) ($country->Code ?? '') === $nationalityId) {
                    $short = strtoupper(trim($country->ShortName ?? ''));

                    return substr($short ?: 'ARE', 0, 3);
                }
            }
        } catch (\Exception $e) {
            Log::warning('Nationality code resolution failed', ['error' => $e->getMessage()]);
        }

        return 'ARE';
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

                $soapResult = $this->registrationsService->submitPersonNewRegistration([
                    'PayType' => 'ONLINE',
                    'UserId' => (int) $registration->user_id,
                    'Name' => $registration->rider_name,
                    'FatherName' => $registration->last_name
                        ?: (str_contains($registration->rider_name, ' ')
                            ? substr($registration->rider_name, strrpos($registration->rider_name, ' ') + 1)
                            : $registration->rider_name),
                    'Dob' => date('c', strtotime($registration->date_of_birth)),
                    'Nationality' => $registration->nationality,
                    'NationalityID' => (string) $registration->nationality_id,
                    'SexID' => (string) $registration->gender_id,
                    'CityID' => (string) $registration->city_id,
                    'CountryID' => (string) $registration->country_id,
                    'Email' => (string) $registration->email,
                    'Mobile' => (string) $registration->mobile,
                    'Address' => (string) $registration->address,
                    'PoBox' => (string) $registration->po_box,
                    'Weight' => (string) $registration->weight,
                    'VisaCategory' => (int) $registration->visa_category,
                    'EID' => (string) $registration->eid,
                    'RegisterSeason' => $registration->register_season ? 1 : 0,
                    'RegisterFEI' => $registration->register_fei ? 1 : 0,
                    'RefNum' => $registration->passport_number,
                    'DivisionId' => (int) $registration->discipline_id,
                    'Category' => (string) $registration->category_id,
                    'ReferenceNumber' => $tranRef,
                    'DateSubmit' => date('c'),
                ]);

                if (empty($soapResult->Submit_PersonNewRegistrationResult)) {
                    $messages = (array) ($soapResult->msg->string ?? []);
                    throw new \RuntimeException('SOAP registration rejected: ' . implode('; ', $messages));
                }
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

                $soapResult = $this->registrationsService->submitPersonRenewal([
                    'PayType' => 'ONLINE',
                    'PersonID' => (string) $renewal->rider_id,
                    'SeasonCode' => (int) $renewal->season_id,
                    'RegisterSeason' => 1,
                    'ReferenceNumber' => $tranRef,
                    'DateSubmit' => date('c'),
                ]);

                if (empty($soapResult->Submit_PersonRenewalResult)) {
                    $messages = (array) ($soapResult->msg->string ?? []);
                    throw new \RuntimeException('SOAP renewal rejected: ' . implode('; ', $messages));
                }
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
