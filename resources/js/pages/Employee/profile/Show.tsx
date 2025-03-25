import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

interface Employee {
    id: number;
    name: string;
    email: string;
    phone: string;
    photo: string;
    company_name: string;
    company_website: string;
    company_size: string;
    industry: string;
    company_description: string;
    location: string;
}

interface Props {
    employee: Employee;
    isOwnProfile: boolean;
}

export default function Show({ employee, isOwnProfile }: Props) {
    return (
        <div className="py-12">
            <Head title="Company Profile" />

            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div className="mb-6 flex justify-between items-center">
                <Link href={'/'} className="btn btn-outline-secondary">
                        <i className="fas fa-home me-2"></i>
                        Back to Home
                    </Link>

                    {isOwnProfile && (
                        <Link
                            href={route('employee.profile.edit')}
                            className="inline-flex items-center px-4 py-2 btn btn-outline-success text-black rounded-md "
                        >
                            Edit Profile
                        </Link>
                    )}
                </div>

                <div className="bg-white overflow-hidden shadow-sm rounded-lg">
                    <div className="p-6">
                        <div className="flex items-center space-x-6 mb-8">
                            <div className="relative">
                                <img
                                    src={employee.photo || '/default-avatar.png'}
                                    alt={`${employee.name}'s avatar`}
                                    className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
                                />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold mb-2">{employee.name}</h1>
                                <div className="text-gray-600 space-y-1">
                                    <p className="flex items-center">
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        {employee.location || 'Location not specified'}
                                    </p>
                                    <p className="flex items-center">
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                        {employee.email}
                                    </p>
                                    {employee.phone && (
                                        <p className="flex items-center">
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                            </svg>
                                            {employee.phone}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <h3 className="text-lg font-semibold mb-4">Company Information</h3>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Company Name</p>
                                        <p className="text-gray-900">{employee.company_name}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Website</p>
                                        <p className="text-gray-900">
                                            {employee.company_website ? (
                                                <a 
                                                    href={employee.company_website} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer" 
                                                    className="text-primary hover:underline"
                                                >
                                                    {employee.company_website}
                                                </a>
                                            ) : 'Not specified'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Size</p>
                                        <p className="text-gray-900">{employee.company_size ? `${employee.company_size} employees` : 'Not specified'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Industry</p>
                                        <p className="text-gray-900">{employee.industry || 'Not specified'}</p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold mb-4">Additional Information</h3>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Location</p>
                                        <p className="text-gray-900">{employee.location || 'Not specified'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Company Description</p>
                                        <p className="text-gray-900 whitespace-pre-wrap">{employee.company_description || 'No description provided'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
