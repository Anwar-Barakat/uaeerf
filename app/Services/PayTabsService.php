<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class PayTabsService
{
    protected string $endpoint;
    protected string $profileId;
    protected string $serverKey;
    protected string $callbackUrl;
    protected string $returnUrl;

    public function __construct()
    {
        $this->endpoint = config('services.paytabs.endpoint');
        $this->profileId = config('services.paytabs.profile_id');
        $this->serverKey = config('services.paytabs.server_key');
        $this->callbackUrl = config('services.paytabs.callback_url');
        $this->returnUrl = config('services.paytabs.return_url');
    }

    public function createRiderRegistrationPayment(array $userData, string $cartId): array
    {
        return $this->createPayment([
            'cart_id' => $cartId,
            'cart_description' => 'Rider Registration',
            'cart_amount' => 100.00,
            'cart_currency' => 'AED',
            'customer_details' => [
                'name' => $userData['name'],
                'email' => $userData['email'],
                'phone' => $userData['phone'],
                'street1' => $userData['address'] ?? 'N/A',
                'city' => $userData['city'] ?? 'Dubai',
                'state' => $userData['state'] ?? 'Dubai',
                'country' => $userData['country'] ?? 'AE',
                'zip' => $userData['zip'] ?? '00000',
            ],
        ]);
    }

    public function createRiderRenewalPayment(array $userData, string $cartId): array
    {
        return $this->createPayment([
            'cart_id' => $cartId,
            'cart_description' => 'Rider Renewal',
            'cart_amount' => 50.00,
            'cart_currency' => 'AED',
            'customer_details' => [
                'name' => $userData['name'],
                'email' => $userData['email'],
                'phone' => $userData['phone'],
                'street1' => $userData['address'] ?? 'N/A',
                'city' => $userData['city'] ?? 'Dubai',
                'state' => $userData['state'] ?? 'Dubai',
                'country' => $userData['country'] ?? 'AE',
                'zip' => $userData['zip'] ?? '00000',
            ],
        ]);
    }

    public function createShowJumpingPayment(array $userData, array $entryData, string $cartId): array
    {
        return $this->createPayment([
            'cart_id' => $cartId,
            'cart_description' => sprintf(
                'Show Jumping Entry - %s',
                $entryData['event_name'] ?? 'Competition'
            ),
            'cart_amount' => 150.00,
            'cart_currency' => 'AED',
            'customer_details' => [
                'name' => $userData['name'],
                'email' => $userData['email'],
                'phone' => $userData['phone'],
                'street1' => $userData['address'] ?? 'N/A',
                'city' => $userData['city'] ?? 'Dubai',
                'state' => $userData['state'] ?? 'Dubai',
                'country' => $userData['country'] ?? 'AE',
                'zip' => $userData['zip'] ?? '00000',
            ],
        ]);
    }

    protected function createPayment(array $data): array
    {
        $payload = [
            'profile_id' => $this->profileId,
            'tran_type' => 'sale',
            'tran_class' => 'ecom',
            'cart_id' => $data['cart_id'],
            'cart_description' => $data['cart_description'],
            'cart_currency' => $data['cart_currency'],
            'cart_amount' => $data['cart_amount'],
            'callback' => $this->callbackUrl,
            'return' => $this->returnUrl,
            'customer_details' => $data['customer_details'],
        ];

        Log::info('PayTabs payment request', [
            'cart_id' => $data['cart_id'],
            'amount' => $data['cart_amount'],
        ]);

        $response = Http::withHeaders([
            'Authorization' => $this->serverKey,
            'Content-Type' => 'application/json',
        ])->post($this->endpoint, $payload);

        if (!$response->successful()) {
            Log::error('PayTabs payment creation failed', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);

            throw new \RuntimeException('Failed to create payment: ' . $response->body());
        }

        $result = $response->json();

        Log::info('PayTabs payment created', [
            'cart_id' => $data['cart_id'],
            'tran_ref' => $result['tran_ref'] ?? null,
            'redirect_url' => $result['redirect_url'] ?? null,
        ]);

        return $result;
    }

    public function verifyWebhookSignature(array $payload, string $signature): bool
    {
        $calculatedSignature = hash_hmac('sha256', json_encode($payload), $this->serverKey);

        return hash_equals($calculatedSignature, $signature);
    }

    public function parseWebhook(array $payload): array
    {
        return [
            'tran_ref' => $payload['tran_ref'] ?? null,
            'cart_id' => $payload['cart_id'] ?? null,
            'cart_amount' => $payload['cart_amount'] ?? null,
            'cart_currency' => $payload['cart_currency'] ?? null,
            'tran_type' => $payload['tran_type'] ?? null,
            'payment_result' => [
                'response_status' => $payload['payment_result']['response_status'] ?? null,
                'response_code' => $payload['payment_result']['response_code'] ?? null,
                'response_message' => $payload['payment_result']['response_message'] ?? null,
            ],
            'customer_details' => $payload['customer_details'] ?? [],
        ];
    }

    public function isPaymentSuccessful(array $webhookData): bool
    {
        return isset($webhookData['payment_result']['response_status'])
            && strtoupper($webhookData['payment_result']['response_status']) === 'A';
    }

    public static function generateCartId(string $type, int $userId): string
    {
        return sprintf('%s_%d_%s', $type, $userId, uniqid());
    }
}
