import { Link } from '@inertiajs/react';
import { Card } from '@/components/ui/card';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div className="relative min-h-svh overflow-y-auto bg-gradient-to-br from-slate-100 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-primary/20 blur-3xl dark:bg-primary/10" />
                <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-emerald-400/20 blur-3xl dark:bg-emerald-500/10" />
                <div className="absolute left-1/2 top-1/2 h-[32rem] w-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-300/10 blur-3xl dark:bg-sky-500/5" />
            </div>

            <div className="relative flex min-h-svh items-center justify-center p-4 sm:p-6">
                <div className="w-full max-w-md py-8">
                    <Card className="border border-border/60 bg-card/80 shadow-2xl shadow-primary/10 backdrop-blur-xl">
                        <div className="space-y-8 p-6 sm:p-8">
                            <div className="flex flex-col items-center gap-6">
                                <Link
                                    href={home()}
                                    className="group flex flex-col items-center gap-4"
                                >
                                    <div className="relative">
                                        <div className="absolute inset-0 rounded-2xl bg-primary/20 blur-xl transition-all duration-300 group-hover:bg-primary/30" />
                                        <img
                                            src="/images/logo.jpeg"
                                            alt="UAEERF Logo"
                                            className="relative h-20 w-auto rounded-xl object-contain transition-transform duration-300 group-hover:scale-105"
                                        />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-xl font-bold tracking-tight text-foreground">
                                            UAE Equestrian & Racing Federation
                                        </p>
                                        <p className="mt-1 text-xs text-muted-foreground">
                                            الاتحاد الإماراتي للفروسية والسباق
                                        </p>
                                    </div>
                                </Link>

                                <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" />

                                <div className="w-full space-y-2 text-center">
                                    <h1 className="text-2xl font-bold tracking-tight">
                                        {title}
                                    </h1>
                                    <p className="text-sm text-muted-foreground">
                                        {description}
                                    </p>
                                </div>
                            </div>

                            {children}
                        </div>
                    </Card>

                    <div className="mt-6 text-center">
                        <p className="text-xs text-muted-foreground">
                            © {new Date().getFullYear()} UAE Equestrian &
                            Racing Federation. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
