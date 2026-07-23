import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Plus, RefreshCw, Search } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { getStatusBadge } from '@/lib/status-badge';
import type { PaginatedData, Renewal } from '@/types';

interface RenewalsProps {
    renewals: PaginatedData<Renewal>;
    filters: { search: string | null };
}

export default function Renewals({ renewals, filters }: RenewalsProps) {
    const [search, setSearch] = useState(filters.search || '');
    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const timer = setTimeout(() => {
            router.get('/history/renewals', { search: search || undefined }, {
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
            <Head title="My Renewals" />

            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
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
                    <Button asChild>
                        <Link href="/rider/renewal">
                            <Plus className="size-4" />
                            Create New
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between gap-4">
                            <div className="space-y-1">
                                <CardTitle>All Renewals</CardTitle>
                                <CardDescription>
                                    Showing {renewals.data.length} of {renewals.total} renewals
                                </CardDescription>
                            </div>
                            <div className="relative w-64">
                                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    type="text"
                                    placeholder="Search by rider or transaction..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-9"
                                />
                            </div>
                        </div>
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
                                    <Link href="/rider/renewal">
                                        <Plus className="size-4" />
                                        Renew Registration
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
                                            {renewals.links.map((link, index) => {
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
