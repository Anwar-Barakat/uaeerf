<?php

namespace App\Services\Soap;

use Illuminate\Support\Facades\Cache;
use SoapFault;

class AuthenticationService extends BaseSoapClient
{
    protected function getWsdlUrl(): string
    {
        return config('services.soap.auth_url') . '?WSDL';
    }

    public function login(string $username = null, string $password = null): object
    {
        $username ??= config('services.soap.auth_username');
        $password ??= config('services.soap.auth_password');

        $result = $this->call('Login', [
            'username' => $username,
            'password' => $password,
        ]);

        if (!isset($result->LoginResult->Message)) {
            throw new SoapFault('Server', 'Invalid login response structure');
        }

        return $result->LoginResult;
    }

    public function loginBackOffice(string $username, string $password): bool
    {
        $result = $this->call('LoginBackOffice', [
            'uName' => $username,
            'uPass' => $password,
        ]);

        return $result->LoginBackOfficeResult ?? false;
    }

    public function getUserStableIdByDiscipline(string $stableId, string $disciplineId): ?string
    {
        $result = $this->call('GetUserStableIDbyDiscipline', [
            'stableID' => $stableId,
            'DisciplineID' => $disciplineId,
        ]);

        return $result->GetUserStableIDbyDisciplineResult ?? null;
    }

    public function authenticateAndCache(): bool
    {
        return Cache::remember('soap_auth_status', 3600, function () {
            try {
                $result = $this->login();
                return $result->Message === 'SUCCESSFUL';
            } catch (SoapFault $e) {
                return false;
            }
        });
    }
}
