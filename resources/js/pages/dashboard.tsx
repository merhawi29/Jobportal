import React from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import {
    Users,
    Briefcase,
    FileText,
    Building2,
    CheckCircle2,
    AlertCircle,
    Clock,
} from 'lucide-react';

interface DashboardStats {
    total_users: number;
    total_jobs: number;
    total_applications: number;
    total_employers: number;
    pending_verifications: number;
    pending_jobs: number;
    recent_activities: {
        id: number;
        description: string;
        created_at: string;
    }[];
}

interface Props {
    stats: DashboardStats | null;
    error?: string;
}

export default function AdminDashboard({ stats, error }: Props) {
    if (error) return <div className="text-red-500">{error}</div>;
    if (!stats) return <div>No data available</div>;

    return (
        <AdminLayout>
            <Head title="Admin Dashboard" />
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                                <Users className="w-6 h-6" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total Users</p>
                                <p className="text-2xl font-semibold text-gray-900">{stats.total_users}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-green-100 text-green-600">
                                <Briefcase className="w-6 h-6" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Active Jobs</p>
                                <p className="text-2xl font-semibold text-gray-900">{stats.total_jobs}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                                <FileText className="w-6 h-6" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Applications</p>
                                <p className="text-2xl font-semibold text-gray-900">{stats.total_applications}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-orange-100 text-orange-600">
                                <Building2 className="w-6 h-6" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Employers</p>
                                <p className="text-2xl font-semibold text-gray-900">{stats.total_employers}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Pending Items */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-lg font-semibold mb-4">Pending Verifications</h2>
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                                <CheckCircle2 className="w-6 h-6" />
                            </div>
                            <div className="ml-4">
                                <p className="text-2xl font-semibold text-gray-900">{stats.pending_verifications}</p>
                                <p className="text-sm text-gray-600">Employer verifications pending review</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-lg font-semibold mb-4">Pending Jobs</h2>
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-red-100 text-red-600">
                                <AlertCircle className="w-6 h-6" />
                            </div>
                            <div className="ml-4">
                                <p className="text-2xl font-semibold text-gray-900">{stats.pending_jobs}</p>
                                <p className="text-sm text-gray-600">Job listings awaiting approval</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-lg shadow">
                    <div className="p-6">
                        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
                        <div className="space-y-4">
                            {stats.recent_activities.map((activity) => (
                                <div key={activity.id} className="flex items-start">
                                    <div className="p-2 rounded-full bg-gray-100 text-gray-600">
                                        <Clock className="w-4 h-4" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm text-gray-900">{activity.description}</p>
                                        <p className="text-xs text-gray-500">
                                            {new Date(activity.created_at).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
} 