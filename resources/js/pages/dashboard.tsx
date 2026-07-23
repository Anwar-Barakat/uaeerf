import { Head, Link } from '@inertiajs/react';
import { dashboard } from '@/routes';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function Dashboard() {
    return (
        <>
            <Head title="Dashboard" />
            <div className="page-background flex flex-1 flex-col gap-10 overflow-x-auto p-10">
                <div className="dashboard-header">
                    <h1 className="dashboard-title">
                        UAE Equestrian Portal
                    </h1>
                    <p className="dashboard-subtitle">
                        Manage your rider registrations and competition entries
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    <Card className="service-card-registration">
                        <CardHeader className="service-header-registration">
                            <div className="flex items-center gap-3">
                                <div className="service-icon-registration">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                    </svg>
                                </div>
                                <CardTitle className="text-lg">Rider Registration</CardTitle>
                            </div>
                            <CardDescription className="mt-3">
                                Register as a new rider with UAEERF
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-4">
                            <p className="text-sm text-muted-foreground">
                                Complete your rider registration and get your official UAEERF rider ID.
                            </p>
                            <div className="fee-badge-registration">
                                Fee: AED 100
                            </div>
                            <Button asChild className="btn-primary-registration">
                                <Link href="/rider/registration">Register Now →</Link>
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="service-card-renewal">
                        <CardHeader className="service-header-renewal">
                            <div className="flex items-center gap-3">
                                <div className="service-icon-renewal">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                </div>
                                <CardTitle className="text-lg">Rider Renewal</CardTitle>
                            </div>
                            <CardDescription className="mt-3">
                                Renew your rider registration
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-4">
                            <p className="text-sm text-muted-foreground">
                                Renew your existing rider registration for the new season.
                            </p>
                            <div className="fee-badge-renewal">
                                Fee: AED 50
                            </div>
                            <Button asChild className="btn-outline-renewal">
                                <Link href="/rider/renewal">Renew Registration →</Link>
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="service-card-entry">
                        <CardHeader className="service-header-entry">
                            <div className="flex items-center gap-3">
                                <div className="service-icon-entry">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                    </svg>
                                </div>
                                <CardTitle className="text-lg">Show Jumping Entry</CardTitle>
                            </div>
                            <CardDescription className="mt-3">
                                Enter a competition
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-4">
                            <p className="text-sm text-muted-foreground">
                                Register for show jumping competitions.
                            </p>
                            <div className="fee-badge-entry">
                                Fee: AED 150
                            </div>
                            <Button asChild className="btn-outline-entry">
                                <Link href="/jumping/entry">Enter Competition →</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <Card className="info-card">
                        <CardHeader className="p-6 space-y-2">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-green-50 rounded-xl">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <CardTitle className="text-xl font-bold text-slate-800">My Registrations</CardTitle>
                            </div>
                            <CardDescription className="text-slate-600">View your registration history</CardDescription>
                        </CardHeader>
                        <CardContent className="p-6 pt-0">
                            <p className="text-sm text-slate-500">
                                No registrations yet. Start by registering as a rider.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="info-card">
                        <CardHeader className="p-6 space-y-2">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-amber-50 rounded-xl">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                    </svg>
                                </div>
                                <CardTitle className="text-xl font-bold text-slate-800">My Entries</CardTitle>
                            </div>
                            <CardDescription className="text-slate-600">View your competition entries</CardDescription>
                        </CardHeader>
                        <CardContent className="p-6 pt-0">
                            <p className="text-sm text-slate-500">
                                No entries yet. Register for a competition to get started.
                            </p>
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
