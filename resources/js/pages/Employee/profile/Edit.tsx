import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@/hooks/auth';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { PageProps } from '@inertiajs/core';

interface EmployeeData {
    id: number;
    name: string;
    email: string;
    phone: string;
    user_id: number;
    position: string;
    department: string;
    hire_date: string;
    salary: number;
    employee_id: string;
    photo: string | null;
    country: string;
    user: {
        name: string;
        email: string;
    };
    company_name: string;
    status?: string;
    flash: {
        success?: string;
        error?: string;
    };
}


const Edit: React.FC = () => {
    const [employee, setEmployee] = useState<EmployeeData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<Partial<EmployeeData>>({});
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchEmployeeProfile();
    }, []);

    const fetchEmployeeProfile = async () => {
        try {
            const response = await axios.get('/employee/profile');
            setEmployee(response.data);
            setFormData(response.data);
        } catch (err) {
            setError('Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

        // Only send the fields that should be updated
        const updateData = {
            name: formData.name || '',
            email: formData.email || '',
            phone: formData.phone || '',
            position: formData.position || '',
            department: formData.department || '',
            hire_date: formData.hire_date || '',
            country: formData.country || '',
            company_name: formData.company_name || '',
        };

        try {
            await router.put(route('employee.profile.update'), updateData);
            setEmployee((prev) => {
                if (!prev) return null;
                return {
                    ...prev,
                    ...updateData
                } as EmployeeData;
            });
            setIsEditing(false);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to update profile');
        } finally {
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
            setEmployee(prev => prev ? { ...prev, photo: response.data.photo } : null);
        } catch (err) {
            setError('Failed to upload photo');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-red-500">{error}</div>;
    if (!employee) return <div>No profile found</div>;

    return (

        <div className="max-w-4xl mx-auto p-4">
            <Head title="Edit Profile" />
             {/* Flash Messages */}
             {employee.flash?.success && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
                    <span className="block sm:inline">{employee.flash.success}</span>
                </div>
            )}

            {employee.flash?.error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                    <span className="block sm:inline">{employee.flash.error}</span>
                </div>
            )}

            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 mb-6">
                <Link
                    href={route('employee.profile.show')}
                    className="btn btn-outline-success"
                >
                    <i className="fas fa-arrow-left me-2"></i>
                    Back
                </Link>
            </div>

            <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>

            <div className="bg-white shadow rounded-lg p-6">
                <div className="flex items-center space-x-6 mb-6">
                    <div className="relative">
                        <img
                            src={formData.photo || '/default-avatar.png'}
                            alt="Profile"
                            className="w-32 h-32 rounded-full object-cover"
                        />
                        <label className="block mt-2">
                            <span className="sr-only">Choose profile photo</span>
                            <input
                                type="file"
                                onChange={handlePhotoUpload}
                                accept="image/*"
                                className="block w-full text-sm text-slate-500
                                    file:mr-4 file:py-2 file:px-4
                                    file:rounded-full file:border-0
                                    file:text-sm file:font-semibold
                                    file:bg-blue-50 file:text-blue-700
                                    hover:file:bg-blue-100"
                            />
                        </label>
                    </div>

                    <div>
                                <label className="form-label">Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={employee.name}
                                    onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    required
                                />
                            </div>

                            <div>
                                <label className="form-label">Email</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    value={employee.email}
                                    onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                    required
                                />
                            </div>

                            <div>
                                <label className="form-label">Phone</label>
                                <input
                                    type="tel"
                                    className="form-control"
                                    value={employee.phone}
                                    onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                                />
                            </div>
                </div>

                {!isEditing ? (
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h3 className="font-semibold">Position</h3>
                            <p>{employee.position || 'Not set'}</p>
                        </div>
                        <div>
                            <h3 className="font-semibold">Department</h3>
                            <p>{employee.department || 'Not set'}</p>
                        </div>
                        <div>
                            <h3 className="font-semibold">Hire Date</h3>
                            <p>{employee.hire_date || 'Not set'}</p>
                        </div>
                        <div>
                            <h3 className="font-semibold">Country</h3>
                            <p>{employee.country || 'Not set'}</p>
                        </div>
                        <div>
                            <h3 className="font-semibold">Company Name</h3>
                            <p>{employee.company_name || 'Not set'}</p>
                        </div>
                        <button
                            onClick={() => setIsEditing(true)}
                            className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
                        >
                            Edit Profile
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="mt-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block font-semibold mb-1">Position</label>
                                <input
                                    type="text"
                                    name="position"
                                    value={formData.position || ''}
                                    onChange={handleInputChange}
                                    className="w-full border rounded p-2"
                                />
                            </div>
                            <div>
                                <label className="block font-semibold mb-1">Department</label>
                                <input
                                    type="text"
                                    name="department"
                                    value={formData.department || ''}
                                    onChange={handleInputChange}
                                    className="w-full border rounded p-2"
                                />
                            </div>
                            <div>
                                <label className="block font-semibold mb-1">Hire Date</label>
                                <input
                                    type="date"
                                    name="hire_date"
                                    value={formData.hire_date || ''}
                                    onChange={handleInputChange}
                                    className="w-full border rounded p-2"
                                />
                            </div>
                            <div>
                                <label className="block font-semibold mb-1">Country</label>
                                <input
                                    type="text"
                                    name="country"
                                    value={formData.country || ''}
                                    onChange={handleInputChange}
                                    className="w-full border rounded p-2"
                                />
                            </div>
                            <div>
                                <label className="block font-semibold mb-1">Company Name</label>
                                <input
                                    type="text"
                                    name="company_name"
                                    value={formData.company_name || ''}
                                    onChange={handleInputChange}
                                    className="w-full border rounded p-2"
                                />
                            </div>
                        </div>
                        <div className="mt-4 flex space-x-2">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
                            >
                                {submitting ? 'Saving...' : 'Save Changes'}
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Edit;
