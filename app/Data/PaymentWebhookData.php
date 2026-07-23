<?php

namespace App\Data;

use Spatie\LaravelData\Data;

class PaymentWebhookData extends Data
{
    public function __construct(
        public string $tran_ref,
        public string $cart_id,
        public float $cart_amount,
        public string $cart_currency,
        public string $tran_type,
        public PaymentResultData $payment_result,
        public array $customer_details = [],
    ) {}

    public function isSuccessful(): bool
    {
        return strtoupper($this->payment_result->response_status) === 'A';
    }
}

class PaymentResultData extends Data
{
    public function __construct(
        public string $response_status,
        public string $response_code,
        public string $response_message,
    ) {}
}
