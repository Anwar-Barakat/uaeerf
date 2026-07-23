<?php

namespace App\Data;

use Spatie\LaravelData\Data;

class CreateRiderRepositoryData extends Data
{
    public function __construct(
        public int $user_id,
        public string $cart_id,
        public string $rider_name,
        public string $date_of_birth,
        public string $nationality,
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
            rider_name: $data->rider_name,
            date_of_birth: $data->date_of_birth,
            nationality: $data->nationality,
            passport_number: $data->passport_number,
            discipline_id: $data->discipline_id,
            category_id: $data->category_id,
        );
    }
}
