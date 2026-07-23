import { Head, Link } from '@inertiajs/react';
import { ArrowRight, BarChart3, CalendarClock, CircleCheck, FileText, RefreshCw, Sparkles, Trophy, UserPlus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { dashboard } from '@/routes';

type ActivityPoint = { month: string; registrations: number; entries: number };

type Registration = {
    id: number;
    rider_name: string;
    date_of_birth: string;
    status: string;
    tran_ref: string | null;
    created_at: string;
};

type Renewal = {
    id: number;
    rider_id: number;
    season_id: number;
    status: string;
    tran_ref: string | null;
    created_at: string;
};

type Entry = {
    id: number;
    rider_id: number;
    horse_id: number;
    event_id: number;
    class_id: number;
    status: string;
    tran_ref: string | null;
    created_at: string;
};

interface DashboardProps {
    stats?: {
        activeRegistrations: number;
        competitionEntries: number;
        renewals: number;
    };
    activity?: ActivityPoint[];
    registrations?: Registration[];
    renewals?: Renewal[];
    entries?: Entry[];
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

export default function Dashboard({ stats, activity = [], registrations = [], renewals = [], entries = [] }: DashboardProps) {
    const values = stats ?? { activeRegistrations: 0, competitionEntries: 0, renewals: 0 };
    const activityTotal = activity.reduce((sum, m) => sum + m.registrations + m.entries, 0);
    const activityMax = Math.max(1, ...activity.map((m) => Math.max(m.registrations, m.entries)));

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'completed':
                return <Badge className="bg-emerald-500">Completed</Badge>;
            case 'pending':
                return <Badge variant="secondary">Pending</Badge>;
            case 'failed':
                return <Badge variant="destructive">Failed</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

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

                <div className="space-y-1">
                    <h2 className="text-xl font-semibold tracking-tight">Recent Activity</h2>
                    <p className="text-sm text-muted-foreground">
                        View your registration history and competition entries
                    </p>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <CardTitle>My Registrations</CardTitle>
                                    <CardDescription>Your rider registration history</CardDescription>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge variant="secondary">{registrations.length}</Badge>
                                    {registrations.length > 0 && (
                                        <Button asChild variant="outline" size="sm">
                                            <Link href="/history/registrations">View All</Link>
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {registrations.length === 0 ? (
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
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b">
                                                <th className="pb-2 text-left font-medium">Rider Name</th>
                                                <th className="pb-2 text-left font-medium">Date</th>
                                                <th className="pb-2 text-left font-medium">Status</th>
                                                <th className="pb-2 text-left font-medium">Transaction</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {registrations.map((reg) => (
                                                <tr key={reg.id} className="border-b last:border-0">
                                                    <td className="py-3">{reg.rider_name}</td>
                                                    <td className="py-3 text-muted-foreground">{reg.created_at}</td>
                                                    <td className="py-3">{getStatusBadge(reg.status)}</td>
                                                    <td className="py-3 font-mono text-xs text-muted-foreground">
                                                        {reg.tran_ref || 'N/A'}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <CardTitle>My Renewals</CardTitle>
                                    <CardDescription>Your rider renewal history</CardDescription>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge variant="secondary">{renewals.length}</Badge>
                                    {renewals.length > 0 && (
                                        <Button asChild variant="outline" size="sm">
                                            <Link href="/history/renewals">View All</Link>
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {renewals.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-10 text-center">
                                    <RefreshCw className="size-10 text-muted-foreground/40" />
                                    <h3 className="mt-4 font-semibold">No renewals yet</h3>
                                    <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                                        Renew your rider registration for the new season.
                                    </p>
                                    <Button asChild variant="outline" className="mt-4">
                                        <Link href="/rider/renewal">Renew Registration</Link>
                                    </Button>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b">
                                                <th className="pb-2 text-left font-medium">Rider ID</th>
                                                <th className="pb-2 text-left font-medium">Season ID</th>
                                                <th className="pb-2 text-left font-medium">Date</th>
                                                <th className="pb-2 text-left font-medium">Status</th>
                                                <th className="pb-2 text-left font-medium">Transaction</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {renewals.map((renewal) => (
                                                <tr key={renewal.id} className="border-b last:border-0">
                                                    <td className="py-3">{renewal.rider_id}</td>
                                                    <td className="py-3">{renewal.season_id}</td>
                                                    <td className="py-3 text-muted-foreground">{renewal.created_at}</td>
                                                    <td className="py-3">{getStatusBadge(renewal.status)}</td>
                                                    <td className="py-3 font-mono text-xs text-muted-foreground">
                                                        {renewal.tran_ref || 'N/A'}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <CardTitle>My Competition Entries</CardTitle>
                                    <CardDescription>Your competition entry history</CardDescription>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge variant="secondary">{entries.length}</Badge>
                                    {entries.length > 0 && (
                                        <Button asChild variant="outline" size="sm">
                                            <Link href="/history/entries">View All</Link>
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {entries.length === 0 ? (
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
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b">
                                                <th className="pb-2 text-left font-medium">Rider ID</th>
                                                <th className="pb-2 text-left font-medium">Horse ID</th>
                                                <th className="pb-2 text-left font-medium">Event/Class</th>
                                                <th className="pb-2 text-left font-medium">Date</th>
                                                <th className="pb-2 text-left font-medium">Status</th>
                                                <th className="pb-2 text-left font-medium">Transaction</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {entries.map((entry) => (
                                                <tr key={entry.id} className="border-b last:border-0">
                                                    <td className="py-3">{entry.rider_id}</td>
                                                    <td className="py-3">{entry.horse_id}</td>
                                                    <td className="py-3">{entry.event_id}/{entry.class_id}</td>
                                                    <td className="py-3 text-muted-foreground">{entry.created_at}</td>
                                                    <td className="py-3">{getStatusBadge(entry.status)}</td>
                                                    <td className="py-3 font-mono text-xs text-muted-foreground">
                                                        {entry.tran_ref || 'N/A'}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
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
