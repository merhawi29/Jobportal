import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import type { User } from '@/types/index';
import axios from 'axios';

export default function Employers() {
    const [employers, setEmployers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchEmployers();
    }, []);

    const fetchEmployers = async () => {
        try {
            const response = await axios.get('/admin/api/users/employers');
            setEmployers(response.data);
            setLoading(false);
        } catch (error) {
            setError('Failed to load employers');
            setLoading(false);
        }
    };

    const handleSuspend = async (userId: number) => {
        try {
            await axios.post(`/admin/api/users/employers/${userId}/suspend`);
            fetchEmployers();
        } catch (error) {
            setError('Failed to suspend employer');
        }
    };

    const handleActivate = async (userId: number) => {
        try {
            await axios.post(`/admin/api/users/employers/${userId}/activate`);
            fetchEmployers();
        } catch (error) {
            setError('Failed to activate employer');
        }
    };

    const handleDelete = async (userId: number) => {
        if (!confirm('Are you sure you want to delete this employer?')) return;
        
        try {
            await axios.delete(`/admin/api/users/employers/${userId}`);
            fetchEmployers();
        } catch (error) {
            setError('Failed to delete employer');
        }
    };

    const handleBan = async (userId: number) => {
        const reason = prompt('Please enter the ban reason:');
        if (!reason) return;

        const duration = prompt('Please enter ban duration in days (default: 30):');
        const banDuration = duration ? parseInt(duration) : 30;

        if (isNaN(banDuration) || banDuration <= 0) {
            alert('Please enter a valid number of days');
            return;
        }

        try {
            await axios.post(`/admin/users/employers/${userId}/ban`, { 
                reason,
                duration: banDuration
            });
            fetchEmployers();
        } catch (error) {
            setError('Failed to ban employer');
        }
    };

    const handleUnban = async (userId: number) => {
        try {
            await axios.post(`/admin/users/employers/${userId}/unban`);
            fetchEmployers();
        } catch (error) {
            setError('Failed to unban employer');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <AdminLayout>
            <Head title="Manage Employers" />
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-6">Manage Employers</h1>
                
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Company Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Email
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Industry
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {employers.map((user) => (
                                <tr key={user.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">
                                            {user.employer_profile?.company_name || 'Not Set'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-500">{user.email}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-500">
                                            {user.employer_profile?.industry || 'Not Set'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            user.status === 'active' 
                                                ? 'bg-green-100 text-green-800'
                                                : user.status === 'suspended' 
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : 'bg-red-100 text-red-800'
                                        }`}>
                                            {user.status}
                                            {user.banned_until && (
                                                <span className="ml-1 text-xs">
                                                    (until {new Date(user.banned_until).toLocaleDateString()})
                                                </span>
                                            )}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button
                                            onClick={() => window.location.href = `/admin/users/employers/${user.id}/edit`}
                                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                                        >
                                            Edit
                                        </button>
                                        {user.status === 'active' ? (
                                            <>
                                                <button
                                                    onClick={() => handleSuspend(user.id)}
                                                    className="text-yellow-600 hover:text-yellow-900 mr-4"
                                                >
                                                    Suspend
                                                </button>
                                                <button
                                                    onClick={() => handleBan(user.id)}
                                                    className="text-red-600 hover:text-red-900 mr-4"
                                                >
                                                    Ban
                                                </button>
                                            </>
                                        ) : user.status === 'suspended' ? (
                                            <button
                                                onClick={() => handleActivate(user.id)}
                                                className="text-green-600 hover:text-green-900 mr-4"
                                            >
                                                Activate
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleUnban(user.id)}
                                                className="text-green-600 hover:text-green-900 mr-4"
                                            >
                                                Unban
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleDelete(user.id)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
} 