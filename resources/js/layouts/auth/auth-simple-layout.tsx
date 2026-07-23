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
        <div className="relative flex min-h-svh items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-50 p-6">
            <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />

            <div className="w-full max-w-md">
                <Card className="border-2 shadow-2xl shadow-primary/5">
                    <div className="p-8 space-y-8">
                        <div className="flex flex-col items-center gap-6">
                            <Link
                                href={home()}
                                className="flex flex-col items-center gap-4"
                            >
                                <div className="relative">
                                    <div className="absolute inset-0 bg-primary/10 rounded-2xl blur-xl" />
                                    <img
                                        src="/images/logo.jpeg"
                                        alt="UAEERF Logo"
                                        className="relative h-20 w-auto object-contain"
                                    />
                                </div>
                                <div className="text-center">
                                    <p className="text-xl font-bold tracking-tight text-foreground">
                                        UAE Equestrian & Racing Federation
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        الاتحاد الإماراتي للفروسية والسباق
                                    </p>
                                </div>
                            </Link>

                            <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" />

                            <div className="space-y-2 text-center w-full">
                                <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
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
                        © {new Date().getFullYear()} UAE Equestrian & Racing Federation. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
}
