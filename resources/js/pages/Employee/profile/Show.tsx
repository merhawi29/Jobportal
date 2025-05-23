import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Props {
    employee: {
        id: number;
        name: string;
        email: string;
        phone: string;
        photo: string | null;
        company_name: string;
        company_website: string;
        company_size: string;
        company_description: string;
        location: string;
    };
    isOwnProfile?: boolean;
    flash?: {
        success?: string;
        error?: string;
    };
    error?: string;
}

export default function Show({ employee, isOwnProfile = false, flash, error }: Props) {
    return (
        <div className="container mx-auto p-4">
            <div className="max-w-4xl mx-auto">
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
                <Link href={'/'} className="btn btn-outline-secondary">
                        <i className="fas fa-home me-2"></i>
                        Back to Home
                    </Link>
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="p-6">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-4">
                                <img
                                    src={employee.photo || '/assets/img/logo/testimonial.png'}
                                    alt="Company Logo"
                                    className="w-24 h-24 rounded-full object-cover"
                                />
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">{employee.company_name}</h1>
                                    <p className="text-gray-600">{employee.location}</p>
                                </div>
                            </div>
                            <div className="flex space-x-2">
                                {isOwnProfile && (
                                    <Link href={route('employee.profile.edit')}>
                                        <Button className="btn btn-outline-success">
                                            <i className="fas fa-edit me-2"></i>
                                            Edit Profile
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card className="p-4">
                                <h2 className="text-lg font-semibold mb-4">Company Information</h2>
                                <div className="space-y-3">
                                    <div>
                                        <span className="text-gray-600">Company Size:</span>
                                        <Badge className="ml-2">{employee.company_size} employees</Badge>
                                    </div>
                                    {employee.company_website && (
                                        <div>
                                            <span className="text-gray-600">Website:</span>
                                            <a
                                                href={employee.company_website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:underline ml-2"
                                            >
                                                {employee.company_website}
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </Card>

                            <Card className="p-4">
                                <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
                                <div className="space-y-3">
                                    <div>
                                        <span className="text-gray-600">Contact Person:</span>
                                        <span className="ml-2">{employee.name}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Email:</span>
                                        <span className="ml-2">{employee.email}</span>
                                    </div>
                                    {employee.phone && (
                                        <div>
                                            <span className="text-gray-600">Phone:</span>
                                            <span className="ml-2">{employee.phone}</span>
                                        </div>
                                    )}
                                </div>
                            </Card>
                        </div>

                        <Card className="mt-6 p-4">
                            <h2 className="text-lg font-semibold mb-4">About the Company</h2>
                            <p className="text-white whitespace-pre-wrap">{employee.company_description}</p>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
