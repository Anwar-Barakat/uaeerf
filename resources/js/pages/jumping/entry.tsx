import { Head, useForm } from '@inertiajs/react';
import axios from 'axios';
import { ArrowRight, Loader2, Search, ShieldCheck } from 'lucide-react';
import type { FormEventHandler} from 'react';
import { useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
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

            <div className="mx-auto max-w-3xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight">Show Jumping Entry</h1>
                    <p className="text-muted-foreground">
                        Register for show jumping competitions. Enter your details and validate eligibility
                        before proceeding to payment.
                    </p>
                </div>

                    <Card>
                        <CardHeader className="border-b pb-6">
                            <div className="flex items-start justify-between gap-4">
                                <div className="space-y-1">
                                    <CardTitle className="text-2xl">Competition Entry</CardTitle>
                                    <CardDescription>Complete the form and verify eligibility</CardDescription>
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
                                {validating ? (
                                    <>
                                        <Loader2 className="size-4 animate-spin" />
                                        Validating...
                                    </>
                                ) : (
                                    <>
                                        <Search className="size-4" />
                                        Check Eligibility
                                    </>
                                )}
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

                            <div className="rounded-lg border bg-muted/40 p-5">
                                <div className="mb-3 flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Entry Fee</p>
                                        <p className="mt-1 text-xs text-muted-foreground">Secure payment via PayTabs</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-3xl font-bold text-primary">150</p>
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
                                disabled={
                                    processing ||
                                    !userRiders?.length ||
                                    !userHorses?.length ||
                                    (eligibility !== null && !eligibility.eligible)
                                }
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

ShowJumpingEntry.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Show Jumping Entry', href: '/jumping/entry' },
    ],
};
