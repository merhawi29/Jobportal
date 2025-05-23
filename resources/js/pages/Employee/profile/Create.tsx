import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { Link } from '@inertiajs/react';
import { FormDataConvertible } from '@inertiajs/core';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import Textarea from '@/components/TextArea';

interface Props {
    flash?: {
        success?: string;
        error?: string;
        info?: string;
        warning?: string;
    };
    error?: string;
}

interface EmployerProfileForm {
    [key: string]: FormDataConvertible;
    name: string;
    email: string;
    phone: string;
    photo: File | null;
    company_name: string;
    company_website: string;
    company_size: string;
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

export default function Create({ flash, error }: Props) {
    const [imageSrc, setImageSrc] = useState('/assets/img/logo/testimonial.png');
    
    const { data, setData, post, processing, errors, progress } = useForm<EmployerProfileForm>({
        name: '',
        email: '',
        phone: '',
        photo: null,
        company_name: '',
        company_website: '',
        company_size: '',
        company_description: '',
        location: '',
    });

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            const file = e.target.files[0];
            setData('photo', file);
            setImageSrc(URL.createObjectURL(file));
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Ensure we have a fresh CSRF token
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        
        router.post(route('employee.profile.store'), data, {
            headers: {
                'X-CSRF-TOKEN': csrfToken || '',
            },
            onError: (errors) => {
                if (errors.hasOwnProperty('_token')) {
                    // CSRF token error - refresh the page to get a new token
                    window.location.reload();
                }
            }
        });
    };

    return (
        <div className="container mx-auto p-4">
            <Link href={route('employee.profile.show')} className="btn btn-outline-secondary">
                <i className="fas fa-home me-2"></i>
                Back to Profile
            </Link>
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
                <h1 className="text-2xl font-semibold mb-6">Create Company Profile</h1>

                {flash?.success && (
                    <div className="alert alert-success alert-dismissible fade show" role="alert">
                        {flash.success}
                        <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>
                )}
                {(flash?.error || error) && (
                    <div className="alert alert-danger alert-dismissible fade show" role="alert">
                        {flash?.error || error}
                        <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>
                )}
                {flash?.info && (
                    <div className="alert alert-info alert-dismissible fade show" role="alert">
                        {flash.info}
                        <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>
                )}
                {flash?.warning && (
                    <div className="alert alert-warning alert-dismissible fade show" role="alert">
                        {flash.warning}
                        <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>
                )}

                <form onSubmit={submit}>
                    <div className="space-y-6">
                        <div>
                            <Label htmlFor="name">Name</Label>
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
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={e => setData('email', e.target.value)}
                                disabled={processing}
                                required
                                placeholder="Enter your email"
                            />
                            <InputError message={errors.email} />
                        </div>

                        <div>
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input
                                id="phone"
                                type="tel"
                                value={data.phone}
                                onChange={e => setData('phone', e.target.value)}
                                disabled={processing}
                                placeholder="+251 99 999 9999"
                            />
                            <InputError message={errors.phone} />
                        </div>

                        <div>
                            <Label htmlFor="photo">Company Logo</Label>
                            <div className="mt-2 flex items-center gap-4">
                                <img
                                    src={imageSrc}
                                    alt="Company Logo"
                                    className="w-20 h-20 rounded-full object-cover"
                                />
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
                                disabled={processing}
                                placeholder="https://www.yourcompany.com"
                            />
                            <InputError message={errors.company_website} />
                        </div>

                        <div>
                            <Label htmlFor="company_size">Company Size</Label>
                            <select
                                id="company_size"
                                className="form-select"
                                value={data.company_size}
                                onChange={e => setData('company_size', e.target.value)}
                                disabled={processing}
                                required
                            >
                                <option value="">Select company size</option>
                                {companySizes.map(size => (
                                    <option key={size} value={size}>{size} employees</option>
                                ))}
                            </select>
                            <InputError message={errors.company_size} />
                        </div>

                        <div>
                            <Label htmlFor="location">Location</Label>
                            <Input
                                id="location"
                                type="text"
                                value={data.location}
                                onChange={e => setData('location', e.target.value)}
                                disabled={processing}
                                required
                                placeholder="City, Country"
                            />
                            <InputError message={errors.location} />
                        </div>

                        <div>
                            <Label htmlFor="company_description">Company Description</Label>
                            <Textarea
                                id="company_description"
                                value={data.company_description}
                                onChange={e => setData('company_description', e.target.value)}
                                disabled={processing}
                                required
                                placeholder="Describe your company, its mission, and values..."
                                rows={6}
                            />
                            <InputError message={errors.company_description} />
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 mt-6">
                        <Button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={() => router.visit(route('home'))}
                            disabled={processing}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing} className="btn btn-outline-success">
                            {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                            Create Profile
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
} 