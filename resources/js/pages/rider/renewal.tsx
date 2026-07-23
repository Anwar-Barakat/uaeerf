import { Head, useForm } from '@inertiajs/react';
import axios from 'axios';
import { ArrowRight, Loader2, Search, ShieldCheck } from 'lucide-react';
import type { FormEventHandler } from 'react';
import { useEffect, useRef, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { initiateRenewal } from '@/actions/App/Http/Controllers/RiderController';

type RiderResult = {
    rider_id: string;
    name: string;
    dob: string | null;
    nationality: string | null;
    registered_current_season: boolean;
};

interface Props {
    seasons: Array<{ Code: number; Name: string }>;
}

export default function RiderRenewal({ seasons }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        rider_id: '',
        season_id: '',
    });

    const [query, setQuery] = useState('');
    const [results, setResults] = useState<RiderResult[]>([]);
    const [searching, setSearching] = useState(false);
    const [selectedRider, setSelectedRider] = useState<RiderResult | null>(null);
    const skipSearch = useRef(false);

    useEffect(() => {
        if (skipSearch.current) {
            skipSearch.current = false;
            return;
        }

        if (query.trim().length < 2) {
            setResults([]);
            return;
        }

        const timer = setTimeout(async () => {
            setSearching(true);
            try {
                const response = await axios.get('/api/riders/search', {
                    params: { q: query.trim() },
                });
                setResults(response.data.data ?? []);
            } catch {
                setResults([]);
            } finally {
                setSearching(false);
            }
        }, 400);

        return () => clearTimeout(timer);
    }, [query]);

    const pickRider = (rider: RiderResult) => {
        skipSearch.current = true;
        setSelectedRider(rider);
        setData('rider_id', rider.rider_id);
        setQuery(`${rider.name} (${rider.rider_id})`);
        setResults([]);
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(initiateRenewal().url);
    };

    return (
        <>
            <Head title="Rider Renewal" />

            <div className="space-y-8 p-6">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight">Rider Renewal</h1>
                    <p className="text-muted-foreground">
                        Renew your rider registration for the upcoming season and keep your status active for
                        continued participation.
                    </p>
                </div>

                    <Card>
                        <CardHeader className="border-b pb-6">
                            <div className="flex items-start justify-between gap-4">
                                <div className="space-y-1">
                                    <CardTitle className="text-2xl">Season Renewal</CardTitle>
                                    <CardDescription>Select your rider profile and season to renew</CardDescription>
                                </div>
                                <Badge variant="secondary">Step 1 of 2</Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                        <form onSubmit={submit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="rider_search">Search Rider *</Label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        id="rider_search"
                                        type="text"
                                        value={query}
                                        onChange={(e) => {
                                            setQuery(e.target.value);
                                            setSelectedRider(null);
                                            setData('rider_id', '');
                                        }}
                                        placeholder="Type rider name (min. 2 characters)..."
                                        className="pl-9"
                                        autoComplete="off"
                                        required
                                    />
                                    {searching && (
                                        <Loader2 className="absolute right-3 top-1/2 size-4 -translate-y-1/2 animate-spin text-muted-foreground" />
                                    )}
                                </div>
                                {results.length > 0 && (
                                    <div className="max-h-56 overflow-y-auto rounded-md border bg-popover shadow-md">
                                        {results.map((rider) => (
                                            <button
                                                key={rider.rider_id}
                                                type="button"
                                                onClick={() => pickRider(rider)}
                                                className="flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-sm hover:bg-muted"
                                            >
                                                <span>
                                                    <span className="font-medium">{rider.name}</span>
                                                    <span className="ml-2 font-mono text-xs text-muted-foreground">
                                                        {rider.rider_id}
                                                    </span>
                                                </span>
                                                <span className="text-xs text-muted-foreground">
                                                    {rider.dob ?? ''}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                                {selectedRider && (
                                    <p className="text-sm text-muted-foreground">
                                        Selected: <span className="font-medium text-foreground">{selectedRider.name}</span>{' '}
                                        <span className="font-mono text-xs">{selectedRider.rider_id}</span>
                                        {selectedRider.registered_current_season && (
                                            <span className="ml-2 text-emerald-600">Already registered this season</span>
                                        )}
                                    </p>
                                )}
                                {errors.rider_id && (
                                    <p className="text-sm text-destructive">{errors.rider_id}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="season_id">Season *</Label>
                                <Select
                                    value={data.season_id}
                                    onValueChange={(value) => setData('season_id', value)}
                                    required
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select season" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {seasons?.map((season) => (
                                            <SelectItem key={season.Code} value={season.Code.toString()}>
                                                {season.Name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.season_id && (
                                    <p className="text-sm text-destructive">{errors.season_id}</p>
                                )}
                            </div>

                            <div className="rounded-lg border bg-muted/40 p-5">
                                <div className="mb-3 flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Renewal Fee</p>
                                        <p className="mt-1 text-xs text-muted-foreground">Secure payment via PayTabs</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-3xl font-bold text-primary">50</p>
                                        <p className="text-sm text-muted-foreground">AED</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <ShieldCheck className="size-4 text-primary" />
                                    <span>Encrypted and secure payment</span>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                size="lg"
                                className="w-full"
                                disabled={processing || !data.rider_id}
                            >
                                {processing ? (
                                    <>
                                        <Loader2 className="size-4 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        Proceed to Secure Payment
                                        <ArrowRight className="size-4" />
                                    </>
                                )}
                            </Button>
                        </form>
                        </CardContent>
                    </Card>
            </div>
        </>
    );
}

RiderRenewal.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Rider Renewal', href: '/rider/renewal' },
    ],
};
