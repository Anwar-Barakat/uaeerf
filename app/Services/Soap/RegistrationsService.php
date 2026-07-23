<?php

namespace App\Services\Soap;

class RegistrationsService extends BaseSoapClient
{
    protected function getWsdlUrl(): string
    {
        return config('services.soap.registrations_url') . '?WSDL';
    }

    public function submitHorseNewRegistration(array $data): object
    {
        return $this->call('Submit_HorseNewRegistration', $data);
    }

    public function submitHorseRenewal(array $data): object
    {
        return $this->call('Submit_HorseRenewal', $data);
    }

    public function getHorseNewRegistration(string $registrationId): object
    {
        return $this->call('Get_HorseNewRegistration', [
            'registrationId' => $registrationId,
        ]);
    }

    public function getHorseRenewal(string $renewalId): object
    {
        return $this->call('Get_HorseRenewal', [
            'renewalId' => $renewalId,
        ]);
    }

    public function getHorseOwner(string $ownerId): object
    {
        return $this->call('Get_HorseOwner', [
            'ownerId' => $ownerId,
        ]);
    }

    public function getHorseTrainer(string $trainerId): object
    {
        return $this->call('Get_HorseTrainer', [
            'trainerId' => $trainerId,
        ]);
    }

    public function getDECStableList(): array
    {
        $result = $this->call('getDECStableList');
        return $result->getDECStableListResult ?? [];
    }

    public function getDECUserList(): array
    {
        $result = $this->call('Get_DEC_UserList');
        return $result->Get_DEC_UserListResult ?? [];
    }
}
