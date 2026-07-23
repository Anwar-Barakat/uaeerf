import { Head, Link } from '@inertiajs/react';
import { dashboard } from '@/routes';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function Dashboard() {
    return (
        <>
            <Head title="Dashboard" />

            <div className="page-container py-8 space-y-8">
                <div className="page-header">
                    <h1 className="page-title">Dashboard</h1>
                    <p className="page-description">
                        Welcome to the UAE Equestrian & Racing Federation portal. Manage your registrations, renewals, and competition entries.
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    <div className="stats-card border-l-4 border-l-primary">
                        <div className="space-y-1">
                            <p className="stats-label">Active Registrations</p>
                            <p className="stats-value text-primary">0</p>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                            No active registrations
                        </p>
                    </div>

                    <div className="stats-card border-l-4 border-l-accent">
                        <div className="space-y-1">
                            <p className="stats-label">Competition Entries</p>
                            <p className="stats-value text-accent">0</p>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                            No upcoming entries
                        </p>
                    </div>

                    <div className="stats-card border-l-4 border-l-green-600">
                        <div className="space-y-1">
                            <p className="stats-label">Renewals Due</p>
                            <p className="stats-value text-green-600">0</p>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                            All up to date
                        </p>
                    </div>
                </div>

                <div className="section-header">
                    <h2 className="section-title">Quick Actions</h2>
                    <p className="section-description">Get started with these common tasks</p>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    <Card className="card-enhanced card-interactive group">
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div className="p-3 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                    </svg>
                                </div>
                                <span className="badge-primary">AED 100</span>
                            </div>
                            <CardTitle className="mt-4">Rider Registration</CardTitle>
                            <CardDescription>
                                Register as a new rider with UAEERF
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-4">
                                Complete your rider registration and receive your official UAEERF rider ID.
                            </p>
                            <Button asChild className="w-full btn-primary">
                                <Link href="/rider/registration">
                                    Register Now
                                    <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="card-enhanced card-interactive group">
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div className="p-3 rounded-lg bg-blue-500/10 text-blue-600 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                </div>
                                <span className="badge-neutral">AED 50</span>
                            </div>
                            <CardTitle className="mt-4">Rider Renewal</CardTitle>
                            <CardDescription>
                                Renew your rider registration
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-4">
                                Renew your existing rider registration for the new season.
                            </p>
                            <Button asChild variant="outline" className="w-full btn-outline">
                                <Link href="/rider/renewal">
                                    Renew Registration
                                    <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="card-enhanced card-interactive group">
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div className="p-3 rounded-lg bg-accent/10 text-accent group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                    </svg>
                                </div>
                                <span className="badge-warning">AED 150</span>
                            </div>
                            <CardTitle className="mt-4">Show Jumping Entry</CardTitle>
                            <CardDescription>
                                Enter a competition
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-4">
                                Register for show jumping competitions and events.
                            </p>
                            <Button asChild variant="outline" className="w-full btn-outline">
                                <Link href="/jumping/entry">
                                    Enter Competition
                                    <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                <div className="section-header">
                    <h2 className="section-title">Recent Activity</h2>
                    <p className="section-description">View your registration history and competition entries</p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <Card className="card-enhanced">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>My Registrations</CardTitle>
                                <span className="badge-neutral">0</span>
                            </div>
                            <CardDescription>Your rider registration history</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="empty-state">
                                <svg xmlns="http://www.w3.org/2000/svg" className="empty-state-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <h3 className="empty-state-title">No registrations yet</h3>
                                <p className="empty-state-description">
                                    Start by registering as a rider to access competitions and events.
                                </p>
                                <Button asChild variant="outline" className="mt-4">
                                    <Link href="/rider/registration">Register as Rider</Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="card-enhanced">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>My Competition Entries</CardTitle>
                                <span className="badge-neutral">0</span>
                            </div>
                            <CardDescription>Your competition entry history</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="empty-state">
                                <svg xmlns="http://www.w3.org/2000/svg" className="empty-state-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                </svg>
                                <h3 className="empty-state-title">No entries yet</h3>
                                <p className="empty-state-description">
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
