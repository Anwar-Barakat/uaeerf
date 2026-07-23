import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, FileText, Plus, Search } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { getStatusBadge } from '@/lib/status-badge';
import type { PaginatedData, Registration } from '@/types';

interface RegistrationsProps {
    registrations: PaginatedData<Registration>;
    filters: { search: string | null };
}

export default function Registrations({ registrations, filters }: RegistrationsProps) {
    const [search, setSearch] = useState(filters.search || '');
    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const timer = setTimeout(() => {
            router.get('/history/registrations', { search: search || undefined }, {
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
            <Head title="My Registrations" />

            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
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
                    <Button asChild>
                        <Link href="/rider/registration">
                            <Plus className="size-4" />
                            Create New
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between gap-4">
                            <div className="space-y-1">
                                <CardTitle>All Registrations</CardTitle>
                                <CardDescription>
                                    Showing {registrations.data.length} of {registrations.total} registrations
                                </CardDescription>
                            </div>
                            <div className="relative w-64">
                                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    type="text"
                                    placeholder="Search by name or transaction..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-9"
                                />
                            </div>
                        </div>
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
                                    <Link href="/rider/registration">
                                        <Plus className="size-4" />
                                        Register as Rider
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
                                            {registrations.links.map((link, index) => {
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
