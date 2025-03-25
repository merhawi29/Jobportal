import React from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';

interface CompanyProfileForm {
    [key: string]: any;
    name: string;
    email: string;
    phone: string;
    photo: File | null;
    company_name: string;
    company_website: string;
    company_size: string;
    industry: string;
    company_description: string;
    location: string;
}

const companySizes = [
    '1-10',
    '11-50',
    '51-200',
    '201-500',
    '501-1000',
    '1000+'
];

const industries = [
    'Technology',
    'Healthcare',
    'Finance',
    'Education',
    'Manufacturing',
    'Retail',
    'Construction',
    'Transportation',
    'Entertainment',
    'Other'
];

export default function Create() {
    const { data, setData, post, processing, errors, progress } = useForm<CompanyProfileForm>({
        name: '',
        email: '',
        phone: '',
        photo: null,
        company_name: '',
        company_website: '',
        company_size: '',
        industry: '',
        company_description: '',
        location: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('employee.profile.store'), {
            onSuccess: () => {
                router.visit(route('employee.profile.show'));
            }
        });
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            setData('photo', e.target.files[0]);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <Head title="Complete Company Profile" />

            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div className="bg-white overflow-hidden shadow-sm rounded-lg">
                    <div className="p-8">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-gray-900">Welcome!</h2>
                            <p className="text-xl text-gray-600 mt-2">Complete Your Company Profile</p>
                            <p className="text-gray-500 mt-1">This information will help job seekers learn more about your company</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div>
                                        <Label htmlFor="photo">Company Logo</Label>
                                        <div className="mt-2">
                                            <Input
                                                id="photo"
                                                type="file"
                                                onChange={handlePhotoChange}
                                                accept="image/*"
                                                disabled={processing}
                                            />
                                            {progress && (
                                                <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-success transition-all duration-300"
                                                        style={{ width: `${progress}%` }}
                                                    />
                                                </div>
                                            )}
                                            <InputError message={errors.photo} />
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="name">Contact Person Name</Label>
                                        <Input
                                            id="name"
                                            type="text"
                                            value={data.name}
                                            onChange={e => setData('name', e.target.value)}
                                            disabled={processing}
                                            required
                                            placeholder="Enter your full name"
                                        />
                                        <InputError message={errors.name} />
                                    </div>

                                    <div>
                                        <Label htmlFor="email">Business Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            onChange={e => setData('email', e.target.value)}
                                            disabled={processing}
                                            required
                                            placeholder="company@example.com"
                                        />
                                        <InputError message={errors.email} />
                                    </div>

                                    <div>
                                        <Label htmlFor="phone">Contact Phone</Label>
                                        <Input
                                            id="phone"
                                            type="tel"
                                            value={data.phone}
                                            onChange={e => setData('phone', e.target.value)}
                                            disabled={processing}
                                            placeholder="+251 99 261 3985"
                                        />
                                        <InputError message={errors.phone} />
                                    </div>

                                    <div>
                                        <Label htmlFor="location">Company Location</Label>
                                        <Input
                                            id="location"
                                            type="text"
                                            value={data.location}
                                            onChange={e => setData('location', e.target.value)}
                                            placeholder="City, Country"
                                            disabled={processing}
                                        />
                                        <InputError message={errors.location} />
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <Label htmlFor="company_name">Company Name</Label>
                                        <Input
                                            id="company_name"
                                            type="text"
                                            value={data.company_name}
                                            onChange={e => setData('company_name', e.target.value)}
                                            disabled={processing}
                                            required
                                            placeholder="Enter your company name"
                                        />
                                        <InputError message={errors.company_name} />
                                    </div>

                                    <div>
                                        <Label htmlFor="company_website">Company Website</Label>
                                        <Input
                                            id="company_website"
                                            type="url"
                                            value={data.company_website}
                                            onChange={e => setData('company_website', e.target.value)}
                                            placeholder="https://www.example.com"
                                            disabled={processing}
                                        />
                                        <InputError message={errors.company_website} />
                                    </div>

                                    <div>
                                        <Label htmlFor="company_size">Company Size</Label>
                                        <select
                                            id="company_size"
                                            value={data.company_size}
                                            onChange={e => setData('company_size', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                                            disabled={processing}
                                            required
                                        >
                                            <option value="">Select company size</option>
                                            {companySizes.map(size => (
                                                <option key={size} value={size}>
                                                    {size} employees
                                                </option>
                                            ))}
                                        </select>
                                        <InputError message={errors.company_size} />
                                    </div>

                                    <div>
                                        <Label htmlFor="industry">Industry</Label>
                                        <select
                                            id="industry"
                                            value={data.industry}
                                            onChange={e => setData('industry', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                                            disabled={processing}
                                            required
                                        >
                                            <option value="">Select industry</option>
                                            {industries.map(industry => (
                                                <option key={industry} value={industry}>
                                                    {industry}
                                                </option>
                                            ))}
                                        </select>
                                        <InputError message={errors.industry} />
                                    </div>

                                    <div>
                                        <Label htmlFor="company_description">Company Description</Label>
                                        <textarea
                                            id="company_description"
                                            value={data.company_description}
                                            onChange={e => setData('company_description', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                                            rows={5}
                                            disabled={processing}
                                            required
                                            placeholder="Tell job seekers about your company's mission, values, and culture..."
                                        />
                                        <InputError message={errors.company_description} />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end space-x-4">
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={() => window.history.back()}
                                    disabled={processing}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                                    Complete Profile
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
} 