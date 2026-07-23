import { Head, Link } from '@inertiajs/react';
import { ArrowRight, FileText, RefreshCw, Sparkles, Trophy, UserPlus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { dashboard } from '@/routes';

const stats = [
    { label: 'Active Registrations', value: 0, hint: 'No active registrations', accent: 'border-l-primary' },
    { label: 'Competition Entries', value: 0, hint: 'No upcoming entries', accent: 'border-l-amber-500' },
    { label: 'Renewals Due', value: 0, hint: 'All up to date', accent: 'border-l-blue-500' },
];

const actions = [
    {
        title: 'Rider Registration',
        description: 'Register as a new rider with UAEERF',
        body: 'Complete your rider registration and receive your official UAEERF rider ID.',
        href: '/rider/registration',
        cta: 'Register Now',
        price: 'AED 100',
        icon: UserPlus,
        iconClass: 'bg-primary/10 text-primary',
        primary: true,
    },
    {
        title: 'Rider Renewal',
        description: 'Renew your rider registration',
        body: 'Renew your existing rider registration for the new season.',
        href: '/rider/renewal',
        cta: 'Renew Registration',
        price: 'AED 50',
        icon: RefreshCw,
        iconClass: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
        primary: false,
    },
    {
        title: 'Show Jumping Entry',
        description: 'Enter a competition',
        body: 'Register for show jumping competitions and events.',
        href: '/jumping/entry',
        cta: 'Enter Competition',
        price: 'AED 150',
        icon: Sparkles,
        iconClass: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
        primary: false,
    },
];

export default function Dashboard() {
    return (
        <>
            <Head title="Dashboard" />

            <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground">
                        Welcome to the UAE Equestrian &amp; Racing Federation portal. Manage your registrations,
                        renewals, and competition entries.
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    {stats.map((stat) => (
                        <Card key={stat.label} className={`border-l-4 ${stat.accent}`}>
                            <CardHeader>
                                <CardDescription>{stat.label}</CardDescription>
                                <CardTitle className="text-3xl">{stat.value}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-xs text-muted-foreground">{stat.hint}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="space-y-1">
                    <h2 className="text-xl font-semibold tracking-tight">Quick Actions</h2>
                    <p className="text-sm text-muted-foreground">Get started with these common tasks</p>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    {actions.map((action) => (
                        <Card
                            key={action.title}
                            className="transition-shadow hover:shadow-md"
                        >
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className={`flex size-11 items-center justify-center rounded-lg ${action.iconClass}`}>
                                        <action.icon className="size-5" />
                                    </div>
                                    <Badge variant="secondary">{action.price}</Badge>
                                </div>
                                <CardTitle className="mt-4">{action.title}</CardTitle>
                                <CardDescription>{action.description}</CardDescription>
                            </CardHeader>
                            <CardContent className="flex flex-1 flex-col justify-between gap-4">
                                <p className="text-sm text-muted-foreground">{action.body}</p>
                                <Button
                                    asChild
                                    variant={action.primary ? 'default' : 'outline'}
                                    className="w-full"
                                >
                                    <Link href={action.href}>
                                        {action.cta}
                                        <ArrowRight className="size-4" />
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="space-y-1">
                    <h2 className="text-xl font-semibold tracking-tight">Recent Activity</h2>
                    <p className="text-sm text-muted-foreground">
                        View your registration history and competition entries
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>My Registrations</CardTitle>
                                <Badge variant="secondary">0</Badge>
                            </div>
                            <CardDescription>Your rider registration history</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col items-center justify-center py-10 text-center">
                                <FileText className="size-10 text-muted-foreground/40" />
                                <h3 className="mt-4 font-semibold">No registrations yet</h3>
                                <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                                    Start by registering as a rider to access competitions and events.
                                </p>
                                <Button asChild variant="outline" className="mt-4">
                                    <Link href="/rider/registration">Register as Rider</Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>My Competition Entries</CardTitle>
                                <Badge variant="secondary">0</Badge>
                            </div>
                            <CardDescription>Your competition entry history</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col items-center justify-center py-10 text-center">
                                <Trophy className="size-10 text-muted-foreground/40" />
                                <h3 className="mt-4 font-semibold">No entries yet</h3>
                                <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                                    Register for show jumping competitions to see your entries here.
                                </p>
                                <Button asChild variant="outline" className="mt-4">
                                    <Link href="/jumping/entry">Enter Competition</Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
