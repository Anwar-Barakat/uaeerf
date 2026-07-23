<?php

namespace App\Repositories;

use App\Data\PaymentTransactionData;
use App\Models\PaymentTransaction;
use Illuminate\Support\Facades\DB;

class PaymentTransactionRepository
{
    public function create(PaymentTransactionData $data): PaymentTransaction
    {
        return PaymentTransaction::create($data->toArray());
    }

    public function findByCartId(string $cartId): ?PaymentTransaction
    {
        return PaymentTransaction::where('cart_id', $cartId)->first();
    }

    public function findByTranRef(string $tranRef): ?PaymentTransaction
    {
        return PaymentTransaction::where('tran_ref', $tranRef)->first();
    }

    public function markProcessed(string $cartId): bool
    {
        return PaymentTransaction::where('cart_id', $cartId)
            ->update([
                'processed' => true,
                'processed_at' => now(),
            ]) > 0;
    }

    public function isProcessed(string $cartId): bool
    {
        $transaction = $this->findByCartId($cartId);
        return $transaction && $transaction->processed;
    }

    public function getRecentTransactions(int $limit = 50): array
    {
        return PaymentTransaction::orderBy('created_at', 'desc')
            ->limit($limit)
            ->get()
            ->toArray();
    }

    public function getSuccessfulTransactions(int $limit = 50): array
    {
        return PaymentTransaction::where('status', 'success')
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
