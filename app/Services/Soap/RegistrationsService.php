<?php

namespace App\Services\Soap;

class RegistrationsService extends BaseSoapClient
{
    protected function getWsdlUrl(): string
    {
        return config('services.soap.registrations_url') . '?WSDL';
    }

    /**
     * Submit new horse registration
     */
    public function submitHorseNewRegistration(array $data): object
    {
        return $this->call('Submit_HorseNewRegistration', $data);
    }

    /**
     * Submit horse renewal
     */
    public function submitHorseRenewal(array $data): object
    {
        return $this->call('Submit_HorseRenewal', $data);
    }

    /**
     * Get horse new registration details
     */
    public function getHorseNewRegistration(string $registrationId): object
    {
        return $this->call('Get_HorseNewRegistration', [
            'registrationId' => $registrationId,
        ]);
    }

    /**
     * Get horse renewal details
     */
    public function getHorseRenewal(string $renewalId): object
    {
        return $this->call('Get_HorseRenewal', [
            'renewalId' => $renewalId,
        ]);
    }

    /**
     * Get horse owner information
     */
    public function getHorseOwner(string $ownerId): object
    {
        return $this->call('Get_HorseOwner', [
            'ownerId' => $ownerId,
        ]);
    }

    /**
     * Get horse trainer information
     */
    public function getHorseTrainer(string $trainerId): object
    {
        return $this->call('Get_HorseTrainer', [
            'trainerId' => $trainerId,
        ]);
    }

    /**
     * Get DEC stable list
     */
    public function getDECStableList(): array
    {
        $result = $this->call('getDECStableList');
        return $result->getDECStableListResult ?? [];
    }

    /**
     * Get DEC user list
     */
    public function getDECUserList(): array
    {
        $result = $this->call('Get_DEC_UserList');
        return $result->Get_DEC_UserListResult ?? [];
    }
}
