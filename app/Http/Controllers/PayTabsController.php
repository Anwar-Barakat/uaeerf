<?php

namespace App\Http\Controllers;

use App\Data\PaymentWebhookData;
use App\Repositories\PaymentTransactionRepository;
use App\Services\PayTabsService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PayTabsController extends Controller
{
    public function __construct(
        protected PayTabsService $payTabsService,
        protected PaymentTransactionRepository $transactionRepo
    ) {}

    /**
     * Handle PayTabs webhook (IPN)
     * This is the SOURCE OF TRUTH for payment status
     */
    public function webhook(Request $request)
    {
        Log::info('PayTabs webhook received', [
            'payload' => $request->all(),
            'signature' => $request->header('Signature'),
        ]);

        // Verify signature
        $signature = $request->header('Signature') ?? $request->header('signature');
        if (!$signature || !$this->payTabsService->verifyWebhookSignature($request->all(), $signature)) {
            Log::warning('PayTabs webhook signature verification failed');
            return response()->json(['error' => 'Invalid signature'], 401);
        }

        // Parse and validate webhook data using DTO
        $webhookData = PaymentWebhookData::from($this->payTabsService->parseWebhook($request->all()));

        // Store transaction record
        $this->transactionRepo->create([
            'tran_ref' => $webhookData->tran_ref,
            'cart_id' => $webhookData->cart_id,
            'amount' => $webhookData->cart_amount,
            'currency' => $webhookData->cart_currency,
            'status' => $webhookData->isSuccessful() ? 'success' : 'failed',
            'response_code' => $webhookData->payment_result->response_code,
            'response_message' => $webhookData->payment_result->response_message,
            'webhook_payload' => json_encode($request->all()),
        ]);

        if (!$webhookData->isSuccessful()) {
            Log::warning('PayTabs payment failed', [
                'cart_id' => $webhookData->cart_id,
                'response' => $webhookData->payment_result,
            ]);

            return response()->json(['status' => 'failed']);
        }

        // Payment successful - process based on cart_id type
        $this->processSuccessfulPayment($webhookData);

        return response()->json(['status' => 'success']);
    }

    /**
     * Process successful payment based on type
     */
    protected function processSuccessfulPayment(PaymentWebhookData $webhookData): void
    {
        $cartId = $webhookData->cart_id;
        $tranRef = $webhookData->tran_ref;

        // Parse cart_id to determine type: "rider_reg_123_abc", "rider_renewal_456_xyz", "jumping_789_def"
        if (str_starts_with($cartId, 'rider_reg_')) {
            $this->processRiderRegistration($cartId, $tranRef, $webhookData);
        } elseif (str_starts_with($cartId, 'rider_renewal_')) {
            $this->processRiderRenewal($cartId, $tranRef, $webhookData);
        } elseif (str_starts_with($cartId, 'jumping_')) {
            $this->processShowJumpingEntry($cartId, $tranRef, $webhookData);
        } else {
            Log::error('Unknown cart_id type', ['cart_id' => $cartId]);
        }
    }

    /**
     * Process rider registration payment
     */
    protected function processRiderRegistration(string $cartId, string $tranRef, PaymentWebhookData $webhookData): void
    {
        app(\App\Http\Controllers\RiderController::class)->processRegistration($cartId, $tranRef);
        $this->transactionRepo->markProcessed($cartId);
    }

    /**
     * Process rider renewal payment
     */
    protected function processRiderRenewal(string $cartId, string $tranRef, PaymentWebhookData $webhookData): void
    {
        app(\App\Http\Controllers\RiderController::class)->processRenewal($cartId, $tranRef);
        $this->transactionRepo->markProcessed($cartId);
    }

    /**
     * Process show jumping entry payment
     */
    protected function processShowJumpingEntry(string $cartId, string $tranRef, PaymentWebhookData $webhookData): void
    {
        app(\App\Http\Controllers\ShowJumpingController::class)->processEntry($cartId, $tranRef);
        $this->transactionRepo->markProcessed($cartId);
    }

    /**
     * Handle return URL (user redirected back after payment)
     * This is for UI only - webhook is source of truth
     */
    public function returnUrl(Request $request)
    {
        $tranRef = $request->query('tranRef');
        $cartId = $request->query('cartId');

        Log::info('User returned from PayTabs', [
            'tran_ref' => $tranRef,
            'cart_id' => $cartId,
        ]);

        // Check payment status from database (populated by webhook)
        $transaction = $this->transactionRepo->findByCartId($cartId);

        if (!$transaction) {
            return view('payment.pending', [
                'message' => 'Payment processing... Please wait.',
            ]);
        }

        if ($transaction->status === 'success') {
            return view('payment.success', [
                'transaction' => $transaction,
            ]);
        }

        return view('payment.failed', [
            'transaction' => $transaction,
        ]);
    }
}
