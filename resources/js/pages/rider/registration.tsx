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

            <div className="container mx-auto max-w-2xl py-8 px-4">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold tracking-tight">Rider Registration</h1>
                    <p className="text-muted-foreground mt-2">
                        Register as a new rider with UAE Equestrian & Racing Federation
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>New Rider Application</CardTitle>
                        <CardDescription>
                            Complete the form below to begin your rider registration process
                        </CardDescription>
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

                            <div className="rounded-lg bg-muted p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">Registration Fee</p>
                                        <p className="text-sm text-muted-foreground">Secure payment via PayTabs</p>
                                    </div>
                                    <p className="text-2xl font-bold">AED 100</p>
                                </div>
                            </div>

                            <Button type="submit" className="w-full" disabled={processing}>
                                {processing ? 'Processing...' : 'Proceed to Secure Payment →'}
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
