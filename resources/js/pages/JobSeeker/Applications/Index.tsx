import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Job } from '@/types';
import Pagination from '@/components/Pagination';

interface Application {
    id: number;
    job: Job;
    status: 'pending' | 'reviewed' | 'shortlisted' | 'rejected' | 'accepted';
    created_at: string;
    reviewed_at: string | null;
}

interface Props {
    applications: {
        data: Application[];
        links: any[];
    };
}

export default function Index({ applications }: Props) {
    const getStatusBadgeClass = (status: Application['status']) => {
        switch (status) {
            case 'accepted':
                return 'bg-success';
            case 'rejected':
                return 'bg-danger';
            case 'shortlisted':
                return 'bg-primary';
            case 'reviewed':
                return 'bg-info';
            default:
                return 'bg-warning';
        }
    };

    return (
        <div className="py-12">
            <Head title="My Applications" />

            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold">My Applications</h1>
                    <p className="text-gray-600">Track and manage your job applications</p>
                </div>

                <div className="bg-white overflow-hidden shadow-sm rounded-lg">
                    <div className="p-6">
                        {applications.data.length > 0 ? (
                            <div className="space-y-6">
                                {applications.data.map((application) => (
                                    <div
                                        key={application.id}
                                        className="border rounded-lg p-6 hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <Link
                                                    href={route('applications.show', application.id)}
                                                    className="text-xl font-semibold hover:text-success transition-colors"
                                                >
                                                    {application.job.title}
                                                </Link>
                                                <p className="text-success">{application.job.company}</p>
                                                <div className="flex gap-4 text-gray-500 mt-2">
                                                    <span>
                                                        <i className="fas fa-map-marker-alt me-2"></i>
                                                        {application.job.location}
                                                    </span>
                                                    <span>
                                                        <i className="fas fa-briefcase me-2"></i>
                                                        {application.job.type}
                                                    </span>
                                                    <span>
                                                        <i className="fas fa-calendar me-2"></i>
                                                        {new Date(application.created_at).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>
                                            <span className={`badge ${getStatusBadgeClass(application.status)}`}>
                                                {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                                            </span>
                                        </div>

                                        <div className="mt-4 flex items-center gap-4">
                                            <Link
                                                href={route('applications.show', application.id)}
                                                className="btn btn-outline-success btn-sm"
                                            >
                                                <i className="fas fa-eye me-2"></i>
                                                View Details
                                            </Link>
                                            {application.status === 'pending' && (
                                                <Link
                                                    href={route('applications.destroy', application.id)}
                                                    method="delete"
                                                    as="button"
                                                    className="btn btn-outline-danger btn-sm"
                                                >
                                                    <i className="fas fa-times-circle me-2"></i>
                                                    Withdraw
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="text-gray-400 mb-4">
                                    <i className="fas fa-file-alt text-6xl"></i>
                                </div>
                                <h3 className="text-xl font-semibold mb-2">No Applications Yet</h3>
                                <p className="text-gray-600 mb-4">
                                    You haven't applied to any jobs yet. Start your job search today!
                                </p>
                                <Link href={route('jobs.index')} className="btn btn-success">
                                    <i className="fas fa-search me-2"></i>
                                    Browse Jobs
                                </Link>
                            </div>
                        )}
                    </div>

                    {applications.data.length > 0 && (
                        <div className="px-6 py-4 border-t">
                            <Pagination links={applications.links} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

