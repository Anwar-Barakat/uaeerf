<?php

namespace App\Data;

use Spatie\LaravelData\Data;

class CreateRiderRenewalRepositoryData extends Data
{
    public function __construct(
        public int $user_id,
        public string $cart_id,
        public int $rider_id,
        public int $season_id,
    ) {}

    public static function fromRenewalData(int $userId, string $cartId, RiderRenewalData $data): self
    {
        return new self(
            user_id: $userId,
            cart_id: $cartId,
            rider_id: $data->rider_id,
            season_id: $data->season_id,
        );
    }
}
