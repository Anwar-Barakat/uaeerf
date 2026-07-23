import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Plus, Search, Trophy } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { getStatusBadge } from '@/lib/status-badge';
import type { Entry, PaginatedData } from '@/types';

interface EntriesProps {
    entries: PaginatedData<Entry>;
    filters: { search: string | null };
}

export default function Entries({ entries, filters }: EntriesProps) {
    const [search, setSearch] = useState(filters.search || '');
    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const timer = setTimeout(() => {
            router.get('/history/entries', { search: search || undefined }, {
                preserveState: true,
                preserveScroll: true,
            });
        }, 300);

        return () => clearTimeout(timer);
    }, [search]);

    const handlePageChange = (url: string | null) => {
        if (url) {
            router.visit(url);
        }
    };

    return (
        <>
            <Head title="My Competition Entries" />

            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
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
                    <Button asChild>
                        <Link href="/jumping/entry">
                            <Plus className="size-4" />
                            Create New
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between gap-4">
                            <div className="space-y-1">
                                <CardTitle>All Entries</CardTitle>
                                <CardDescription>
                                    Showing {entries.data.length} of {entries.total} entries
                                </CardDescription>
                            </div>
                            <div className="relative w-64">
                                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    type="text"
                                    placeholder="Search by rider, horse, event..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-9"
                                />
                            </div>
                        </div>
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
                                    <Link href="/jumping/entry">
                                        <Plus className="size-4" />
                                        Enter Competition
                                    </Link>
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
                                            {entries.links.map((link, index) => {
                                                const label = link.label
                                                    .replace('&laquo;', '«')
                                                    .replace('&raquo;', '»');
                                                return (
                                                    <Button
                                                        key={index}
                                                        variant={link.active ? 'default' : 'outline'}
                                                        size="sm"
                                                        onClick={() => handlePageChange(link.url)}
                                                        disabled={!link.url}
                                                    >
                                                        {label}
                                                    </Button>
                                                );
                                            })}
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
