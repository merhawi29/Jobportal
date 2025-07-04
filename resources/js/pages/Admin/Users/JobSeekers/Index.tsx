import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import type { User } from '@/types/index';
import axios from 'axios';
import { useTheme } from '@/contexts/ThemeContext';

export default function JobSeekers() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [jobSeekers, setJobSeekers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchJobSeekers();
    }, []);

    const fetchJobSeekers = async () => {
        try {
            const response = await axios.get('/admin/users/api/job-seekers');
            setJobSeekers(response.data);
            setLoading(false);
        } catch (error) {
            setError('Failed to load job seekers');
            setLoading(false);
        }
    };

    const handleSuspend = async (userId: number) => {
        try {
            await axios.post(`/admin/users/job-seekers/${userId}/suspend`);
            fetchJobSeekers();
        } catch (error) {
            setError('Failed to suspend user');
        }
    };

    const handleActivate = async (userId: number) => {
        try {
            await axios.post(`/admin/users/job-seekers/${userId}/activate`);
            fetchJobSeekers();
        } catch (error) {
            setError('Failed to activate user');
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
            await axios.post(`/admin/users/job-seekers/${userId}/ban`, { 
                reason,
                duration: banDuration
            });
            fetchJobSeekers();
        } catch (error) {
            setError('Failed to ban user');
        }
    };

    const handleUnban = async (userId: number) => {
        try {
            await axios.post(`/admin/users/job-seekers/${userId}/unban`);
            fetchJobSeekers();
        } catch (error) {
            setError('Failed to unban user');
        }
    };

    const handleDelete = async (userId: number) => {
        if (!confirm('Are you sure you want to delete this user?')) return;
        
        try {
            await axios.delete(`/admin/users/job-seekers/${userId}`);
            fetchJobSeekers();
        } catch (error) {
            setError('Failed to delete user');
        }
    };

    const navigateToAddJobSeeker = () => {
        window.location.href = '/admin/users/job-seekers/create';
    };

    if (loading) return (
        <AdminLayout>
            <div className={`p-6 ${isDark ? 'text-white' : 'text-gray-800'}`}>Loading...</div>
        </AdminLayout>
    );
    
    if (error) return (
        <AdminLayout>
            <div className="text-red-500 p-6">{error}</div>
        </AdminLayout>
    );

    return (
        <AdminLayout>
            <Head title="Manage Job Seekers" />
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Manage Job Seekers</h1>
                    <button 
                        onClick={navigateToAddJobSeeker}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                        Add Job Seeker
                    </button>
                </div>
                
                <div className={`rounded-lg shadow overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className={`${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                            <tr>
                                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
                                    Name
                                </th>
                                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
                                    Email
                                </th>
                                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
                                    Status
                                </th>
                                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className={`${isDark ? 'bg-gray-800' : 'bg-white'} divide-y ${isDark ? 'divide-gray-700' : 'divide-gray-200'}`}>
                            {jobSeekers.map((user) => (
                                <tr key={user.id} className={isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                            {user.name}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
                                            {user.email}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            user.status === 'active' 
                                                ? isDark ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-800'
                                                : user.status === 'suspended' 
                                                    ? isDark ? 'bg-yellow-900 text-yellow-300' : 'bg-yellow-100 text-yellow-800'
                                                    : isDark ? 'bg-red-900 text-red-300' : 'bg-red-100 text-red-800'
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
                                            onClick={() => window.location.href = `/admin/users/job-seekers/${user.id}/edit`}
                                            className={`${isDark ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-900'} mr-6`}
                                        >
                                            Edit
                                        </button>
                                        {user.status === 'active' ? (
                                            <>
                                                <button
                                                    onClick={() => handleSuspend(user.id)}
                                                    className={`${isDark ? 'text-yellow-400 hover:text-yellow-300' : 'text-yellow-600 hover:text-yellow-900'} mr-6`}
                                                >
                                                    Suspend
                                                </button>
                                                <button
                                                    onClick={() => handleBan(user.id)}
                                                    className={`${isDark ? 'text-orange-400 hover:text-orange-300' : 'text-orange-600 hover:text-orange-900'} mr-6`}
                                                >
                                                    Ban
                                                </button>
                                            </>
                                        ) : user.status === 'suspended' ? (
                                            <button
                                                onClick={() => handleActivate(user.id)}
                                                className={`${isDark ? 'text-green-400 hover:text-green-300' : 'text-green-600 hover:text-green-900'} mr-6`}
                                            >
                                                Activate
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleUnban(user.id)}
                                                className={`${isDark ? 'text-green-400 hover:text-green-300' : 'text-green-600 hover:text-green-900'} mr-6`}
                                            >
                                                Unban
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleDelete(user.id)}
                                            className={`${isDark ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-900'}`}
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