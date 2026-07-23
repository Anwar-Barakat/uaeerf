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
import { register } from '@/routes/rider';

type ListItem = { Code: number; Name: string };
type CountryItem = ListItem & { ShortName?: string };

interface Props {
    disciplines: ListItem[];
    categories: ListItem[];
    cities: ListItem[];
    countries: CountryItem[];
    genders: ListItem[];
    visaCategories: ListItem[];
}

export default function RiderRegistration({ disciplines, categories, cities, countries, genders, visaCategories }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        first_name: '',
        last_name: '',
        date_of_birth: '',
        gender_id: '',
        nationality_id: '',
        city_id: '',
        country_id: '',
        email: '',
        mobile: '',
        address: '',
        po_box: '',
        weight: '',
        visa_category: '',
        eid: '',
        register_season: true,
        register_fei: false,
        passport_number: '',
        discipline_id: '',
        category_id: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(register().url);
    };

    const selectNationality = (code: string) => {
        setData('nationality_id', code);
    };

    const fieldError = (key: keyof typeof errors) =>
        errors[key] ? <p className="text-sm text-destructive">{errors[key]}</p> : null;

    return (
        <>
            <Head title="Rider Registration" />

            <div className="space-y-8 p-6">
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
                        <form onSubmit={submit} className="space-y-8">
                            <div className="space-y-4">
                                <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                                    Rider Details
                                </h3>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="visa_category">Visa Category *</Label>
                                        <Select
                                            value={data.visa_category}
                                            onValueChange={(value) => setData('visa_category', value)}
                                            required
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select visa category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {visaCategories?.map((visa) => (
                                                    <SelectItem key={visa.Code} value={visa.Code.toString()}>
                                                        {visa.Name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {fieldError('visa_category')}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="eid">Emirates ID * (784-YYYY-NNNNNNN-N, YYYY = birth year)</Label>
                                        <Input
                                            id="eid"
                                            type="text"
                                            value={data.eid}
                                            onChange={(e) => setData('eid', e.target.value)}
                                            placeholder="784-1990-1234567-1"
                                            maxLength={18}
                                            required
                                        />
                                        {fieldError('eid')}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="first_name">First Name (Including Middle Name) *</Label>
                                        <Input
                                            id="first_name"
                                            type="text"
                                            value={data.first_name}
                                            onChange={(e) => setData('first_name', e.target.value)}
                                            placeholder="As per passport"
                                            required
                                        />
                                        {fieldError('first_name')}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="last_name">Last Name *</Label>
                                        <Input
                                            id="last_name"
                                            type="text"
                                            value={data.last_name}
                                            onChange={(e) => setData('last_name', e.target.value)}
                                            placeholder="As per passport"
                                            required
                                        />
                                        {fieldError('last_name')}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="date_of_birth">Date of Birth * (min. 11 years old)</Label>
                                        <Input
                                            id="date_of_birth"
                                            type="date"
                                            value={data.date_of_birth}
                                            onChange={(e) => setData('date_of_birth', e.target.value)}
                                            required
                                        />
                                        {fieldError('date_of_birth')}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="gender_id">Gender *</Label>
                                        <Select
                                            value={data.gender_id}
                                            onValueChange={(value) => setData('gender_id', value)}
                                            required
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select gender" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {genders?.map((gender) => (
                                                    <SelectItem key={gender.Code} value={gender.Code.toString()}>
                                                        {gender.Name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {fieldError('gender_id')}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="nationality_id">Nationality *</Label>
                                        <Select
                                            value={data.nationality_id}
                                            onValueChange={selectNationality}
                                            required
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select nationality" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {countries?.map((country) => (
                                                    <SelectItem key={country.Code} value={country.Code.toString()}>
                                                        {country.Name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {fieldError('nationality_id')}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="weight">Weight (kg) *</Label>
                                        <Input
                                            id="weight"
                                            type="number"
                                            min="20"
                                            max="200"
                                            step="0.1"
                                            value={data.weight}
                                            onChange={(e) => setData('weight', e.target.value)}
                                            placeholder="70"
                                            required
                                        />
                                        {fieldError('weight')}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="passport_number">Passport Number</Label>
                                        <Input
                                            id="passport_number"
                                            type="text"
                                            value={data.passport_number}
                                            onChange={(e) => setData('passport_number', e.target.value)}
                                        />
                                        {fieldError('passport_number')}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                                    Contact Details
                                </h3>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email *</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            placeholder="rider@example.com"
                                            required
                                        />
                                        {fieldError('email')}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="mobile">Mobile Number *</Label>
                                        <Input
                                            id="mobile"
                                            type="tel"
                                            value={data.mobile}
                                            onChange={(e) => setData('mobile', e.target.value)}
                                            placeholder="+971501234567"
                                            required
                                        />
                                        {fieldError('mobile')}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="country_id">Country of Residence *</Label>
                                        <Select
                                            value={data.country_id}
                                            onValueChange={(value) => setData('country_id', value)}
                                            required
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select country" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {countries?.map((country) => (
                                                    <SelectItem key={country.Code} value={country.Code.toString()}>
                                                        {country.Name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {fieldError('country_id')}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="city_id">City *</Label>
                                        <Select
                                            value={data.city_id}
                                            onValueChange={(value) => setData('city_id', value)}
                                            required
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select city" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {cities?.map((city) => (
                                                    <SelectItem key={city.Code} value={city.Code.toString()}>
                                                        {city.Name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {fieldError('city_id')}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="address">Address *</Label>
                                        <Input
                                            id="address"
                                            type="text"
                                            value={data.address}
                                            onChange={(e) => setData('address', e.target.value)}
                                            placeholder="Street, building, area"
                                            required
                                        />
                                        {fieldError('address')}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="po_box">PO Box *</Label>
                                        <Input
                                            id="po_box"
                                            type="text"
                                            value={data.po_box}
                                            onChange={(e) => setData('po_box', e.target.value)}
                                            placeholder="12345"
                                            required
                                        />
                                        {fieldError('po_box')}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                                    Registration
                                </h3>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="discipline_id">Discipline *</Label>
                                        <Select
                                            value={data.discipline_id}
                                            onValueChange={(value) => setData('discipline_id', value)}
                                            required
                                        >
                                            <SelectTrigger className="w-full">
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
                                        {fieldError('discipline_id')}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="category_id">Category *</Label>
                                        <Select
                                            value={data.category_id}
                                            onValueChange={(value) => setData('category_id', value)}
                                            required
                                        >
                                            <SelectTrigger className="w-full">
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
                                        {fieldError('category_id')}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="flex items-center gap-3 text-sm">
                                    <input
                                        type="checkbox"
                                        checked={data.register_season}
                                        onChange={(e) => setData('register_season', e.target.checked)}
                                        className="size-4 rounded border-input"
                                    />
                                    I would like to register for the current season
                                </label>
                                <label className="flex items-center gap-3 text-sm">
                                    <input
                                        type="checkbox"
                                        checked={data.register_fei}
                                        onChange={(e) => setData('register_fei', e.target.checked)}
                                        className="size-4 rounded border-input"
                                    />
                                    I would like to Register in FEI (Additional Charges)
                                </label>
                            </div>

                            {Object.keys(errors).length > 0 && (
                                <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-4">
                                    <p className="mb-2 text-sm font-semibold text-destructive">
                                        Please fix the following before continuing:
                                    </p>
                                    <ul className="list-inside list-disc space-y-1 text-sm text-destructive">
                                        {Object.entries(errors).map(([key, message]) => (
                                            <li key={key}>{message as string}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

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
