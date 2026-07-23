import { Head, Link } from '@inertiajs/react';
import { dashboard } from '@/routes';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function Dashboard() {
    return (
        <>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">
                        Welcome to UAE Equestrian Portal
                    </h2>
                    <p className="text-muted-foreground">
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

                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>My Registrations</CardTitle>
                            <CardDescription>View your registration history</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                No registrations yet. Start by registering as a rider.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>My Entries</CardTitle>
                            <CardDescription>View your competition entries</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
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
