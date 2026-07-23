import { Head, Link } from '@inertiajs/react';
import { dashboard } from '@/routes';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function Dashboard() {
    return (
        <>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-6">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Welcome to UAE Equestrian Portal</h2>
                    <p className="text-muted-foreground">
                        Manage your rider registrations and competition entries
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader>
                            <CardTitle>Rider Registration</CardTitle>
                            <CardDescription>Register as a new rider with UAEERF</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-4">
                                Complete your rider registration and get your official UAEERF rider ID. Registration fee: AED 100
                            </p>
                            <Button asChild className="w-full">
                                <Link href="/rider/registration">Register Now</Link>
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Rider Renewal</CardTitle>
                            <CardDescription>Renew your rider registration</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-4">
                                Renew your existing rider registration for the new season. Renewal fee: AED 50
                            </p>
                            <Button asChild variant="outline" className="w-full">
                                <Link href="/rider/renewal">Renew Registration</Link>
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Show Jumping Entry</CardTitle>
                            <CardDescription>Enter a competition</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-4">
                                Register for show jumping competitions. Entry fee: AED 150 per competition
                            </p>
                            <Button asChild variant="outline" className="w-full">
                                <Link href="/jumping/entry">Enter Competition</Link>
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
