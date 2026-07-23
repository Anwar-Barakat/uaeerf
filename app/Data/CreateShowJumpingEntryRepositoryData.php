<?php

namespace App\Data;

use Spatie\LaravelData\Data;

class CreateShowJumpingEntryRepositoryData extends Data
{
    public function __construct(
        public int $user_id,
        public string $cart_id,
        public int $rider_id,
        public int $horse_id,
        public int $event_id,
        public int $class_id,
        public string $event_name,
    ) {}

    public static function fromEntryData(
        int $userId,
        string $cartId,
        ShowJumpingEntryData $data
    ): self {
        return new self(
            user_id: $userId,
            cart_id: $cartId,
            rider_id: $data->rider_id,
            horse_id: $data->horse_id,
            event_id: $data->event_id,
            class_id: $data->class_id,
            event_name: $data->event_name,
        );
    }
}
