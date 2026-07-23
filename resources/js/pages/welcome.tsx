import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowRight, Award, Calendar, FileText, Trophy, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { dashboard, login, register } from '@/routes';

export default function Welcome() {
    const { auth } = usePage().props;

    return (
        <>
            <Head title="Welcome - UAE Equestrian & Racing Federation" />

            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
                <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
                    <div className="page-container py-4">
                        <div className="flex items-center justify-between">
                            <Link href="/" className="flex items-center gap-3">
                                <img src="/images/logo.jpeg" alt="UAEERF" className="h-12 w-auto" />
                                <div className="hidden sm:block">
                                    <p className="font-bold text-lg text-foreground">UAE Equestrian & Racing Federation</p>
                                    <p className="text-xs text-muted-foreground">الاتحاد الإماراتي للفروسية والسباق</p>
                                </div>
                            </Link>

                            <nav className="flex items-center gap-3">
                                {auth.user ? (
                                    <Button asChild>
                                        <Link href={dashboard()}>
                                            Dashboard
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Link>
                                    </Button>
                                ) : (
                                    <>
                                        <Button asChild variant="ghost">
                                            <Link href={login()}>Log in</Link>
                                        </Button>
                                        <Button asChild>
                                            <Link href={register()}>Register</Link>
                                        </Button>
                                    </>
                                )}
                            </nav>
                        </div>
                    </div>
                </header>

                <section className="py-20 lg:py-32">
                    <div className="page-container">
                        <div className="mx-auto max-w-4xl text-center space-y-6">
                            <div className="inline-flex items-center gap-2 rounded-full border bg-primary/5 px-4 py-2 text-sm font-medium text-primary">
                                <Award className="h-4 w-4" />
                                Official UAE Government Portal
                            </div>

                            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight">
                                <span className="bg-gradient-to-r from-primary via-primary/90 to-primary/70 bg-clip-text text-transparent">
                                    UAE Equestrian
                                </span>
                                <br />
                                Portal
                            </h1>

                            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                                Official registration and competition management system for riders and equestrian clubs across the United Arab Emirates.
                            </p>

                            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                                {!auth.user && (
                                    <>
                                        <Button asChild size="lg" className="h-14 px-8 text-base">
                                            <Link href={register()}>
                                                Get Started
                                                <ArrowRight className="ml-2 h-5 w-5" />
                                            </Link>
                                        </Button>
                                        <Button asChild size="lg" variant="outline" className="h-14 px-8 text-base">
                                            <Link href={login()}>Sign In</Link>
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-16 bg-white/50">
                    <div className="page-container">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold tracking-tight mb-3">Our Services</h2>
                            <p className="text-muted-foreground">
                                Comprehensive equestrian services for riders and clubs
                            </p>
                        </div>

                        <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
                            <Card className="card-enhanced card-interactive group">
                                <CardHeader>
                                    <div className="mb-4 p-3 rounded-xl bg-primary/10 text-primary inline-flex">
                                        <Users className="h-6 w-6" />
                                    </div>
                                    <CardTitle>Rider Registration</CardTitle>
                                    <CardDescription>
                                        Register as a new rider and obtain your official UAEERF ID
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground mb-4">
                                        Complete your registration with official documentation and certification.
                                    </p>
                                    <div className="text-sm font-semibold text-primary">
                                        Fee: AED 100
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="card-enhanced card-interactive group">
                                <CardHeader>
                                    <div className="mb-4 p-3 rounded-xl bg-blue-500/10 text-blue-600 inline-flex">
                                        <FileText className="h-6 w-6" />
                                    </div>
                                    <CardTitle>Season Renewal</CardTitle>
                                    <CardDescription>
                                        Renew your rider registration for continued participation
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground mb-4">
                                        Keep your status active and maintain access to all federation services.
                                    </p>
                                    <div className="text-sm font-semibold text-blue-600">
                                        Fee: AED 50
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="card-enhanced card-interactive group">
                                <CardHeader>
                                    <div className="mb-4 p-3 rounded-xl bg-amber-500/10 text-amber-600 inline-flex">
                                        <Trophy className="h-6 w-6" />
                                    </div>
                                    <CardTitle>Competition Entry</CardTitle>
                                    <CardDescription>
                                        Register for show jumping and equestrian competitions
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground mb-4">
                                        Enter sanctioned competitions and track your competitive record.
                                    </p>
                                    <div className="text-sm font-semibold text-amber-600">
                                        Fee: AED 150
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>

                <section className="py-16">
                    <div className="page-container">
                        <div className="max-w-4xl mx-auto">
                            <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
                                <CardContent className="p-8 lg:p-12">
                                    <div className="flex flex-col lg:flex-row items-center gap-8">
                                        <div className="flex-1 space-y-4">
                                            <h2 className="text-3xl font-bold tracking-tight">
                                                Ready to get started?
                                            </h2>
                                            <p className="text-muted-foreground text-lg">
                                                Join the UAE Equestrian & Racing Federation today and access all our services.
                                            </p>
                                        </div>
                                        {!auth.user && (
                                            <Button asChild size="lg" className="h-14 px-8 text-base shrink-0">
                                                <Link href={register()}>
                                                    Create Account
                                                    <ArrowRight className="ml-2 h-5 w-5" />
                                                </Link>
                                            </Button>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>

                <footer className="border-t bg-white/50 mt-16">
                    <div className="page-container py-12">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                            <div className="flex items-center gap-3">
                                <img src="/images/logo.jpeg" alt="UAEERF" className="h-10 w-auto" />
                                <div>
                                    <p className="font-semibold text-sm">UAE Equestrian & Racing Federation</p>
                                    <p className="text-xs text-muted-foreground">الاتحاد الإماراتي للفروسية والسباق</p>
                                </div>
                            </div>

                            <div className="text-center md:text-right">
                                <p className="text-sm text-muted-foreground">
                                    © {new Date().getFullYear()} UAE Equestrian & Racing Federation
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    All rights reserved
                                </p>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
