@extends('payment.layout')

@section('title', 'Processing Payment')

@section('head')
    <meta http-equiv="refresh" content="3">
@endsection

@section('content')
    <div class="flex flex-col items-center gap-4">
        <div class="flex size-16 items-center justify-center rounded-full bg-amber-500/15">
            <svg class="size-8 animate-spin text-amber-500" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
            </svg>
        </div>
        <div class="space-y-1">
            <h1 class="text-2xl font-bold tracking-tight">Processing Payment</h1>
            <p class="text-sm text-muted-foreground">
                {{ $message ?? 'Payment processing... Please wait.' }}
            </p>
        </div>
    </div>

    <p class="text-xs text-muted-foreground">This page will refresh automatically…</p>

    <a href="{{ route('dashboard') }}"
       class="inline-flex w-full items-center justify-center rounded-md border border-border bg-background px-6 py-2.5 text-sm font-medium shadow-sm transition-colors hover:bg-muted">
        Back to Dashboard
    </a>
@endsection
