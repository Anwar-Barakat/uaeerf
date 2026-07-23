<?php

use App\Services\PayTabsService;
use App\Services\Soap\RegistrationsService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

const WEBHOOK_TEST_KEY = 'test-server-key';

beforeEach(function () {
    config()->set('services.paytabs.server_key', WEBHOOK_TEST_KEY);
    config()->set('database.connections.mssql', [
        'driver' => 'sqlite',
        'database' => ':memory:',
        'prefix' => '',
        'foreign_key_constraints' => false,
    ]);

    Schema::connection('mssql')->create('payment_transactions', function ($table) {
        $table->id();
        $table->string('tran_ref')->unique();
        $table->string('cart_id')->unique();
        $table->decimal('amount', 10, 2);
        $table->string('currency', 3)->default('AED');
        $table->string('status')->default('pending');
        $table->string('response_code')->nullable();
        $table->text('response_message')->nullable();
        $table->json('webhook_payload')->nullable();
        $table->boolean('processed')->default(false);
        $table->timestamp('processed_at')->nullable();
        $table->timestamps();
    });

    Schema::connection('mssql')->create('rider_registrations', function ($table) {
        $table->id();
        $table->unsignedBigInteger('user_id');
        $table->string('cart_id')->unique();
        $table->string('rider_name');
        $table->date('date_of_birth');
        $table->string('nationality', 3);
        $table->string('gender_id')->nullable();
        $table->string('nationality_id')->nullable();
        $table->string('city_id')->nullable();
        $table->string('country_id')->nullable();
        $table->string('email')->nullable();
        $table->string('mobile')->nullable();
        $table->string('address')->nullable();
        $table->string('po_box')->nullable();
        $table->string('passport_number')->nullable();
        $table->integer('discipline_id');
        $table->integer('category_id');
        $table->string('status')->default('pending_payment');
        $table->string('tran_ref')->nullable();
        $table->text('soap_response')->nullable();
        $table->text('error_message')->nullable();
        $table->timestamp('completed_at')->nullable();
        $table->timestamps();
    });

    Schema::connection('mssql')->create('rider_renewals', function ($table) {
        $table->id();
        $table->unsignedBigInteger('user_id');
        $table->string('cart_id')->unique();
        $table->string('rider_id');
        $table->integer('season_id');
        $table->string('status')->default('pending_payment');
        $table->string('tran_ref')->nullable();
        $table->text('soap_response')->nullable();
        $table->text('error_message')->nullable();
        $table->timestamp('completed_at')->nullable();
        $table->timestamps();
    });
});

function webhookPayload(array $overrides = []): array
{
    return array_merge([
        'tran_ref' => 'TST0000000001',
        'cart_id' => 'rider_reg_1_testcart',
        'cart_amount' => 100.00,
        'cart_currency' => 'AED',
        'tran_type' => 'Sale',
        'payment_result' => [
            'response_status' => 'A',
            'response_code' => 'G00000',
            'response_message' => 'Authorised',
        ],
    ], $overrides);
}

function postWebhook(array $payload, ?string $signature = null)
{
    $body = json_encode($payload);
    $signature ??= hash_hmac('sha256', $body, WEBHOOK_TEST_KEY);

    return test()->call('POST', '/api/paytabs/webhook', [], [], [], [
        'HTTP_SIGNATURE' => $signature,
        'CONTENT_TYPE' => 'application/json',
        'HTTP_ACCEPT' => 'application/json',
    ], $body);
}

function createPendingRegistration(string $cartId): void
{
    DB::connection('mssql')->table('rider_registrations')->insert([
        'user_id' => 1,
        'cart_id' => $cartId,
        'rider_name' => 'Test Rider',
        'date_of_birth' => '2000-01-01',
        'nationality' => 'ARE',
        'passport_number' => 'P123456',
        'discipline_id' => 2,
        'category_id' => 9,
        'status' => 'pending_payment',
        'created_at' => now(),
        'updated_at' => now(),
    ]);
}

function mockSoapRegistration(bool $result = true): void
{
    test()->mock(RegistrationsService::class, function ($mock) use ($result) {
        $mock->shouldReceive('submitPersonNewRegistration')
            ->andReturn((object) [
                'Submit_PersonNewRegistrationResult' => $result,
                'msg' => (object) ['string' => $result ? [] : ['Rejected by server']],
            ]);
    });
}

function createPendingRenewal(string $cartId): void
{
    DB::connection('mssql')->table('rider_renewals')->insert([
        'user_id' => 1,
        'cart_id' => $cartId,
        'rider_id' => 'E0022141',
        'season_id' => 13,
        'status' => 'pending_payment',
        'created_at' => now(),
        'updated_at' => now(),
    ]);
}

function mockSoapRenewal(bool $result = true): void
{
    test()->mock(RegistrationsService::class, function ($mock) use ($result) {
        $mock->shouldReceive('submitPersonRenewal')
            ->andReturn((object) [
                'Submit_PersonRenewalResult' => $result,
                'msg' => (object) ['string' => $result ? [] : ['Renewal rejected by server']],
            ]);
    });
}

test('webhook rejects request with missing signature', function () {
    $response = postWebhook(webhookPayload(), '');

    $response->assertStatus(400);
    expect(DB::connection('mssql')->table('payment_transactions')->count())->toBe(0);
});

test('webhook rejects request with invalid signature', function () {
    $response = postWebhook(webhookPayload(), 'invalid-signature');

    $response->assertStatus(400);
    expect(DB::connection('mssql')->table('payment_transactions')->count())->toBe(0);
});

test('webhook with valid signature processes successful payment', function () {
    mockSoapRegistration(true);
    createPendingRegistration('rider_reg_1_testcart');

    $response = postWebhook(webhookPayload());

    $response->assertOk()->assertJson(['status' => 'success']);

    $transaction = DB::connection('mssql')->table('payment_transactions')
        ->where('cart_id', 'rider_reg_1_testcart')->first();
    expect($transaction)->not->toBeNull();
    expect($transaction->status)->toBe('success');
    expect((bool) $transaction->processed)->toBeTrue();

    $registration = DB::connection('mssql')->table('rider_registrations')
        ->where('cart_id', 'rider_reg_1_testcart')->first();
    expect($registration->status)->toBe('completed');
    expect($registration->tran_ref)->toBe('TST0000000001');
});

test('webhook marks registration failed when soap rejects', function () {
    mockSoapRegistration(false);
    createPendingRegistration('rider_reg_1_testcart');

    $response = postWebhook(webhookPayload());

    $response->assertOk();

    $registration = DB::connection('mssql')->table('rider_registrations')
        ->where('cart_id', 'rider_reg_1_testcart')->first();
    expect($registration->status)->toBe('failed');
    expect($registration->error_message)->toContain('Rejected by server');
});

test('webhook records declined payment without processing registration', function () {
    createPendingRegistration('rider_reg_1_testcart');

    $payload = webhookPayload([
        'payment_result' => [
            'response_status' => 'D',
            'response_code' => 'E001',
            'response_message' => 'Declined',
        ],
    ]);

    $response = postWebhook($payload);

    $response->assertOk()->assertJson(['status' => 'failed']);

    $transaction = DB::connection('mssql')->table('payment_transactions')
        ->where('cart_id', 'rider_reg_1_testcart')->first();
    expect($transaction->status)->toBe('failed');

    $registration = DB::connection('mssql')->table('rider_registrations')
        ->where('cart_id', 'rider_reg_1_testcart')->first();
    expect($registration->status)->toBe('pending_payment');
});

test('webhook processes successful renewal payment', function () {
    mockSoapRenewal(true);
    createPendingRenewal('rider_renewal_1_testcart');

    $response = postWebhook(webhookPayload([
        'cart_id' => 'rider_renewal_1_testcart',
        'tran_ref' => 'TST0000000002',
        'cart_amount' => 50.00,
    ]));

    $response->assertOk()->assertJson(['status' => 'success']);

    $renewal = DB::connection('mssql')->table('rider_renewals')
        ->where('cart_id', 'rider_renewal_1_testcart')->first();
    expect($renewal->status)->toBe('completed');
    expect($renewal->tran_ref)->toBe('TST0000000002');
});

test('webhook marks renewal failed when soap rejects', function () {
    mockSoapRenewal(false);
    createPendingRenewal('rider_renewal_1_testcart');

    postWebhook(webhookPayload([
        'cart_id' => 'rider_renewal_1_testcart',
        'tran_ref' => 'TST0000000003',
        'cart_amount' => 50.00,
    ]))->assertOk();

    $renewal = DB::connection('mssql')->table('rider_renewals')
        ->where('cart_id', 'rider_renewal_1_testcart')->first();
    expect($renewal->status)->toBe('failed');
    expect($renewal->error_message)->toContain('Renewal rejected by server');
});

test('duplicate webhook is skipped idempotently', function () {
    mockSoapRegistration(true);
    createPendingRegistration('rider_reg_1_testcart');

    postWebhook(webhookPayload())->assertOk();
    $response = postWebhook(webhookPayload());

    $response->assertOk()->assertJson(['status' => 'already_processed']);
    expect(DB::connection('mssql')->table('payment_transactions')->count())->toBe(1);
});

test('return url post redirects to get with params', function () {
    $response = $this->post('/api/payment/return', [
        'tranRef' => 'TST0000000001',
        'cartId' => 'rider_reg_1_testcart',
    ]);

    $response->assertRedirect(route('payment.return', [
        'tranRef' => 'TST0000000001',
        'cartId' => 'rider_reg_1_testcart',
    ]));
});

test('return url without cart id shows pending view', function () {
    $response = $this->get('/api/payment/return');

    $response->assertOk()->assertViewIs('payment.pending');
});

test('return url with unknown cart id shows pending view', function () {
    $response = $this->get('/api/payment/return?cartId=unknown_cart');

    $response->assertOk()->assertViewIs('payment.pending');
});

test('return url shows success view for successful transaction', function () {
    DB::connection('mssql')->table('payment_transactions')->insert([
        'tran_ref' => 'TST0000000001',
        'cart_id' => 'rider_reg_1_testcart',
        'amount' => 100.00,
        'currency' => 'AED',
        'status' => 'success',
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    $response = $this->get('/api/payment/return?cartId=rider_reg_1_testcart&tranRef=TST0000000001');

    $response->assertOk()->assertViewIs('payment.success');
});

test('return url shows failed view for failed transaction', function () {
    DB::connection('mssql')->table('payment_transactions')->insert([
        'tran_ref' => 'TST0000000001',
        'cart_id' => 'rider_reg_1_testcart',
        'amount' => 100.00,
        'currency' => 'AED',
        'status' => 'failed',
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    $response = $this->get('/api/payment/return?cartId=rider_reg_1_testcart&tranRef=TST0000000001');

    $response->assertOk()->assertViewIs('payment.failed');
});

test('verify webhook signature accepts correct hmac of raw body', function () {
    $service = app(PayTabsService::class);
    $body = json_encode(['cart_id' => 'abc', 'tran_ref' => 'xyz']);
    $signature = hash_hmac('sha256', $body, WEBHOOK_TEST_KEY);

    expect($service->verifyWebhookSignature($body, $signature))->toBeTrue();
    expect($service->verifyWebhookSignature($body, 'wrong'))->toBeFalse();
    expect($service->verifyWebhookSignature($body . ' ', $signature))->toBeFalse();
});

test('is payment successful only for status A', function () {
    $service = app(PayTabsService::class);

    expect($service->isPaymentSuccessful(['payment_result' => ['response_status' => 'A']]))->toBeTrue();
    expect($service->isPaymentSuccessful(['payment_result' => ['response_status' => 'a']]))->toBeTrue();
    expect($service->isPaymentSuccessful(['payment_result' => ['response_status' => 'D']]))->toBeFalse();
    expect($service->isPaymentSuccessful([]))->toBeFalse();
});

test('generate cart id contains type and user id', function () {
    $cartId = PayTabsService::generateCartId('rider_reg', 42);

    expect($cartId)->toStartWith('rider_reg_42_');
    expect(PayTabsService::generateCartId('jumping', 7))->toStartWith('jumping_7_');
});
