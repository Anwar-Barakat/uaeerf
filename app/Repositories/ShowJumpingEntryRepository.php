<?php

namespace App\Repositories;

use Illuminate\Support\Facades\DB;

class ShowJumpingEntryRepository
{
    protected string $connection = 'mssql';

    public function create(array $data): int
    {
        return DB::connection($this->connection)->table('show_jumping_entries')->insertGetId([
            'user_id' => $data['user_id'],
            'cart_id' => $data['cart_id'],
            'rider_id' => $data['rider_id'],
            'horse_id' => $data['horse_id'],
            'event_id' => $data['event_id'],
            'class_id' => $data['class_id'],
            'event_name' => $data['event_name'],
            'status' => 'pending_payment',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    public function findByCartId(string $cartId): ?object
    {
        return DB::connection($this->connection)->table('show_jumping_entries')
            ->where('cart_id', $cartId)
            ->first();
    }

    public function updateStatus(string $cartId, string $status, array $additionalData = []): int
    {
        return DB::connection($this->connection)->table('show_jumping_entries')
            ->where('cart_id', $cartId)
            ->update(array_merge([
                'status' => $status,
                'updated_at' => now(),
            ], $additionalData));
    }

    public function markCompleted(string $cartId, string $tranRef): int
    {
        return $this->updateStatus($cartId, 'completed', [
            'tran_ref' => $tranRef,
            'completed_at' => now(),
        ]);
    }

    public function markFailed(string $cartId, string $errorMessage): int
    {
        return $this->updateStatus($cartId, 'failed', [
            'error_message' => $errorMessage,
        ]);
    }

    public function insertToClassEntriesWeb(object $entry, string $tranRef): void
    {
        DB::connection($this->connection)->table('ClassEntriesWeb')->insert([
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
        return DB::connection($this->connection)->table('show_jumping_entries')
            ->where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get()
            ->toArray();
    }

    /**
     * Process entry in transaction
     */
    public function processWithTransaction(callable $callback)
    {
        return DB::connection($this->connection)->transaction($callback);
    }
}
