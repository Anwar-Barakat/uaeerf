<?php

namespace App\Data;

use Spatie\LaravelData\Data;

class CreateRiderRepositoryData extends Data
{
    public function __construct(
        public int $user_id,
        public string $cart_id,
        public string $rider_name,
        public string $first_name,
        public string $last_name,
        public string $date_of_birth,
        public string $nationality,
        public string $gender_id,
        public string $nationality_id,
        public string $city_id,
        public string $country_id,
        public string $email,
        public string $mobile,
        public string $address,
        public string $po_box,
        public string $weight,
        public string $visa_category,
        public string $eid,
        public bool $register_season,
        public bool $register_fei,
        public ?string $passport_number,
        public int $discipline_id,
        public int $category_id,
    ) {}

    public static function fromRegistrationData(
        int $userId,
        string $cartId,
        RiderRegistrationData $data
    ): self {
        return new self(
            user_id: $userId,
            cart_id: $cartId,
            rider_name: trim($data->first_name . ' ' . $data->last_name),
            first_name: $data->first_name,
            last_name: $data->last_name,
            date_of_birth: $data->date_of_birth,
            nationality: $data->nationality,
            gender_id: $data->gender_id,
            nationality_id: $data->nationality_id,
            city_id: $data->city_id,
            country_id: $data->country_id,
            email: $data->email,
            mobile: $data->mobile,
            address: $data->address,
            po_box: $data->po_box,
            weight: $data->weight,
            visa_category: $data->visa_category,
            eid: $data->eid,
            register_season: $data->register_season,
            register_fei: $data->register_fei,
            passport_number: $data->passport_number,
            discipline_id: $data->discipline_id,
            category_id: $data->category_id,
        );
    }
}
