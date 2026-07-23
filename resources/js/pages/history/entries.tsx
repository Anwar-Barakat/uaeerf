import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Trophy } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

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

type PaginatedData = {
    data: Entry[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: Array<{ url: string | null; label: string; active: boolean }>;
};

interface EntriesProps {
    entries: PaginatedData;
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

export default function Entries({ entries }: EntriesProps) {
    const handlePageChange = (url: string | null) => {
        if (url) {
            router.visit(url);
        }
    };

    return (
        <>
            <Head title="My Competition Entries" />

            <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
                <div className="flex items-center gap-4">
                    <Button asChild variant="outline" size="icon">
                        <Link href="/dashboard">
                            <ArrowLeft className="size-4" />
                        </Link>
                    </Button>
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold tracking-tight">My Competition Entries</h1>
                        <p className="text-muted-foreground">View your complete competition entry history</p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>All Entries</CardTitle>
                            <Badge variant="secondary">{entries.total} total</Badge>
                        </div>
                        <CardDescription>
                            Showing {entries.data.length} of {entries.total} entries
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {entries.data.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 text-center">
                                <Trophy className="size-12 text-muted-foreground/40" />
                                <h3 className="mt-4 text-lg font-semibold">No entries yet</h3>
                                <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                                    Register for show jumping competitions to see your entries here.
                                </p>
                                <Button asChild className="mt-6">
                                    <Link href="/jumping/entry">Enter Competition</Link>
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
                                                <th className="pb-3 text-left font-medium">Horse ID</th>
                                                <th className="pb-3 text-left font-medium">Event ID</th>
                                                <th className="pb-3 text-left font-medium">Class ID</th>
                                                <th className="pb-3 text-left font-medium">Entered</th>
                                                <th className="pb-3 text-left font-medium">Status</th>
                                                <th className="pb-3 text-left font-medium">Transaction Ref</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {entries.data.map((entry) => (
                                                <tr key={entry.id} className="border-b last:border-0">
                                                    <td className="py-4 text-muted-foreground">#{entry.id}</td>
                                                    <td className="py-4 font-medium">{entry.rider_id}</td>
                                                    <td className="py-4">{entry.horse_id}</td>
                                                    <td className="py-4">{entry.event_id}</td>
                                                    <td className="py-4">{entry.class_id}</td>
                                                    <td className="py-4 text-muted-foreground">{entry.created_at}</td>
                                                    <td className="py-4">{getStatusBadge(entry.status)}</td>
                                                    <td className="py-4 font-mono text-xs text-muted-foreground">
                                                        {entry.tran_ref || 'N/A'}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {entries.last_page > 1 && (
                                    <div className="mt-6 flex items-center justify-between border-t pt-4">
                                        <p className="text-sm text-muted-foreground">
                                            Page {entries.current_page} of {entries.last_page}
                                        </p>
                                        <div className="flex gap-2">
                                            {entries.links.map((link, index) => (
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
