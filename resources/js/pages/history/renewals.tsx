import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type Renewal = {
    id: number;
    rider_id: number;
    season_id: number;
    status: string;
    tran_ref: string | null;
    created_at: string;
};

type PaginatedData = {
    data: Renewal[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: Array<{ url: string | null; label: string; active: boolean }>;
};

interface RenewalsProps {
    renewals: PaginatedData;
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

export default function Renewals({ renewals }: RenewalsProps) {
    const handlePageChange = (url: string | null) => {
        if (url) {
            router.visit(url);
        }
    };

    return (
        <>
            <Head title="My Renewals" />

            <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
                <div className="flex items-center gap-4">
                    <Button asChild variant="outline" size="icon">
                        <Link href="/dashboard">
                            <ArrowLeft className="size-4" />
                        </Link>
                    </Button>
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold tracking-tight">My Renewals</h1>
                        <p className="text-muted-foreground">View your complete rider renewal history</p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>All Renewals</CardTitle>
                            <Badge variant="secondary">{renewals.total} total</Badge>
                        </div>
                        <CardDescription>
                            Showing {renewals.data.length} of {renewals.total} renewals
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {renewals.data.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 text-center">
                                <RefreshCw className="size-12 text-muted-foreground/40" />
                                <h3 className="mt-4 text-lg font-semibold">No renewals yet</h3>
                                <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                                    Renew your rider registration for the new season.
                                </p>
                                <Button asChild className="mt-6">
                                    <Link href="/rider/renewal">Renew Registration</Link>
                                </Button>
                            </div>
                        ) : (
                            <>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b">
                                                <th className="pb-3 text-left font-medium">ID</th>
                                                <th className="pb-3 text-left font-medium">Rider ID</th>
                                                <th className="pb-3 text-left font-medium">Season ID</th>
                                                <th className="pb-3 text-left font-medium">Renewed</th>
                                                <th className="pb-3 text-left font-medium">Status</th>
                                                <th className="pb-3 text-left font-medium">Transaction Ref</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {renewals.data.map((renewal) => (
                                                <tr key={renewal.id} className="border-b last:border-0">
                                                    <td className="py-4 text-muted-foreground">#{renewal.id}</td>
                                                    <td className="py-4 font-medium">{renewal.rider_id}</td>
                                                    <td className="py-4">{renewal.season_id}</td>
                                                    <td className="py-4 text-muted-foreground">{renewal.created_at}</td>
                                                    <td className="py-4">{getStatusBadge(renewal.status)}</td>
                                                    <td className="py-4 font-mono text-xs text-muted-foreground">
                                                        {renewal.tran_ref || 'N/A'}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {renewals.last_page > 1 && (
                                    <div className="mt-6 flex items-center justify-between border-t pt-4">
                                        <p className="text-sm text-muted-foreground">
                                            Page {renewals.current_page} of {renewals.last_page}
                                        </p>
                                        <div className="flex gap-2">
                                            {renewals.links.map((link, index) => (
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
