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

            <div className="container mx-auto max-w-3xl py-8 px-4">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold tracking-tight">Rider Renewal</h1>
                    <p className="text-muted-foreground mt-2">
                        Renew your rider registration for the upcoming season
                    </p>
                </div>

                <Card className="border-2">
                    <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950">
                        <CardTitle className="text-xl">Season Renewal</CardTitle>
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

                            <div className="rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-6 border-2 border-blue-200 dark:border-blue-800">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-lg font-bold text-blue-900 dark:text-blue-100">
                                            Renewal Fee
                                        </p>
                                        <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                                            Secure payment via PayTabs
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">
                                            AED 50
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-12 text-base bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
                                disabled={processing || !userRiders?.length}
                            >
                                {processing ? 'Processing...' : 'Proceed to Secure Payment →'}
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
