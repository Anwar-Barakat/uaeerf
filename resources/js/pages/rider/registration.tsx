import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
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

            <div className="page-container py-8">
                <div className="max-w-3xl mx-auto space-y-8">
                    <div className="page-header">
                        <h1 className="page-title">Rider Registration</h1>
                        <p className="page-description">
                            Register as a new rider with the UAE Equestrian & Racing Federation. Complete the form below to begin your registration process.
                        </p>
                    </div>

                    <Card className="card-enhanced">
                        <CardHeader className="border-b">
                            <div className="flex items-start justify-between">
                                <div>
                                    <CardTitle className="text-2xl">New Rider Application</CardTitle>
                                    <CardDescription className="mt-2">
                                        All fields marked with * are required
                                    </CardDescription>
                                </div>
                                <span className="badge-primary">Step 1 of 2</span>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6">
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

                            <div className="divider" />

                            <div className="rounded-xl border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Registration Fee</p>
                                        <p className="text-xs text-muted-foreground mt-1">Secure payment via PayTabs</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-4xl font-bold text-primary">100</p>
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

                            <Button type="submit" className="w-full h-12 btn-primary text-base" disabled={processing}>
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

RiderRegistration.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Rider Registration', href: '/rider/registration' },
    ],
};
