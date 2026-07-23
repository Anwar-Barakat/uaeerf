<?php

namespace App\Data;

use Spatie\LaravelData\Data;

class RiderRenewalData extends Data
{
    public function __construct(
        public string $rider_id,
        public int $season_id,
    ) {}

    public static function rules(): array
    {
        return [
            'rider_id' => ['required', 'string', 'max:20'],
            'season_id' => ['required', 'integer', 'min:1'],
        ];
    }
}
