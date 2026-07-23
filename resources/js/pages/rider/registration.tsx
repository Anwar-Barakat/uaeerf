import { Head, useForm } from '@inertiajs/react';
import { ArrowRight, Loader2, ShieldCheck } from 'lucide-react';
import type { FormEventHandler } from 'react';
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
    disciplines: Array<{ Code: number; Name: string }>;
    categories: Array<{ Code: number; Name: string }>;
}

export default function RiderRegistration({ disciplines, categories }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        rider_name: '',
        date_of_birth: '',
        nationality: 'ARE',
        passport_number: '',
        discipline_id: '',
        category_id: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('rider.register'));
    };

    return (
        <>
            <Head title="Rider Registration" />

            <div className="mx-auto max-w-3xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight">Rider Registration</h1>
                    <p className="text-muted-foreground">
                        Register as a new rider with the UAE Equestrian &amp; Racing Federation. Complete the
                        form below to begin your registration process.
                    </p>
                </div>

                    <Card>
                        <CardHeader className="border-b pb-6">
                            <div className="flex items-start justify-between gap-4">
                                <div className="space-y-1">
                                    <CardTitle className="text-2xl">New Rider Application</CardTitle>
                                    <CardDescription>All fields marked with * are required</CardDescription>
                                </div>
                                <Badge variant="secondary">Step 1 of 2</Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                        <form onSubmit={submit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="rider_name">Rider Name *</Label>
                                <Input
                                    id="rider_name"
                                    type="text"
                                    value={data.rider_name}
                                    onChange={(e) => setData('rider_name', e.target.value)}
                                    required
                                />
                                {errors.rider_name && (
                                    <p className="text-sm text-destructive">{errors.rider_name}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="date_of_birth">Date of Birth *</Label>
                                <Input
                                    id="date_of_birth"
                                    type="date"
                                    value={data.date_of_birth}
                                    onChange={(e) => setData('date_of_birth', e.target.value)}
                                    required
                                />
                                {errors.date_of_birth && (
                                    <p className="text-sm text-destructive">{errors.date_of_birth}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="nationality">Nationality *</Label>
                                <Input
                                    id="nationality"
                                    type="text"
                                    value={data.nationality}
                                    onChange={(e) => setData('nationality', e.target.value)}
                                    placeholder="3-letter country code (e.g., ARE)"
                                    maxLength={3}
                                    required
                                />
                                {errors.nationality && (
                                    <p className="text-sm text-destructive">{errors.nationality}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="passport_number">Passport Number</Label>
                                <Input
                                    id="passport_number"
                                    type="text"
                                    value={data.passport_number}
                                    onChange={(e) => setData('passport_number', e.target.value)}
                                />
                                {errors.passport_number && (
                                    <p className="text-sm text-destructive">{errors.passport_number}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="discipline_id">Discipline *</Label>
                                <Select
                                    value={data.discipline_id}
                                    onValueChange={(value) => setData('discipline_id', value)}
                                    required
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select discipline" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {disciplines?.map((discipline) => (
                                            <SelectItem
                                                key={discipline.Code}
                                                value={discipline.Code.toString()}
                                            >
                                                {discipline.Name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.discipline_id && (
                                    <p className="text-sm text-destructive">{errors.discipline_id}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="category_id">Category *</Label>
                                <Select
                                    value={data.category_id}
                                    onValueChange={(value) => setData('category_id', value)}
                                    required
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories?.map((category) => (
                                            <SelectItem
                                                key={category.Code}
                                                value={category.Code.toString()}
                                            >
                                                {category.Name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.category_id && (
                                    <p className="text-sm text-destructive">{errors.category_id}</p>
                                )}
                            </div>

                            <div className="rounded-lg border bg-muted/40 p-5">
                                <div className="mb-3 flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Registration Fee</p>
                                        <p className="mt-1 text-xs text-muted-foreground">Secure payment via PayTabs</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-3xl font-bold text-primary">100</p>
                                        <p className="text-sm text-muted-foreground">AED</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <ShieldCheck className="size-4 text-primary" />
                                    <span>Encrypted and secure payment</span>
                                </div>
                            </div>

                            <Button type="submit" size="lg" className="w-full" disabled={processing}>
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

RiderRegistration.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Rider Registration', href: '/rider/registration' },
    ],
};
