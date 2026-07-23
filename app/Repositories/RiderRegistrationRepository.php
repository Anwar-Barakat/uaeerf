<?php

namespace App\Repositories;

use Illuminate\Support\Facades\DB;

class RiderRegistrationRepository
{
    public function create(array $data): int
    {
        return DB::table('rider_registrations')->insertGetId([
            'user_id' => $data['user_id'],
            'cart_id' => $data['cart_id'],
            'rider_name' => $data['rider_name'],
            'date_of_birth' => $data['date_of_birth'],
            'nationality' => $data['nationality'],
            'passport_number' => $data['passport_number'] ?? null,
            'discipline_id' => $data['discipline_id'],
            'category_id' => $data['category_id'],
            'status' => 'pending_payment',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    public function findByCartId(string $cartId): ?object
    {
        return DB::table('rider_registrations')
            ->where('cart_id', $cartId)
            ->first();
    }

    public function updateStatus(string $cartId, string $status, array $additionalData = []): int
    {
        return DB::table('rider_registrations')
            ->where('cart_id', $cartId)
            ->update(array_merge([
                'status' => $status,
                'updated_at' => now(),
            ], $additionalData));
    }

    public function markCompleted(string $cartId, string $tranRef, ?string $soapResponse = null): int
    {
        return $this->updateStatus($cartId, 'completed', [
            'tran_ref' => $tranRef,
            'soap_response' => $soapResponse,
            'completed_at' => now(),
        ]);
    }

    public function markFailed(string $cartId, string $errorMessage): int
    {
        return $this->updateStatus($cartId, 'failed', [
            'error_message' => $errorMessage,
        ]);
    }

    public function findByUserId(int $userId, int $limit = 10): array
    {
        return DB::table('rider_registrations')
            ->where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get()
            ->toArray();
    }
}
