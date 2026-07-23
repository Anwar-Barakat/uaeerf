import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

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

            <div className="page-container py-8">
                <div className="max-w-3xl mx-auto space-y-8">
                    <div className="page-header">
                        <h1 className="page-title">Rider Renewal</h1>
                        <p className="page-description">
                            Renew your rider registration for the upcoming season and keep your status active for continued participation.
                        </p>
                    </div>

                    <Card className="card-enhanced">
                        <CardHeader className="border-b">
                            <div className="flex items-start justify-between">
                                <div>
                                    <CardTitle className="text-2xl">Season Renewal</CardTitle>
                                    <CardDescription className="mt-2">
                                        Select your rider profile and season to renew
                                    </CardDescription>
                                </div>
                                <span className="badge-neutral">Step 1 of 2</span>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6">
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

                            <div className="divider" />

                            <div className="rounded-xl border-2 border-blue-500/20 bg-gradient-to-br from-blue-500/5 to-blue-500/10 p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Renewal Fee</p>
                                        <p className="text-xs text-muted-foreground mt-1">Secure payment via PayTabs</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-4xl font-bold text-blue-600">50</p>
                                        <p className="text-sm text-muted-foreground">AED</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                    <span>Encrypted and secure payment</span>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-12 btn-primary text-base"
                                disabled={processing || !userRiders?.length}
                            >
                                {processing ? (
                                    <>
                                        <span className="loading-spinner h-4 w-4 mr-2" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        Proceed to Secure Payment
                                        <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
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
