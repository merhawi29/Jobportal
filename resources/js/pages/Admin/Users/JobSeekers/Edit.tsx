import React, { useState, useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import type { User } from '@/types/index';
import axios from 'axios';
import { useTheme } from '@/contexts/ThemeContext';

interface Props {
    jobSeeker: User;
}

export default function Edit({ jobSeeker }: Props) {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    
    const { data, setData, put, processing, errors } = useForm({
        name: jobSeeker.name,
        email: jobSeeker.email,
        phone: jobSeeker.phone || '',
        status: jobSeeker.status,
    });

    const [roleData, setRoleData] = useState({
        role: jobSeeker.role,
    });
    const [roleLoading, setRoleLoading] = useState(false);
    const [roleSuccess, setRoleSuccess] = useState(false);
    const [roleError, setRoleError] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/users/job-seekers/${jobSeeker.id}`);
    };

    const handleRoleChange = async () => {
        setRoleLoading(true);
        setRoleError(null);
        try {
            await axios.post(`/admin/users/job-seekers/${jobSeeker.id}/role`, roleData);
            setRoleSuccess(true);
            // Reload page after role change to reflect new role
            setTimeout(() => window.location.reload(), 1000);
        } catch (error) {
            setRoleError('Failed to update role');
        } finally {
            setRoleLoading(false);
        }
    };

    return (
        <AdminLayout>
            <Head title="Edit Job Seeker" />
            <div className={`p-6 ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'} min-h-screen`}>
                <h1 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>Edit Job Seeker</h1>

                <div className={`rounded-lg shadow p-6 mb-6 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                    <h2 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Assign Role</h2>
                    
                    {roleSuccess && (
                        <div className={`px-4 py-3 rounded mb-4 ${isDark ? 'bg-green-900 border border-green-700 text-green-300' : 'bg-green-100 border border-green-400 text-green-700'}`}>
                            Role updated successfully! Reloading page...
                        </div>
                    )}
                    
                    {roleError && (
                        <div className={`px-4 py-3 rounded mb-4 ${isDark ? 'bg-red-900 border border-red-700 text-red-300' : 'bg-red-100 border border-red-400 text-red-700'}`}>
                            {roleError}
                        </div>
                    )}
                    
                    <div className="flex items-end space-x-4">
                        <div className="flex-1">
                            <label htmlFor="role" className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                User Role
                            </label>
                            <select
                                id="role"
                                value={roleData.role}
                                onChange={e => setRoleData({ role: e.target.value })}
                                className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm
                                    ${isDark ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'}`}
                            >
                                <option value="admin">Admin</option>
                                <option value="moderator">Moderator</option>
                                <option value="employer">Employer</option>
                                <option value="job_seeker">Job Seeker</option>
                            </select>
                        </div>
                        <button
                            type="button"
                            onClick={handleRoleChange}
                            disabled={roleLoading}
                            className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${isDark ? 'focus:ring-offset-gray-800' : ''}`}
                        >
                            {roleLoading ? 'Updating...' : 'Update Role'}
                        </button>
                    </div>
                </div>

                <div className={`rounded-lg shadow p-6 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="name" className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm
                                    ${isDark ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'}`}
                            />
                            {errors.name && <div className="text-red-500 text-sm mt-1">{errors.name}</div>}
                        </div>

                        <div className="mb-4">
                            <label htmlFor="email" className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={data.email}
                                onChange={e => setData('email', e.target.value)}
                                className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm
                                    ${isDark ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'}`}
                            />
                            {errors.email && <div className="text-red-500 text-sm mt-1">{errors.email}</div>}
                        </div>

                        <div className="mb-4">
                            <label htmlFor="phone" className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                Phone
                            </label>
                            <input
                                type="tel"
                                id="phone"
                                value={data.phone}
                                onChange={e => setData('phone', e.target.value)}
                                className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm
                                    ${isDark ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'}`}
                            />
                            {errors.phone && <div className="text-red-500 text-sm mt-1">{errors.phone}</div>}
                        </div>

                        <div className="mb-4">
                            <label htmlFor="status" className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                Status
                            </label>
                            <select
                                id="status"
                                value={data.status}
                                onChange={e => setData('status', e.target.value)}
                                className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm
                                    ${isDark ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'}`}
                            >
                                <option value="active">Active</option>
                                <option value="suspended">Suspended</option>
                            </select>
                            {errors.status && <div className="text-red-500 text-sm mt-1">{errors.status}</div>}
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={processing}
                                className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${isDark ? 'focus:ring-offset-gray-800' : ''}`}
                            >
                                {processing ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
} 