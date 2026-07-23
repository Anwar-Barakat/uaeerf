@extends('payment.layout')

@section('title', 'Payment Failed')

@php
    $retryUrl = str_starts_with($transaction->cart_id, 'rider_renewal')
        ? url('/rider/renewal')
        : (str_starts_with($transaction->cart_id, 'jumping')
            ? url('/jumping/entry')
            : url('/rider/registration'));
@endphp

@section('content')
    <div class="flex flex-col items-center gap-4">
        <div class="flex size-16 items-center justify-center rounded-full bg-destructive/15">
            <svg class="size-8 text-destructive" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
        </div>
        <div class="space-y-1">
            <h1 class="text-2xl font-bold tracking-tight">Payment Failed</h1>
            <p class="text-sm text-muted-foreground">
                Unfortunately, your payment could not be processed. Please try again or contact support if the issue persists.
            </p>
        </div>
    </div>

    <div class="rounded-lg border border-border/60 bg-muted/40 p-4 text-left">
        <dl class="divide-y divide-border/60 text-sm">
            <div class="flex items-center justify-between gap-4 py-2">
                <dt class="text-muted-foreground">Transaction Reference</dt>
                <dd class="font-mono text-xs font-medium">{{ $transaction->tran_ref }}</dd>
            </div>
            <div class="flex items-center justify-between gap-4 py-2">
                <dt class="text-muted-foreground">Error Code</dt>
                <dd class="font-semibold">{{ $transaction->response_code }}</dd>
            </div>
            <div class="flex items-center justify-between gap-4 py-2">
                <dt class="text-muted-foreground">Message</dt>
                <dd class="max-w-[16rem] text-right font-medium">{{ $transaction->response_message }}</dd>
            </div>
        </dl>
    </div>

    <div class="flex flex-col gap-3 sm:flex-row">
        <a href="{{ $retryUrl }}"
           class="inline-flex w-full items-center justify-center rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90">
            Try Again
        </a>
        <a href="{{ route('dashboard') }}"
           class="inline-flex w-full items-center justify-center rounded-md border border-border bg-background px-6 py-2.5 text-sm font-medium shadow-sm transition-colors hover:bg-muted">
            Back to Dashboard
        </a>
    </div>
@endsection
