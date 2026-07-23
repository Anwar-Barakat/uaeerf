<?php

namespace App\Services\Soap;

use Illuminate\Support\Facades\Cache;

class CommonsService extends BaseSoapClient
{
    protected function getWsdlUrl(): string
    {
        return config('services.soap.commons_url') . '?WSDL';
    }

    public function getCityList(): array
    {
        return Cache::remember('soap_cities', 86400, function () {
            $result = $this->call('getCityList');
            return $result->getCityListResult->City ?? [];
        });
    }

    public function getJumpingDivisionLevelList(): array
    {
        return Cache::remember('soap_divisions', 86400, function () {
            $result = $this->call('getJumpingDivisionLevelList');
            return $result->getJumpingDivisionLevelListResult->JumpingDivisionLevel ?? [];
        });
    }

    public function getCategoryList(): array
    {
        return Cache::remember('soap_categories', 86400, function () {
            $result = $this->call('getCategoryList');
            return $result->getCategoryListResult->Category ?? [];
        });
    }

    public function getCountryList(): array
    {
        return Cache::remember('soap_countries', 86400, function () {
            $result = $this->call('getCountryList');
            return $result->getCountryListResult->Country ?? [];
        });
    }

    public function getGCCCountryList(): array
    {
        return Cache::remember('soap_gcc_countries', 86400, function () {
            $result = $this->call('getGCCCountryList');
            return $result->getGCCCountryListResult->Country ?? [];
        });
    }

    public function getDisciplineList(): array
    {
        return Cache::remember('soap_disciplines', 86400, function () {
            $result = $this->call('getDisciplineList');
            return $result->getDisciplineListResult->Discipline ?? [];
        });
    }

    public function getSeasonList(): array
    {
        return Cache::remember('soap_seasons', 86400, function () {
            $result = $this->call('getSeasonList');
            return $result->getSeasonListResult->Season ?? [];
        });
    }

    public function getGenderList(): array
    {
        return Cache::remember('soap_genders', 86400, function () {
            $result = $this->call('getGenderList');
            return $result->getGenderListResult->Gender ?? [];
        });
    }

    public function checkIfEmailAvailable(string $email): bool
    {
        $result = $this->call('CheckIfEmailAvailable', ['email' => $email]);
        return $result->CheckIfEmailAvailableResult ?? false;
    }

    public function checkIfMobileNoAvailable(string $mobile): bool
    {
        $result = $this->call('CheckIfMobileNoAvailable', ['mobileNo' => $mobile]);
        return $result->CheckIfMobileNoAvailableResult ?? false;
    }

    public function clearCache(): void
    {
        $keys = [
            'soap_cities',
            'soap_divisions',
            'soap_categories',
            'soap_countries',
            'soap_gcc_countries',
            'soap_disciplines',
            'soap_seasons',
            'soap_genders',
        ];

        foreach ($keys as $key) {
            Cache::forget($key);
        }
    }
}
