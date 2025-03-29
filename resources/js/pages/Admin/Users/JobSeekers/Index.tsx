import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import type { User } from '@/types/index';
import axios from 'axios';

export default function JobSeekers() {
    const [jobSeekers, setJobSeekers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchJobSeekers();
    }, []);

    const fetchJobSeekers = async () => {
        try {
            const response = await axios.get('/admin/api/users/job-seekers');
            setJobSeekers(response.data);
            setLoading(false);
        } catch (error) {
            setError('Failed to load job seekers');
            setLoading(false);
        }
    };

    const handleSuspend = async (userId: number) => {
        try {
            await axios.post(`/admin/api/users/job-seekers/${userId}/suspend`);
            fetchJobSeekers();
        } catch (error) {
            setError('Failed to suspend user');
        }
    };

    const handleActivate = async (userId: number) => {
        try {
            await axios.post(`/admin/api/users/job-seekers/${userId}/activate`);
            fetchJobSeekers();
        } catch (error) {
            setError('Failed to activate user');
        }
    };

    const handleDelete = async (userId: number) => {
        if (!confirm('Are you sure you want to delete this user?')) return;
        
        try {
            await axios.delete(`/admin/api/users/job-seekers/${userId}`);
            fetchJobSeekers();
        } catch (error) {
            setError('Failed to delete user');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <AdminLayout>
            <Head title="Manage Job Seekers" />
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-6">Manage Job Seekers</h1>
                
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Email
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
                            {jobSeekers.map((user) => (
                                <tr key={user.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-500">{user.email}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            user.status === 'active' 
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                        }`}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button
                                            onClick={() => window.location.href = `/admin/users/job-seekers/${user.id}/edit`}
                                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                                        >
                                            Edit
                                        </button>
                                        {user.status === 'active' ? (
                                            
                                            <button
                                                onClick={() => handleSuspend(user.id)}
                                                className="text-red-600 hover:text-red-900 mr-4"
                                            >
                                                Suspend
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleActivate(user.id)}
                                                className="text-green-600 hover:text-green-900 mr-4"
                                            >
                                                Activate
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