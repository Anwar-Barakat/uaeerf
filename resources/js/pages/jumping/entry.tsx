import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import axios from 'axios';

interface Props {
    userRiders: Array<{ id: number; name: string }>;
    userHorses: Array<{ id: number; name: string }>;
}

export default function ShowJumpingEntry({ userRiders, userHorses }: Props) {
    const [validating, setValidating] = useState(false);
    const [eligibility, setEligibility] = useState<{
        eligible: boolean;
        rider_eligible: boolean;
        horse_eligible: boolean;
        message?: string;
    } | null>(null);

    const { data, setData, post, processing, errors } = useForm({
        rider_id: '',
        horse_id: '',
        event_id: '',
        class_id: '',
        event_name: '',
    });

    const validateEligibility = async () => {
        if (!data.rider_id || !data.horse_id || !data.event_id || !data.class_id) {
            return;
        }

        setValidating(true);
        setEligibility(null);

        try {
            const response = await axios.post(route('jumping.validate'), {
                rider_id: data.rider_id,
                horse_id: data.horse_id,
                event_id: data.event_id,
                class_id: data.class_id,
            });

            setEligibility(response.data);
        } catch (error: any) {
            setEligibility({
                eligible: false,
                rider_eligible: false,
                horse_eligible: false,
                message: error.response?.data?.error || 'Validation failed',
            });
        } finally {
            setValidating(false);
        }
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('jumping.entry'));
    };

    return (
        <>
            <Head title="Show Jumping Entry" />

            <div className="page-container py-8">
                <div className="max-w-3xl mx-auto space-y-8">
                    <div className="page-header">
                        <h1 className="page-title">Show Jumping Entry</h1>
                        <p className="page-description">
                            Register for show jumping competitions. Enter your details and validate eligibility before proceeding to payment.
                        </p>
                    </div>

                    <Card className="card-enhanced">
                        <CardHeader className="border-b">
                            <div className="flex items-start justify-between">
                                <div>
                                    <CardTitle className="text-2xl">Competition Entry</CardTitle>
                                    <CardDescription className="mt-2">
                                        Complete the form and verify eligibility
                                    </CardDescription>
                                </div>
                                <span className="badge-warning">Step 1 of 2</span>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                        <form onSubmit={submit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="rider_id">Select Rider *</Label>
                                <Select
                                    value={data.rider_id}
                                    onValueChange={(value) => {
                                        setData('rider_id', value);
                                        setEligibility(null);
                                    }}
                                    required
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select rider" />
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
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="horse_id">Select Horse *</Label>
                                <Select
                                    value={data.horse_id}
                                    onValueChange={(value) => {
                                        setData('horse_id', value);
                                        setEligibility(null);
                                    }}
                                    required
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select horse" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {userHorses?.map((horse) => (
                                            <SelectItem key={horse.id} value={horse.id.toString()}>
                                                {horse.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.horse_id && (
                                    <p className="text-sm text-destructive">{errors.horse_id}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="event_id">Event ID *</Label>
                                <Input
                                    id="event_id"
                                    type="number"
                                    value={data.event_id}
                                    onChange={(e) => {
                                        setData('event_id', e.target.value);
                                        setEligibility(null);
                                    }}
                                    required
                                />
                                {errors.event_id && (
                                    <p className="text-sm text-destructive">{errors.event_id}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="class_id">Class ID *</Label>
                                <Input
                                    id="class_id"
                                    type="number"
                                    value={data.class_id}
                                    onChange={(e) => {
                                        setData('class_id', e.target.value);
                                        setEligibility(null);
                                    }}
                                    required
                                />
                                {errors.class_id && (
                                    <p className="text-sm text-destructive">{errors.class_id}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="event_name">Event Name *</Label>
                                <Input
                                    id="event_name"
                                    type="text"
                                    value={data.event_name}
                                    onChange={(e) => setData('event_name', e.target.value)}
                                    required
                                />
                                {errors.event_name && (
                                    <p className="text-sm text-destructive">{errors.event_name}</p>
                                )}
                            </div>

                            <Button
                                type="button"
                                variant="outline"
                                className="w-full"
                                onClick={validateEligibility}
                                disabled={validating || !data.rider_id || !data.horse_id}
                            >
                                {validating ? 'Validating...' : '🔍 Check Eligibility'}
                            </Button>

                            {eligibility && (
                                <Alert
                                    variant={eligibility.eligible ? 'default' : 'destructive'}
                                    className={eligibility.eligible ? 'border-green-500' : ''}
                                >
                                    <AlertDescription>
                                        {eligibility.eligible ? (
                                            <>
                                                <strong>✓ Eligible</strong>
                                                <br />
                                                Rider: {eligibility.rider_eligible ? '✓' : '✗'} | Horse:{' '}
                                                {eligibility.horse_eligible ? '✓' : '✗'}
                                            </>
                                        ) : (
                                            <>
                                                <strong>✗ Not Eligible</strong>
                                                <br />
                                                {eligibility.message ||
                                                    `Rider: ${eligibility.rider_eligible ? '✓' : '✗'} | Horse: ${eligibility.horse_eligible ? '✓' : '✗'}`}
                                            </>
                                        )}
                                    </AlertDescription>
                                </Alert>
                            )}

                            <div className="divider" />

                            <div className="rounded-xl border-2 border-accent/20 bg-gradient-to-br from-accent/5 to-accent/10 p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Entry Fee</p>
                                        <p className="text-xs text-muted-foreground mt-1">Secure payment via PayTabs</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-4xl font-bold text-accent">150</p>
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
                                disabled={
                                    processing ||
                                    !userRiders?.length ||
                                    !userHorses?.length ||
                                    (eligibility !== null && !eligibility.eligible)
                                }
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

ShowJumpingEntry.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Show Jumping Entry', href: '/jumping/entry' },
    ],
};
