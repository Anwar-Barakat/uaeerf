<?php

namespace App\Repositories;

use App\Data\CreateShowJumpingEntryRepositoryData;
use App\Models\ShowJumpingEntry;
use Illuminate\Support\Facades\DB;

class ShowJumpingEntryRepository
{
    public function create(CreateShowJumpingEntryRepositoryData $data): ShowJumpingEntry
    {
        return ShowJumpingEntry::create($data->toArray());
    }

    public function findByCartId(string $cartId): ?ShowJumpingEntry
    {
        return ShowJumpingEntry::where('cart_id', $cartId)->first();
    }

    public function updateStatus(string $cartId, string $status, array $additionalData = []): bool
    {
        return ShowJumpingEntry::where('cart_id', $cartId)
            ->update(array_merge([
                'status' => $status,
            ], $additionalData)) > 0;
    }

    public function markCompleted(string $cartId, string $tranRef): bool
    {
        return $this->updateStatus($cartId, 'completed', [
            'tran_ref' => $tranRef,
            'completed_at' => now(),
        ]);
    }

    public function markFailed(string $cartId, string $errorMessage): bool
    {
        return $this->updateStatus($cartId, 'failed', [
            'error_message' => $errorMessage,
        ]);
    }

    public function insertToClassEntriesWeb(ShowJumpingEntry $entry, string $tranRef): void
    {
        DB::connection('mssql')->table('ClassEntriesWeb')->insert([
            'RiderID' => $entry->rider_id,
            'HorseID' => $entry->horse_id,
            'EventID' => $entry->event_id,
            'ClassID' => $entry->class_id,
            'TransactionReference' => $tranRef,
            'EntryDate' => now(),
            'Status' => 'Confirmed',
            'PaymentAmount' => 150.00,
            'PaymentCurrency' => 'AED',
            'CreatedAt' => now(),
        ]);
    }

    public function findByUserId(int $userId, int $limit = 10): array
    {
        return ShowJumpingEntry::where('user_id', $userId)
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
