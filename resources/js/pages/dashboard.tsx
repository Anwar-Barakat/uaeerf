import { Head, Link } from '@inertiajs/react';
import { ArrowRight, BarChart3, CalendarClock, CircleCheck, RefreshCw, Sparkles, Trophy, UserPlus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { dashboard } from '@/routes';
import type { ActivityPoint, Stats } from '@/types';

interface DashboardProps {
    stats?: Stats;
    activity?: ActivityPoint[];
}

const statMeta = [
    {
        key: 'activeRegistrations',
        label: 'Active Registrations',
        zeroHint: 'No active registrations',
        icon: CircleCheck,
        chip: 'bg-emerald-500',
        value_text: 'text-emerald-600',
        tint: 'from-emerald-500/10',
    },
    {
        key: 'competitionEntries',
        label: 'Competition Entries',
        zeroHint: 'No competition entries',
        icon: Trophy,
        chip: 'bg-amber-500',
        value_text: 'text-amber-600',
        tint: 'from-amber-500/10',
    },
    {
        key: 'renewals',
        label: 'Season Renewals',
        zeroHint: 'No renewals yet',
        icon: CalendarClock,
        chip: 'bg-blue-500',
        value_text: 'text-blue-600',
        tint: 'from-blue-500/10',
    },
] as const;

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

export default function Dashboard({ stats, activity = [] }: DashboardProps) {
    const values = stats ?? { activeRegistrations: 0, competitionEntries: 0, renewals: 0 };
    const activityTotal = activity.reduce((sum, m) => sum + m.registrations + m.entries, 0);
    const activityMax = Math.max(1, ...activity.map((m) => Math.max(m.registrations, m.entries)));

    return (
        <>
            <Head title="Dashboard" />

            <div className="space-y-8 p-6">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground">
                        Welcome to the UAE Equestrian &amp; Racing Federation portal. Manage your registrations,
                        renewals, and competition entries.
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    {statMeta.map((stat) => {
                        const value = values[stat.key];

                        return (
                            <Card
                                key={stat.label}
                                className={`relative overflow-hidden bg-gradient-to-br ${stat.tint} to-transparent`}
                            >
                                <CardHeader className="flex flex-row items-start justify-between space-y-0">
                                    <div className="space-y-1">
                                        <CardDescription>{stat.label}</CardDescription>
                                        <CardTitle className={`text-4xl font-bold ${stat.value_text}`}>
                                            {value}
                                        </CardTitle>
                                    </div>
                                    <div className={`flex size-11 items-center justify-center rounded-xl text-white shadow-sm ${stat.chip}`}>
                                        <stat.icon className="size-5" />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-xs text-muted-foreground">
                                        {value > 0 ? `${value} on record` : stat.zeroHint}
                                    </p>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                <Card>
                    <CardHeader className="flex flex-row items-start justify-between space-y-0">
                        <div className="space-y-1">
                            <CardTitle>Activity Overview</CardTitle>
                            <CardDescription>Registrations and entries over the last 6 months</CardDescription>
                        </div>
                        <div className="hidden items-center gap-4 text-xs text-muted-foreground sm:flex">
                            <span className="flex items-center gap-1.5">
                                <span className="size-2.5 rounded-sm bg-primary" /> Registrations
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="size-2.5 rounded-sm bg-blue-500" /> Entries
                            </span>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="relative h-52">
                            {activityTotal === 0 && (
                                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 text-center">
                                    <BarChart3 className="size-9 text-muted-foreground/40" />
                                    <p className="text-sm font-medium text-muted-foreground">No activity to display yet</p>
                                    <p className="max-w-xs text-xs text-muted-foreground/70">
                                        Your registrations and competition entries will appear here.
                                    </p>
                                </div>
                            )}
                            <div className="flex h-full items-end justify-between gap-3 border-b border-l border-border/70 pl-1">
                                {activity.map((m) => (
                                    <div key={m.month} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                                        <div className="flex h-full w-full items-end justify-center gap-1">
                                            <div
                                                className="w-1/3 rounded-t bg-primary/80 transition-all"
                                                style={{ height: `${Math.max(2, (m.registrations / activityMax) * 100)}%` }}
                                            />
                                            <div
                                                className="w-1/3 rounded-t bg-blue-500/80 transition-all"
                                                style={{ height: `${Math.max(2, (m.entries / activityMax) * 100)}%` }}
                                            />
                                        </div>
                                        <span className="text-xs text-muted-foreground">{m.month}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

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
