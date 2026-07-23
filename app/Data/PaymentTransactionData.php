<?php

namespace App\Data;

use Spatie\LaravelData\Data;

class PaymentTransactionData extends Data
{
    public function __construct(
        public string $tran_ref,
        public string $cart_id,
        public float $amount,
        public string $currency,
        public string $status,
        public ?string $response_code = null,
        public ?string $response_message = null,
        public ?string $webhook_payload = null,
        public bool $processed = false,
    ) {}
}
