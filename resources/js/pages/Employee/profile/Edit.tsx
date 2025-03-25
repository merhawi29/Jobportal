import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Head, router, usePage } from '@inertiajs/react';
import { PageProps as InertiaPageProps } from '@inertiajs/core';
import { LoaderCircle } from 'lucide-react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface EmployeeData {
    id: number;
    name: string;
    email: string;
    phone: string;
    photo: string | null;
    company_name: string;
    company_website: string;
    company_size: string;
    industry: string;
    company_description: string;
    location: string;
}

interface PageProps extends InertiaPageProps {
    flash?: {
        success?: string;
        error?: string;
    };
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

export default function Edit() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState<EmployeeData>({
        id: 0,
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

    const { flash = {} } = usePage<PageProps>().props;

    useEffect(() => {
        fetchEmployeeProfile();
    }, []);

    const fetchEmployeeProfile = async () => {
        try {
            const response = await axios.get('/employee/profile');
            setFormData(response.data);
        } catch (err) {
            setError('Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        const formDataToSend = new FormData();
        formDataToSend.append('_method', 'PUT');
        
        console.log('Sending data:', Object.fromEntries(formDataToSend.entries()));
        
        Object.entries(formData).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                formDataToSend.append(key, value.toString());
            }
        });

        try {
            await router.post(route('employee.profile.update'), formDataToSend, {
                forceFormData: true,
                onSuccess: () => {
                    router.visit(route('employee.profile.show'));
                },
                onError: (errors: any) => {
                    console.error('Update error:', errors);
                    if (typeof errors === 'object') {
                        const errorMessage = Object.values(errors).flat().join('\n');
                        setError(errorMessage);
                    } else {
                        setError(errors.toString());
                    }
                    setSubmitting(false);
                }
            });
        } catch (error: any) {
            console.error('Unexpected error:', error);
            setError(error?.message || 'An unexpected error occurred');
            setSubmitting(false);
        }
    };

    const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return;

        const formData = new FormData();
        formData.append('photo', e.target.files[0]);

        try {
            const response = await axios.post(route('employee.profile.photo'), formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setFormData(prev => ({ ...prev, photo: response.data.photo }));
        } catch (err) {
            setError('Failed to upload photo');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <LoaderCircle className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="py-12">
            <Head title="Edit Company Profile" />

            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                {flash?.success && (
                    <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
                        {flash.success}
                    </div>
                )}
                {(flash?.error || error) && (
                    <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                        {flash.error || error}
                    </div>
                )}

                <div className="mb-6">
                    <Button
                        onClick={() => router.visit(route('employee.profile.show'))}
                        variant="outline"
                    >
                        Back to Profile
                    </Button>
                </div>

                <div className="bg-white overflow-hidden shadow-sm rounded-lg">
                    <div className="p-6">
                        <h2 className="text-2xl font-bold mb-6">Edit Company Profile</h2>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-6">
                                    <div>
                                        <Label htmlFor="photo">Profile Photo</Label>
                                        <div className="mt-2 flex items-center gap-4">
                                            <img
                                                src={formData.photo || '/default-avatar.png'}
                                                alt="Profile"
                                                className="w-20 h-20 rounded-full object-cover"
                                            />
                                            <Input
                                                id="photo"
                                                type="file"
                                                onChange={handlePhotoUpload}
                                                accept="image/*"
                                                disabled={submitting}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="name">Name</Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            type="text"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className="mt-1"
                                            disabled={submitting}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="mt-1"
                                            disabled={submitting}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="phone">Phone</Label>
                                        <Input
                                            id="phone"
                                            name="phone"
                                            type="tel"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            className="mt-1"
                                            disabled={submitting}
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="location">Location</Label>
                                        <Input
                                            id="location"
                                            name="location"
                                            type="text"
                                            value={formData.location}
                                            onChange={handleInputChange}
                                            className="mt-1"
                                            disabled={submitting}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <Label htmlFor="company_name">Company Name</Label>
                                        <Input
                                            id="company_name"
                                            name="company_name"
                                            type="text"
                                            value={formData.company_name}
                                            onChange={handleInputChange}
                                            className="mt-1"
                                            disabled={submitting}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="company_website">Company Website</Label>
                                        <Input
                                            id="company_website"
                                            name="company_website"
                                            type="url"
                                            value={formData.company_website}
                                            onChange={handleInputChange}
                                            className="mt-1"
                                            placeholder="https://"
                                            disabled={submitting}
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="company_size">Company Size</Label>
                                        <select
                                            id="company_size"
                                            name="company_size"
                                            value={formData.company_size}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                                            disabled={submitting}
                                            required
                                        >
                                            <option value="">Select company size</option>
                                            {companySizes.map(size => (
                                                <option key={size} value={size}>
                                                    {size} employees
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <Label htmlFor="industry">Industry</Label>
                                        <select
                                            id="industry"
                                            name="industry"
                                            value={formData.industry}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                                            disabled={submitting}
                                            required
                                        >
                                            <option value="">Select industry</option>
                                            {industries.map(industry => (
                                                <option key={industry} value={industry}>
                                                    {industry}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <Label htmlFor="company_description">Company Description</Label>
                                        <textarea
                                            id="company_description"
                                            name="company_description"
                                            value={formData.company_description}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                                            rows={5}
                                            disabled={submitting}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-4">
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={() => router.visit(route('employee.profile.show'))}
                                    disabled={submitting}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={submitting}>
                                    {submitting && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                                    Save Changes
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
