import React from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import type { ChartData } from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import 'chart.js/auto';

interface Stats {
    total_users: number;
    total_jobs: number;
    total_applications: number;
    total_employers: number;
    pending_verifications: number;
    pending_jobs: number;
    applications_trend: Record<string, number>;
    top_job_categories: Array<{ category: string; count: number }>;
    application_success_rate: number;
    verification_stats: {
        pending: number;
        verified: number;
        rejected: number;
    };
    user_growth: Record<string, number>;
    jobs_per_employer: number;
    applications_per_job: number;
    recent_activities: Array<{
        id: number;
        description: string;
        created_at: string;
    }>;
}

interface Props {
    stats: Stats | null;
    error?: string;
}

export default function Dashboard({ stats, error }: Props) {
    if (error) return <div className="text-red-500">{error}</div>;
    if (!stats) return <div>Loading...</div>;

    const applicationsTrendData = {
        labels: Object.keys(stats.applications_trend),
        datasets: [
            {
                label: 'Applications',
                data: Object.values(stats.applications_trend),
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1,
            },
        ],
    };

    const userGrowthData = {
        labels: Object.keys(stats.user_growth),
        datasets: [
            {
                label: 'New Users',
                data: Object.values(stats.user_growth),
                borderColor: 'rgb(54, 162, 235)',
                tension: 0.1,
            },
        ],
    };

    const topJobCategoriesData = {
        labels: stats.top_job_categories.map(item => item.category),
        datasets: [
            {
                label: 'Job Count',
                data: stats.top_job_categories.map(item => item.count),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(255, 206, 86, 0.5)',
                    'rgba(75, 192, 192, 0.5)',
                    'rgba(153, 102, 255, 0.5)',
                ],
            },
        ],
    };

    const verificationStatsData = {
        labels: ['Pending', 'Verified', 'Rejected'],
        datasets: [
            {
                data: [
                    stats.verification_stats.pending,
                    stats.verification_stats.verified,
                    stats.verification_stats.rejected,
                ],
                backgroundColor: [
                    'rgba(255, 206, 86, 0.5)',
                    'rgba(75, 192, 192, 0.5)',
                    'rgba(255, 99, 132, 0.5)',
                ],
            },
        ],
    };

    return (
        <AdminLayout>
            <Head title="Dashboard" />
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-lg font-semibold mb-4">User Statistics</h2>
                        <div className="space-y-2">
                            <p>Total Job Seekers: {stats.total_users}</p>
                            <p>Total Employers: {stats.total_employers}</p>
                            <p>Jobs per Employer: {stats.jobs_per_employer}</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-lg font-semibold mb-4">Job Statistics</h2>
                        <div className="space-y-2">
                            <p>Total Jobs: {stats.total_jobs}</p>
                            <p>Pending Jobs: {stats.pending_jobs}</p>
                            <p>Applications per Job: {stats.applications_per_job}</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-lg font-semibold mb-4">Application Statistics</h2>
                        <div className="space-y-2">
                            <p>Total Applications: {stats.total_applications}</p>
                            <p>Success Rate: {stats.application_success_rate}%</p>
                            <p>Pending Verifications: {stats.pending_verifications}</p>
                        </div>
                    </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-lg font-semibold mb-4">Application Trend (Last 7 Days)</h2>
                        <Line data={applicationsTrendData} />
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-lg font-semibold mb-4">User Growth (Last 30 Days)</h2>
                        <Line data={userGrowthData} />
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-lg font-semibold mb-4">Top Job Categories</h2>
                        <Bar data={topJobCategoriesData} />
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-lg font-semibold mb-4">Verification Statistics</h2>
                        <Doughnut data={verificationStatsData} />
                    </div>
                </div>

                {/* Recent Activities */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-semibold mb-4">Recent Activities</h2>
                    <div className="space-y-4">
                        {stats.recent_activities.map((activity) => (
                            <div key={activity.id} className="flex items-center justify-between">
                                <p className="text-sm text-gray-600">{activity.description}</p>
                                <span className="text-xs text-gray-500">
                                    {new Date(activity.created_at).toLocaleDateString()}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
} 