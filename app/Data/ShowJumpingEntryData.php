<?php

namespace App\Data;

use Spatie\LaravelData\Data;

class ShowJumpingEntryData extends Data
{
    public function __construct(
        public int $rider_id,
        public int $horse_id,
        public int $event_id,
        public int $class_id,
        public string $event_name,
    ) {}

    public static function rules(): array
    {
        return [
            'rider_id' => ['required', 'integer', 'min:1'],
            'horse_id' => ['required', 'integer', 'min:1'],
            'event_id' => ['required', 'integer', 'min:1'],
            'class_id' => ['required', 'integer', 'min:1'],
            'event_name' => ['required', 'string', 'max:255'],
        ];
    }
}
