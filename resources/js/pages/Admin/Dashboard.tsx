import React, { useEffect } from 'react';
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
    Download,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';

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
    const { theme } = useTheme();
    const isDarkMode = theme === 'dark';
    
    if (error) return <React.Fragment><span className="text-red-500">{error}</span></React.Fragment>;
    if (!stats) return <React.Fragment><span>No data available</span></React.Fragment>;

    const downloadReport = (type: string) => {
        window.location.href = `/admin/reports/download?type=${type}`;
    };

    return (
        <AdminLayout>
            <Head title="Admin Dashboard "  />
            <div className={`p-6 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Dashboard Overview</h1>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button className="bg-green-400 hover:bg-green-600">
                                <Download className="mr-2 h-4 w-4" />
                                Download Report
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => downloadReport('all')}>
                                All Statistics
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => downloadReport('users')}>
                                User Statistics
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => downloadReport('jobs')}>
                                Job Statistics
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => downloadReport('verifications')}>
                                Verification Statistics
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className={`rounded-lg shadow p-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                                <Users className="w-6 h-6" />
                            </div>
                            <div className="ml-4">
                                <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Total Users</p>
                                <p className={`text-2xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{stats.total_users}</p>
                            </div>
                        </div>
                    </div>

                    <div className={`rounded-lg shadow p-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-green-100 text-green-600">
                                <Briefcase className="w-6 h-6" />
                            </div>
                            <div className="ml-4">
                                <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Active Jobs</p>
                                <p className={`text-2xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{stats.total_jobs}</p>
                            </div>
                        </div>
                    </div>

                    <div className={`rounded-lg shadow p-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                                <FileText className="w-6 h-6" />
                            </div>
                            <div className="ml-4">
                                <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Applications</p>
                                <p className={`text-2xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{stats.total_applications}</p>
                            </div>
                        </div>
                    </div>

                    <div className={`rounded-lg shadow p-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-orange-100 text-orange-600">
                                <Building2 className="w-6 h-6" />
                            </div>
                            <div className="ml-4">
                                <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Employers</p>
                                <p className={`text-2xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{stats.total_employers}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Pending Items */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className={`rounded-lg shadow p-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                        <h2 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Pending Verifications</h2>
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                                <CheckCircle2 className="w-6 h-6" />
                            </div>
                            <div className="ml-4">
                                <p className={`text-2xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{stats.pending_verifications}</p>
                                <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Employer verifications pending review</p>
                            </div>
                        </div>
                    </div>

                    <div className={`rounded-lg shadow p-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                        <h2 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Pending Jobs</h2>
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-red-100 text-red-600">
                                <AlertCircle className="w-6 h-6" />
                            </div>
                            <div className="ml-4">
                                <p className={`text-2xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{stats.pending_jobs}</p>
                                <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Job listings awaiting approval</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className={`rounded-lg shadow ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                    <div className="p-6">
                        <h2 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Recent Activity</h2>
                        <div className="space-y-4">
                            {stats.recent_activities.map((activity) => (
                                <div key={activity.id} className="flex items-start">
                                    <div className="p-2 rounded-full bg-gray-100 text-gray-600">
                                        <Clock className="w-4 h-4" />
                                    </div>
                                    <div className="ml-4">
                                        <p className={`text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{activity.description}</p>
                                        <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
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