import { Head, useForm } from '@inertiajs/react';
import { ArrowRight, Loader2, ShieldCheck } from 'lucide-react';
import type { FormEventHandler } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface Props {
    seasons: Array<{ Code: number; Name: string }>;
    userRiders: Array<{ id: number; name: string }>;
}

export default function RiderRenewal({ seasons, userRiders }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        rider_id: '',
        season_id: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('rider.renew'));
    };

    return (
        <>
            <Head title="Rider Renewal" />

            <div className="mx-auto max-w-3xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
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
                                <Label htmlFor="rider_id">Select Rider *</Label>
                                <Select
                                    value={data.rider_id}
                                    onValueChange={(value) => setData('rider_id', value)}
                                    required
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select your rider profile" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {userRiders?.map((rider) => (
                                            <SelectItem key={rider.id} value={rider.id.toString()}>
                                                {rider.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.rider_id && (
                                    <p className="text-sm text-destructive">{errors.rider_id}</p>
                                )}
                                {!userRiders?.length && (
                                    <p className="text-sm text-muted-foreground">
                                        No registered riders found. Please register first.
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="season_id">Season *</Label>
                                <Select
                                    value={data.season_id}
                                    onValueChange={(value) => setData('season_id', value)}
                                    required
                                >
                                    <SelectTrigger>
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
                                disabled={processing || !userRiders?.length}
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
