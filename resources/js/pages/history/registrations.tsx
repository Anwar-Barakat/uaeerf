import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type Registration = {
    id: number;
    rider_name: string;
    date_of_birth: string;
    status: string;
    tran_ref: string | null;
    created_at: string;
};

type PaginatedData = {
    data: Registration[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: Array<{ url: string | null; label: string; active: boolean }>;
};

interface RegistrationsProps {
    registrations: PaginatedData;
}

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

export default function Registrations({ registrations }: RegistrationsProps) {
    const handlePageChange = (url: string | null) => {
        if (url) {
            router.visit(url);
        }
    };

    return (
        <>
            <Head title="My Registrations" />

            <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
                <div className="flex items-center gap-4">
                    <Button asChild variant="outline" size="icon">
                        <Link href="/dashboard">
                            <ArrowLeft className="size-4" />
                        </Link>
                    </Button>
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold tracking-tight">My Registrations</h1>
                        <p className="text-muted-foreground">View your complete rider registration history</p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>All Registrations</CardTitle>
                            <Badge variant="secondary">{registrations.total} total</Badge>
                        </div>
                        <CardDescription>
                            Showing {registrations.data.length} of {registrations.total} registrations
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {registrations.data.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 text-center">
                                <FileText className="size-12 text-muted-foreground/40" />
                                <h3 className="mt-4 text-lg font-semibold">No registrations yet</h3>
                                <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                                    Start by registering as a rider to access competitions and events.
                                </p>
                                <Button asChild className="mt-6">
                                    <Link href="/rider/registration">Register as Rider</Link>
                                </Button>
                            </div>
                        ) : (
                            <>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b">
                                                <th className="pb-3 text-left font-medium">ID</th>
                                                <th className="pb-3 text-left font-medium">Rider Name</th>
                                                <th className="pb-3 text-left font-medium">Date of Birth</th>
                                                <th className="pb-3 text-left font-medium">Registered</th>
                                                <th className="pb-3 text-left font-medium">Status</th>
                                                <th className="pb-3 text-left font-medium">Transaction Ref</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {registrations.data.map((reg) => (
                                                <tr key={reg.id} className="border-b last:border-0">
                                                    <td className="py-4 text-muted-foreground">#{reg.id}</td>
                                                    <td className="py-4 font-medium">{reg.rider_name}</td>
                                                    <td className="py-4 text-muted-foreground">{reg.date_of_birth}</td>
                                                    <td className="py-4 text-muted-foreground">{reg.created_at}</td>
                                                    <td className="py-4">{getStatusBadge(reg.status)}</td>
                                                    <td className="py-4 font-mono text-xs text-muted-foreground">
                                                        {reg.tran_ref || 'N/A'}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {registrations.last_page > 1 && (
                                    <div className="mt-6 flex items-center justify-between border-t pt-4">
                                        <p className="text-sm text-muted-foreground">
                                            Page {registrations.current_page} of {registrations.last_page}
                                        </p>
                                        <div className="flex gap-2">
                                            {registrations.links.map((link, index) => (
                                                <Button
                                                    key={index}
                                                    variant={link.active ? 'default' : 'outline'}
                                                    size="sm"
                                                    onClick={() => handlePageChange(link.url)}
                                                    disabled={!link.url}
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
