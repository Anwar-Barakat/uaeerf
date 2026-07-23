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

            <div className="container mx-auto max-w-3xl py-8 px-4">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold tracking-tight">Show Jumping Entry</h1>
                    <p className="text-muted-foreground mt-2">
                        Register for a show jumping competition
                    </p>
                </div>

                <Card className="form-card-entry">
                    <CardHeader className="service-header-entry">
                        <CardTitle className="text-xl">Competition Entry</CardTitle>
                        <CardDescription>
                            Enter your details and validate eligibility before payment
                        </CardDescription>
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
                                className="btn-outline-entry h-11"
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

                            <div className="payment-section-entry">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="payment-label-entry text-lg">
                                            Entry Fee
                                        </p>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            Secure payment via PayTabs
                                        </p>
                                    </div>
                                    <div className="payment-amount-entry">
                                        AED 150
                                    </div>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="btn-outline-entry"
                                disabled={
                                    processing ||
                                    !userRiders?.length ||
                                    !userHorses?.length ||
                                    (eligibility !== null && !eligibility.eligible)
                                }
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

ShowJumpingEntry.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Show Jumping Entry', href: '/jumping/entry' },
    ],
};
