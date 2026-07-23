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
                    <Card className="border-2 hover:border-green-300 dark:hover:border-green-700 transition-colors">
                        <CardHeader className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                    </svg>
                                </div>
                                <CardTitle>Rider Registration</CardTitle>
                            </div>
                            <CardDescription className="mt-2">
                                Register as a new rider with UAEERF
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <p className="text-sm text-muted-foreground mb-4">
                                Complete your rider registration and get your official UAEERF rider
                                ID.
                            </p>
                            <div className="mb-4 p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                                <p className="text-sm font-semibold text-green-900 dark:text-green-100">
                                    Fee: AED 100
                                </p>
                            </div>
                            <Button asChild className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-700">
                                <Link href="/rider/registration">Register Now →</Link>
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="border-2 hover:border-blue-300 dark:hover:border-blue-700 transition-colors">
                        <CardHeader className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                </div>
                                <CardTitle>Rider Renewal</CardTitle>
                            </div>
                            <CardDescription className="mt-2">
                                Renew your rider registration
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <p className="text-sm text-muted-foreground mb-4">
                                Renew your existing rider registration for the new season.
                            </p>
                            <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                                <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">
                                    Fee: AED 50
                                </p>
                            </div>
                            <Button asChild variant="outline" className="w-full border-2 border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950">
                                <Link href="/rider/renewal">Renew Registration →</Link>
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="border-2 hover:border-amber-300 dark:hover:border-amber-700 transition-colors">
                        <CardHeader className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950 dark:to-yellow-950">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-amber-100 dark:bg-amber-900 rounded-lg">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                    </svg>
                                </div>
                                <CardTitle>Show Jumping Entry</CardTitle>
                            </div>
                            <CardDescription className="mt-2">
                                Enter a competition
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <p className="text-sm text-muted-foreground mb-4">
                                Register for show jumping competitions.
                            </p>
                            <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-950 rounded-lg">
                                <p className="text-sm font-semibold text-amber-900 dark:text-amber-100">
                                    Fee: AED 150
                                </p>
                            </div>
                            <Button asChild variant="outline" className="w-full border-2 border-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950">
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
