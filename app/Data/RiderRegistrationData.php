<?php

namespace App\Data;

use Spatie\LaravelData\Data;

class RiderRegistrationData extends Data
{
    public function __construct(
        public string $rider_name,
        public string $date_of_birth,
        public string $nationality,
        public ?string $passport_number,
        public int $discipline_id,
        public int $category_id,
    ) {}

    public static function rules(): array
    {
        return [
            'rider_name' => ['required', 'string', 'max:255'],
            'date_of_birth' => ['required', 'date', 'before:today'],
            'nationality' => ['required', 'string', 'size:3'],
            'passport_number' => ['nullable', 'string', 'max:50'],
            'discipline_id' => ['required', 'integer', 'min:1'],
            'category_id' => ['required', 'integer', 'min:1'],
        ];
    }
}
