<!DOCTYPE html>
<html lang="en" class="{{ request()->cookie('appearance') === 'dark' ? 'dark' : '' }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>@yield('title') - {{ config('app.name') }}</title>

    <link rel="icon" href="/images/logo.jpeg" sizes="any">
    <link rel="apple-touch-icon" href="/images/logo.jpeg">

    @yield('head')

    @vite(['resources/css/app.css'])
</head>
<body class="font-sans antialiased">
    <div class="relative min-h-svh overflow-y-auto bg-gradient-to-br from-slate-100 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div class="pointer-events-none absolute inset-0 overflow-hidden">
            <div class="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-primary/20 blur-3xl dark:bg-primary/10"></div>
            <div class="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-emerald-400/20 blur-3xl dark:bg-emerald-500/10"></div>
            <div class="absolute left-1/2 top-1/2 h-[32rem] w-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-300/10 blur-3xl dark:bg-sky-500/5"></div>
        </div>

        <div class="relative flex min-h-svh items-center justify-center p-4 sm:p-6">
            <div class="w-full max-w-md py-8">
                <div class="rounded-xl border border-border/60 bg-card/80 text-card-foreground shadow-2xl shadow-primary/10 backdrop-blur-xl">
                    <div class="space-y-6 p-6 text-center sm:p-8">
                        <div class="flex flex-col items-center gap-3">
                            <img
                                src="/images/logo.jpeg"
                                alt="UAEERF Logo"
                                class="h-16 w-auto rounded-xl object-contain"
                            >
                            <div>
                                <p class="text-sm font-bold tracking-tight text-foreground">
                                    UAE Equestrian &amp; Racing Federation
                                </p>
                                <p class="mt-0.5 text-xs text-muted-foreground">
                                    الاتحاد الإماراتي للفروسية والسباق
                                </p>
                            </div>
                        </div>

                        <div class="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent"></div>

                        @yield('content')
                    </div>
                </div>

                <div class="mt-6 text-center">
                    <p class="text-xs text-muted-foreground">
                        © {{ date('Y') }} UAE Equestrian &amp; Racing Federation. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
