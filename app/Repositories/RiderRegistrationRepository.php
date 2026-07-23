<?php

namespace App\Repositories;

use App\Data\CreateRiderRepositoryData;
use App\Models\RiderRegistration;
use Illuminate\Support\Facades\DB;

class RiderRegistrationRepository
{
    public function create(CreateRiderRepositoryData $data): RiderRegistration
    {
        return RiderRegistration::create($data->toArray());
    }

    public function findByCartId(string $cartId): ?RiderRegistration
    {
        return RiderRegistration::where('cart_id', $cartId)->first();
    }

    public function updateStatus(string $cartId, string $status, array $additionalData = []): bool
    {
        return RiderRegistration::where('cart_id', $cartId)
            ->update(array_merge([
                'status' => $status,
            ], $additionalData)) > 0;
    }

    public function markCompleted(string $cartId, string $tranRef, ?string $soapResponse = null): bool
    {
        return $this->updateStatus($cartId, 'completed', [
            'tran_ref' => $tranRef,
            'soap_response' => $soapResponse,
            'completed_at' => now(),
        ]);
    }

    public function markFailed(string $cartId, string $errorMessage): bool
    {
        return $this->updateStatus($cartId, 'failed', [
            'error_message' => $errorMessage,
        ]);
    }

    public function findByUserId(int $userId, int $limit = 10): array
    {
        return RiderRegistration::where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get()
            ->toArray();
    }

    public function processWithTransaction(callable $callback)
    {
        return DB::connection('mssql')->transaction($callback);
    }
}
