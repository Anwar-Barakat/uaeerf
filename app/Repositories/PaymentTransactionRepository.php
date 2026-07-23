<?php

namespace App\Repositories;

use Illuminate\Support\Facades\DB;

class PaymentTransactionRepository
{
    public function create(array $data): int
    {
        return DB::table('payment_transactions')->insertGetId([
            'tran_ref' => $data['tran_ref'],
            'cart_id' => $data['cart_id'],
            'amount' => $data['amount'],
            'currency' => $data['currency'],
            'status' => $data['status'],
            'response_code' => $data['response_code'] ?? null,
            'response_message' => $data['response_message'] ?? null,
            'webhook_payload' => $data['webhook_payload'] ?? null,
            'processed' => false,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    public function findByCartId(string $cartId): ?object
    {
        return DB::table('payment_transactions')
            ->where('cart_id', $cartId)
            ->first();
    }

    public function findByTranRef(string $tranRef): ?object
    {
        return DB::table('payment_transactions')
            ->where('tran_ref', $tranRef)
            ->first();
    }

    public function markProcessed(string $cartId): int
    {
        return DB::table('payment_transactions')
            ->where('cart_id', $cartId)
            ->update([
                'processed' => true,
                'processed_at' => now(),
                'updated_at' => now(),
            ]);
    }

    public function isProcessed(string $cartId): bool
    {
        $transaction = $this->findByCartId($cartId);
        return $transaction && $transaction->processed;
    }

    public function getRecentTransactions(int $limit = 50): array
    {
        return DB::table('payment_transactions')
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get()
            ->toArray();
    }

    public function getSuccessfulTransactions(int $limit = 50): array
    {
        return DB::table('payment_transactions')
            ->where('status', 'success')
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get()
            ->toArray();
    }
}
