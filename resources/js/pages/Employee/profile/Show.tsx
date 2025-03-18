import React from 'react';
import { Head , Link, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Auth } from '@/types';
import { PageProps } from '@inertiajs/core';

interface Employee {
    id: number;
    name: string;
    email: string;
    phone: string;
    position: string;
    department: string;
    hire_date: string;
    status: string;
    photo: string;
    address: string;
    country: string;
    company_name: string;
    isOwnProfile: boolean;
    location?: string;
    show_email?: boolean;
    user?: {
        name: string;
        email: string;
        phone: string;
    };
}

interface Props extends PageProps {
    auth: Auth;
    employee: Employee;
    isOwnProfile: boolean;
    flash: {
        message?: string;
        error?: string;
    };
}

export default function Show({ employee, isOwnProfile }: Props) {
    const { flash } = usePage<Props>().props;
    return (
        <AppLayout>

            <Head title="Employee Profile" />
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="mb-6 flex justify-between items-center">
                        <Link
                            href={route('home')}
                            className="btn btn-outline-success"
                        >
                            <i className="fas fa-arrow-left me-2"></i>
                            Back to Home
                        </Link>


                            <Link
                                href={route('employee.profile.edit')}
                                className="btn btn-outline-success"
                            >
                                <i className="fas fa-edit me-2"></i>
                                Edit Profile
                            </Link>

                    </div>
            <h2 className="font-semibold text-xl text-gray-800 leading-tight mb-6">Employee Profile</h2>

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {/* Profile Header */}
                            <div className="flex items-center space-x-6 mb-8">
                                <div className="relative">
                                    <img
                                    //    src = {`${'/employee_photos/'}${employee.photo}`}
                                         src={employee.photo || '/default-avatar.png'}
                                        alt={`${employee.name}'s avatarm`}
                                        className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
                                    />
                                     <div>
                                    <h1 className="text-3xl font-bold mb-2">{employee.name}</h1>
                                    <div className="text-gray-600">
                                        <p><i className="fas fa-map-marker-alt me-2"></i>{employee.location || 'Location not specified'}</p>
                                        {(isOwnProfile || employee.email) && (
                                            <p><i className="fas fa-envelope me-2"></i>{employee.email}</p>
                                        )}
                                        {(employee.isOwnProfile || employee.phone) && employee.phone && (
                                            <p><i className="fas fa-phone me-2"></i>{employee.phone}</p>
                                        )}
                                    </div>
                                </div>


                            </div>

                            {/* Profile Information */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Contact Information</h3>
                                        <div className="space-y-4">
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Email</p>
                                                <p className="text-gray-900">{employee.email}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Phone</p>
                                                <p className="text-gray-900">{employee.phone}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Country</p>
                                                <p className="text-gray-900">{employee.country}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Employment Details</h3>
                                        <div className="space-y-4">
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Company</p>
                                                <p className="text-gray-900">{employee.company_name}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Department</p>
                                                <p className="text-gray-900">{employee.department}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Position</p>
                                                <p className="text-gray-900">{employee.position}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Hire Date</p>
                                                <p className="text-gray-900">{employee.hire_date}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Status</p>
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                    employee.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                }`}>
                                                    {employee.status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </div>
        </div>
        </AppLayout>
    );
}
