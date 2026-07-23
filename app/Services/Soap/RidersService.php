<?php

namespace App\Services\Soap;

class RidersService extends BaseSoapClient
{
    protected function getWsdlUrl(): string
    {
        return config('services.soap.riders_url') . '?WSDL';
    }

    public function searchRiders(string $name = '', string $eefId = ''): array
    {
        $result = $this->call('SearchRiderList', [
            'SearchFirstName' => '',
            'SearchLastName' => $name,
            'SearchFEIID' => '',
            'SearchEEFID' => $eefId,
            'SearchStable' => '',
            'SearchNationality' => '',
            'SearchGender' => '',
            'msg' => [],
        ]);

        $riders = $result->SearchRiderListResult->EEFRider ?? [];
        $riders = is_array($riders) ? $riders : [$riders];

        return array_map(fn ($rider) => [
            'rider_id' => $rider->RiderID ?? null,
            'name' => trim(($rider->FirstName ?? '') . ' ' . ($rider->FamilyName ?? ''))
                ?: ($rider->FullName ?? $rider->RiderID ?? ''),
            'dob' => isset($rider->DOB) ? substr($rider->DOB, 0, 10) : null,
            'nationality' => $rider->NATIONALITY_short ?? null,
            'registered_current_season' => (bool) ($rider->IsRegisteredInCurrentSeason ?? false),
        ], $riders);
    }
}
