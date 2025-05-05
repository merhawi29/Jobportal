import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import type { Job } from '@/types/index';
import axios from 'axios';
import { useTheme } from '@/contexts/ThemeContext';

export default function Jobs() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            const response = await axios.get('/admin/api/jobs');
            setJobs(response.data);
            setLoading(false);
        } catch (error) {
            setError('Failed to load jobs');
            setLoading(false);
        }
    };

    const handleApprove = async (jobId: number) => {
        try {
            await axios.post(`/admin/jobs/${jobId}/approve`);
            fetchJobs();
        } catch (error) {
            console.error('Failed to approve job:', error);
        }
    };

    const handleReject = async (jobId: number) => {
        try {
            await axios.post(`/admin/jobs/${jobId}/reject`);
            fetchJobs();
        } catch (error) {
            console.error('Failed to reject job:', error);
        }
    };

    const handleDelete = async (jobId: number) => {
        if (!confirm('Are you sure you want to delete this job? This action cannot be undone.')) {
            return;
        }
        
        try {
            await axios.delete(`/admin/jobs/${jobId}`);
            fetchJobs();
        } catch (error) {
            console.error('Failed to delete job:', error);
        }
    };

    const handleEdit = async (jobId: number) => {
        // Navigate to edit page
        window.location.href = `/admin/jobs/${jobId}/edit`;
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
            <Head title="Job Management" />
            <div className="p-6">
                <h1 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>Job Management</h1>
                
                <div className={`rounded-lg shadow overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className={`${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                            <tr>
                                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
                                    Title
                                </th>
                                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
                                    Company
                                </th>
                                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
                                    Location
                                </th>
                                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
                                    Status
                                </th>
                                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
                                    Posted By
                                </th>
                                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className={`${isDark ? 'bg-gray-800' : 'bg-white'} divide-y ${isDark ? 'divide-gray-700' : 'divide-gray-200'}`}>
                            {jobs.map((job) => (
                                <tr key={job.id} className={isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                            {job.title}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
                                            {job.company}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
                                            {job.location}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            job.status === 'approved'
                                                ? isDark ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-800'
                                                : job.status === 'rejected'
                                                ? isDark ? 'bg-red-900 text-red-300' : 'bg-red-100 text-red-800'
                                                : isDark ? 'bg-yellow-900 text-yellow-300' : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {job.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
                                            {job.user.name}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                        {job.status === 'pending' && (
                                            <>
                                                <button
                                                    onClick={() => handleApprove(job.id)}
                                                    className={`${isDark ? 'text-green-400 hover:text-green-300' : 'text-green-600 hover:text-green-900'}`}
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => handleReject(job.id)}
                                                    className={`${isDark ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-900'}`}
                                                >
                                                    Reject
                                                </button>
                                            </>
                                        )}
                                        <button
                                            onClick={() => handleEdit(job.id)}
                                            className={`${isDark ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-900'}`}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(job.id)}
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