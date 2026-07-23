<?php

namespace App\Services\Soap;

class RegistrationsService extends BaseSoapClient
{
    protected function getWsdlUrl(): string
    {
        return config('services.soap.registrations_url') . '?WSDL';
    }

    public function submitPersonNewRegistration(array $person, int $personType = 1): object
    {
        $defaults = [
            'PayType' => '',
            'FormId' => 0,
            'UserId' => 0,
            'RefNum' => '',
            'RefKey' => '',
            'Name' => '',
            'FatherName' => '',
            'Nationality' => '',
            'NationalityID' => '',
            'Dob' => '1900-01-01T00:00:00',
            'Sex' => '',
            'SexID' => '',
            'BloodGroup' => '',
            'Address' => '',
            'PoBox' => '',
            'City' => '',
            'CityID' => '',
            'Country' => '',
            'CountryID' => '',
            'Telephone' => '',
            'Fax' => '',
            'Mobile' => '',
            'Email' => '',
            'StableID' => '',
            'Club' => '',
            'OtherClub' => '',
            'Kin' => '',
            'AppRelationship' => '',
            'ContactTel' => '',
            'FEIActive' => 0,
            'FEIRegistration' => '',
            'FEIRegistrationDate' => '1900-01-01T00:00:00',
            'LicenseNumber' => '',
            'LicenseNumberDate' => '1900-01-01T00:00:00',
            'Division' => '',
            'DivisionId' => 0,
            'HomeAddress' => '',
            'HomeCity' => '',
            'HomeCityId' => 0,
            'HomeCountry' => '',
            'HomeCountryId' => 0,
            'HomePhone' => '',
            'HomeFax' => '',
            'HomeMobile' => '',
            'Justification' => '',
            'Remarks' => '',
            'Category' => '',
            'JumpingDivisionLevel' => '',
            'RegistrationType' => '',
            'BBMPIN' => '',
            'IPHONEPIN' => '',
            'DateSubmit' => date('c'),
            'Status' => '',
            'StatusId' => 0,
            'IsCompleted' => 0,
            'IsFetched' => 0,
            'RegisterSeason' => 1,
            'RegisterFEI' => 0,
            'isRegisterLongines' => 0,
            'SeasonCode' => 0,
            'DocumentCheck' => 0,
            'Weight' => '',
            'EID' => '',
            'Browser' => '',
            'ReferenceNumber' => '',
            'SourceID' => 0,
            'VisaCategory' => 0,
            'UAENationalCategory' => '',
            'Education' => '',
        ];

        return $this->call('Submit_PersonNewRegistration', [
            'PersonType' => $personType,
            'person' => array_merge($defaults, $person),
            'msg' => [],
        ]);
    }

    public function submitPersonRenewal(array $person, int $personType = 1): object
    {
        $defaults = [
            'PayType' => '',
            'Weight' => '',
            'EID' => '',
            'MobileNo' => '',
            'Email' => '',
            'StableID' => '',
            'JumpingDivisionLevel' => 0,
            'FormID' => 0,
            'UserId' => 0,
            'PersonID' => '',
            'DivisionID' => 0,
            'Complevel' => '',
            'DateSubmit' => date('c'),
            'ApprovalDate' => '1900-01-01T00:00:00',
            'ApprovedBy' => '',
            'Status' => '',
            'StatusID' => '',
            'isFetched' => 0,
            'RegisterSeason' => 1,
            'RegisterFEI' => 0,
            'RegisterLongines' => 0,
            'Remarks' => '',
            'SeasonCode' => 0,
            'DocumentCheck' => 0,
            'ReferenceNumber' => '',
            'SourceID' => '',
            'VisaCategory' => 0,
            'UAENationalCategory' => '',
            'Education' => '',
        ];

        return $this->call('Submit_PersonRenewal', [
            'PersonType' => $personType,
            'Person' => array_merge($defaults, $person),
            'msg' => [],
        ]);
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
