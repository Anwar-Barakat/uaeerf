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

            <div className="container mx-auto max-w-2xl py-8 px-4">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold tracking-tight">Rider Renewal</h1>
                    <p className="text-muted-foreground mt-2">
                        Renew your rider registration for the upcoming season
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Season Renewal</CardTitle>
                        <CardDescription>
                            Keep your rider status active for continued participation
                        </CardDescription>
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

                            <div className="rounded-lg bg-muted p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">Renewal Fee</p>
                                        <p className="text-sm text-muted-foreground">Secure payment via PayTabs</p>
                                    </div>
                                    <p className="text-2xl font-bold">AED 50</p>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={processing || !userRiders?.length}
                            >
                                {processing ? 'Processing...' : 'Proceed to Secure Payment →'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
                </div>
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
