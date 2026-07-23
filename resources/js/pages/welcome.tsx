import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    Award,
    BadgeCheck,
    Clock,
    FileCheck,
    FileText,
    Globe,
    ShieldCheck,
    Sparkles,
    Trophy,
    Users,
    Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { dashboard, login, register } from '@/routes';

const stats = [
    { value: '5,000+', label: 'Registered Riders', icon: Users, color: 'text-emerald-600', chip: 'bg-emerald-500' },
    { value: '350+', label: 'Annual Competitions', icon: Trophy, color: 'text-amber-600', chip: 'bg-amber-500' },
    { value: '60+', label: 'Affiliated Clubs', icon: Award, color: 'text-blue-600', chip: 'bg-blue-500' },
    { value: '7', label: 'Emirates Covered', icon: Globe, color: 'text-violet-600', chip: 'bg-violet-500' },
];

const services = [
    {
        title: 'Rider Registration',
        description: 'Register as a new rider and obtain your official UAEERF ID.',
        body: 'Complete your registration with official documentation and certification.',
        fee: 'AED 100',
        href: '/rider/registration',
        icon: Users,
        chip: 'bg-emerald-500',
        border: 'border-t-emerald-500',
        text: 'text-emerald-600',
    },
    {
        title: 'Season Renewal',
        description: 'Renew your rider registration for continued participation.',
        body: 'Keep your status active and maintain access to all federation services.',
        fee: 'AED 50',
        href: '/rider/renewal',
        icon: FileText,
        chip: 'bg-blue-500',
        border: 'border-t-blue-500',
        text: 'text-blue-600',
    },
    {
        title: 'Competition Entry',
        description: 'Register for show jumping and equestrian competitions.',
        body: 'Enter sanctioned competitions and track your competitive record.',
        fee: 'AED 150',
        href: '/jumping/entry',
        icon: Trophy,
        chip: 'bg-amber-500',
        border: 'border-t-amber-500',
        text: 'text-amber-600',
    },
];

const features = [
    { title: 'Official Certification', description: 'Government-recognized rider IDs and credentials.', icon: BadgeCheck, chip: 'bg-emerald-500' },
    { title: 'Secure Payments', description: 'Encrypted checkout powered by PayTabs.', icon: ShieldCheck, chip: 'bg-blue-500' },
    { title: 'Fast Processing', description: 'Instant confirmations and digital receipts.', icon: Zap, chip: 'bg-amber-500' },
    { title: '24/7 Access', description: 'Manage registrations anytime, anywhere.', icon: Clock, chip: 'bg-violet-500' },
    { title: 'Nationwide Coverage', description: 'Serving riders across all seven Emirates.', icon: Globe, chip: 'bg-rose-500' },
    { title: 'Digital Records', description: 'Your full history in one secure place.', icon: FileCheck, chip: 'bg-teal-500' },
];

export default function Welcome() {
    const { auth } = usePage().props;

    return (
        <>
            <Head title="Welcome - UAE Equestrian & Racing Federation" />

            <div className="min-h-screen bg-background">
                {/* Header */}
                <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
                    <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between">
                            <Link href="/" className="flex items-center gap-3">
                                <img src="/images/logo.jpeg" alt="UAEERF" className="h-11 w-auto rounded-md" />
                                <div className="hidden sm:block">
                                    <p className="text-base font-bold leading-tight text-foreground">
                                        UAE Equestrian &amp; Racing Federation
                                    </p>
                                    <p className="text-xs text-muted-foreground">الاتحاد الإماراتي للفروسية والسباق</p>
                                </div>
                            </Link>

                            <nav className="flex items-center gap-2">
                                {auth.user ? (
                                    <Button asChild>
                                        <Link href={dashboard()}>
                                            Dashboard
                                            <ArrowRight className="size-4" />
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

                {/* Hero */}
                <section className="relative overflow-hidden">
                    {/* decorative gradient blobs */}
                    <div className="pointer-events-none absolute inset-0 -z-10">
                        <div className="absolute -top-24 -left-24 size-96 rounded-full bg-primary/10 blur-3xl" />
                        <div className="absolute top-10 right-0 size-96 rounded-full bg-amber-400/10 blur-3xl" />
                        <div className="absolute bottom-0 left-1/3 size-96 rounded-full bg-blue-400/10 blur-3xl" />
                    </div>

                    <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
                        <div className="mx-auto max-w-4xl space-y-6 text-center">
                            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
                                <Sparkles className="size-4" />
                                Official UAE Government Portal
                            </div>

                            <h1 className="text-5xl font-bold tracking-tight lg:text-7xl">
                                <span className="bg-gradient-to-r from-amber-500 via-primary to-yellow-600 bg-clip-text text-transparent">
                                    UAE Equestrian
                                </span>
                                <br />
                                Portal
                            </h1>

                            <p className="mx-auto max-w-2xl text-lg leading-relaxed text-muted-foreground lg:text-xl">
                                Official registration and competition management for riders and equestrian clubs
                                across the United Arab Emirates.
                            </p>

                            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                                {auth.user ? (
                                    <Button asChild size="lg" className="h-12 px-8 text-base">
                                        <Link href={dashboard()}>
                                            Go to Dashboard
                                            <ArrowRight className="size-5" />
                                        </Link>
                                    </Button>
                                ) : (
                                    <>
                                        <Button asChild size="lg" className="h-12 px-8 text-base">
                                            <Link href={register()}>
                                                Get Started
                                                <ArrowRight className="size-5" />
                                            </Link>
                                        </Button>
                                        <Button asChild size="lg" variant="outline" className="h-12 px-8 text-base">
                                            <Link href={login()}>Sign In</Link>
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Stats band */}
                        <div className="mx-auto mt-16 grid max-w-5xl grid-cols-2 gap-4 lg:grid-cols-4">
                            {stats.map((stat) => (
                                <div
                                    key={stat.label}
                                    className="rounded-2xl border bg-card p-6 text-center shadow-sm transition-shadow hover:shadow-md"
                                >
                                    <div className={`mx-auto mb-3 flex size-11 items-center justify-center rounded-xl text-white shadow-sm ${stat.chip}`}>
                                        <stat.icon className="size-5" />
                                    </div>
                                    <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                                    <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Services */}
                <section className="border-t bg-muted/30 py-20">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mb-12 text-center">
                            <h2 className="text-3xl font-bold tracking-tight lg:text-4xl">Our Services</h2>
                            <p className="mt-3 text-muted-foreground">
                                Comprehensive equestrian services for riders and clubs
                            </p>
                        </div>

                        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
                            {services.map((service) => (
                                <Card
                                    key={service.title}
                                    className={`group border-t-4 ${service.border} transition-all hover:-translate-y-1 hover:shadow-lg`}
                                >
                                    <CardHeader>
                                        <div className="mb-4 flex items-center justify-between">
                                            <div className={`inline-flex size-12 items-center justify-center rounded-xl text-white shadow-sm transition-transform group-hover:scale-105 ${service.chip}`}>
                                                <service.icon className="size-6" />
                                            </div>
                                            <span className={`text-sm font-bold ${service.text}`}>{service.fee}</span>
                                        </div>
                                        <CardTitle>{service.title}</CardTitle>
                                        <CardDescription>{service.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="flex flex-1 flex-col justify-between gap-4">
                                        <p className="text-sm text-muted-foreground">{service.body}</p>
                                        <Button asChild variant="ghost" className={`w-fit px-0 ${service.text} hover:bg-transparent`}>
                                            <Link href={auth.user ? service.href : register()}>
                                                Learn more
                                                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                                            </Link>
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Features */}
                <section className="py-20">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mb-12 text-center">
                            <h2 className="text-3xl font-bold tracking-tight lg:text-4xl">Why UAEERF</h2>
                            <p className="mt-3 text-muted-foreground">
                                A modern, trusted platform built for the UAE equestrian community
                            </p>
                        </div>

                        <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {features.map((feature) => (
                                <div
                                    key={feature.title}
                                    className="flex gap-4 rounded-xl border bg-card p-5 shadow-sm transition-shadow hover:shadow-md"
                                >
                                    <div className={`flex size-11 shrink-0 items-center justify-center rounded-lg text-white shadow-sm ${feature.chip}`}>
                                        <feature.icon className="size-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">{feature.title}</h3>
                                        <p className="mt-1 text-sm text-muted-foreground">{feature.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="pb-20">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500 via-primary to-amber-700 px-8 py-14 text-center shadow-xl lg:px-16">
                            <div className="pointer-events-none absolute inset-0 opacity-20">
                                <div className="absolute -top-16 -right-16 size-64 rounded-full bg-white/30 blur-3xl" />
                                <div className="absolute -bottom-16 -left-16 size-64 rounded-full bg-white/20 blur-3xl" />
                            </div>
                            <div className="relative mx-auto max-w-2xl space-y-5">
                                <h2 className="text-3xl font-bold tracking-tight text-white lg:text-4xl">
                                    Ready to get started?
                                </h2>
                                <p className="text-lg text-white/90">
                                    Join the UAE Equestrian &amp; Racing Federation today and access all our services.
                                </p>
                                {!auth.user && (
                                    <div className="pt-2">
                                        <Button
                                            asChild
                                            size="lg"
                                            variant="secondary"
                                            className="h-12 bg-white px-8 text-base text-primary hover:bg-white/90"
                                        >
                                            <Link href={register()}>
                                                Create Account
                                                <ArrowRight className="size-5" />
                                            </Link>
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="border-t bg-muted/30">
                    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                            <div className="flex items-center gap-3">
                                <img src="/images/logo.jpeg" alt="UAEERF" className="h-10 w-auto rounded-md" />
                                <div>
                                    <p className="text-sm font-semibold">UAE Equestrian &amp; Racing Federation</p>
                                    <p className="text-xs text-muted-foreground">الاتحاد الإماراتي للفروسية والسباق</p>
                                </div>
                            </div>

                            <div className="text-center md:text-right">
                                <p className="text-sm text-muted-foreground">
                                    © {new Date().getFullYear()} UAE Equestrian &amp; Racing Federation
                                </p>
                                <p className="mt-1 text-xs text-muted-foreground">All rights reserved</p>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
