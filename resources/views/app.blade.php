<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        {{-- Soft light theme background to avoid a white flash before app.css loads --}}
        <style>
            html {
                background-color: oklch(0.966 0.003 160);
            }
        </style>

        <link rel="icon" href="/images/logo.jpeg" sizes="any">
        <link rel="apple-touch-icon" href="/images/logo.jpeg">

        @fonts

        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
        <x-inertia::head>
            <title>{{ config('app.name', 'Laravel') }}</title>
        </x-inertia::head>
    </head>
    <body class="font-sans antialiased">
        <x-inertia::app />
    </body>
</html>
