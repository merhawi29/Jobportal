import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import type { User } from '@/types/index';
import axios from 'axios';
import { useTheme } from '@/contexts/ThemeContext';

interface Props {
    employer: User;
}

export default function EditEmployer({ employer }: Props) {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    
    const [formData, setFormData] = useState({
        name: employer.name,
        email: employer.email,
        phone: employer.phone || '',
        status: employer.status,
        company_name: employer.employer_profile?.company_name || '',
        company_website: employer.employer_profile?.company_website || '',
        industry: employer.employer_profile?.industry || '',
        company_size: employer.employer_profile?.company_size || '',
        company_description: employer.employer_profile?.company_description || '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const [roleData, setRoleData] = useState({
        role: employer.role,
    });
    const [roleLoading, setRoleLoading] = useState(false);
    const [roleSuccess, setRoleSuccess] = useState(false);
    const [roleError, setRoleError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await axios.put(`/admin/users/${employer.id}`, formData);
            setSuccess(true);
        } catch (error) {
            setError('Failed to update employer');
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = async () => {
        setRoleLoading(true);
        setRoleError(null);
        try {
            await axios.post(`/admin/users/employers/${employer.id}/role`, roleData);
            setRoleSuccess(true);
            // Reload page after role change to reflect new role
            setTimeout(() => window.location.reload(), 1000);
        } catch (error) {
            setRoleError('Failed to update role');
        } finally {
            setRoleLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <AdminLayout>
            <Head title="Edit Employer" />
            <div className={`p-6 ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'} min-h-screen`}>
                <h1 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>Edit Employer</h1>

                {error && (
                    <div className={`px-4 py-3 rounded mb-4 ${isDark ? 'bg-red-900 border border-red-700 text-red-300' : 'bg-red-100 border border-red-400 text-red-700'}`}>
                        {error}
                    </div>
                )}

                {success && (
                    <div className={`px-4 py-3 rounded mb-4 ${isDark ? 'bg-green-900 border border-green-700 text-green-300' : 'bg-green-100 border border-green-400 text-green-700'}`}>
                        Employer updated successfully!
                    </div>
                )}

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

                <form onSubmit={handleSubmit} className={`rounded-lg shadow p-6 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500
                                    ${isDark ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'}`}
                                required
                            />
                        </div>

                        <div>
                            <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500
                                    ${isDark ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'}`}
                                required
                            />
                        </div>

                        <div>
                            <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Phone</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500
                                    ${isDark ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'}`}
                            />
                        </div>

                        <div>
                            <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Status</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500
                                    ${isDark ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'}`}
                                required
                            >
                                <option value="active">Active</option>
                                <option value="suspended">Suspended</option>
                            </select>
                        </div>

                        <div>
                            <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Company Name</label>
                            <input
                                type="text"
                                name="company_name"
                                value={formData.company_name}
                                onChange={handleChange}
                                className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500
                                    ${isDark ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'}`}
                                required
                            />
                        </div>

                        <div>
                            <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Company Website</label>
                            <input
                                type="url"
                                name="company_website"
                                value={formData.company_website}
                                onChange={handleChange}
                                className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500
                                    ${isDark ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'}`}
                            />
                        </div>

                        <div>
                            <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Industry</label>
                            <input
                                type="text"
                                name="industry"
                                value={formData.industry}
                                onChange={handleChange}
                                className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500
                                    ${isDark ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'}`}
                                required
                            />
                        </div>

                        <div>
                            <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Company Size</label>
                            <select
                                name="company_size"
                                value={formData.company_size}
                                onChange={handleChange}
                                className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500
                                    ${isDark ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'}`}
                                required
                            >
                                <option value="1-10">1-10 employees</option>
                                <option value="11-50">11-50 employees</option>
                                <option value="51-200">51-200 employees</option>
                                <option value="201-500">201-500 employees</option>
                                <option value="501-1000">501-1000 employees</option>
                                <option value="1000+">1000+ employees</option>
                            </select>
                        </div>
                    </div>

                    <div className="mt-6">
                        <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Company Description</label>
                        <textarea
                            name="company_description"
                            value={formData.company_description}
                            onChange={handleChange}
                            rows={4}
                            className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500
                                ${isDark ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'}`}
                            required
                        />
                    </div>

                    <div className="mt-6 flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={() => window.history.back()}
                            className={`px-4 py-2 rounded-md ${isDark ? 'text-gray-300 bg-gray-700 hover:bg-gray-600' : 'text-gray-700 bg-gray-100 hover:bg-gray-200'}`}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50"
                        >
                            {loading ? 'Updating...' : 'Update Employer'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
} 