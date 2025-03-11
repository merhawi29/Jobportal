import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Job } from '@/types';

interface Application {
    id: number;
    job: Job;
    status: 'pending' | 'reviewed' | 'shortlisted' | 'rejected' | 'accepted';
    cover_letter: string;
    resume: string;
    created_at: string;
    reviewed_at: string | null;
    notes: string | null;
}

interface Props {
    application: Application;
}

export default function Show({ application }: Props) {
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

    const handleWithdraw = () => {
        if (confirm('Are you sure you want to withdraw this application? This action cannot be undone.')) {
            router.delete(route('applications.destroy', application.id));
        }
    };

    return (
        <div className="py-12">
            <Head title={`Application for ${application.job.title}`} />

            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div className="mb-6 flex justify-between items-center">
                    <Link href={route('applications.index')} className="btn btn-outline-success">
                        <i className="fas fa-arrow-left me-2"></i>
                        Back to Applications
                    </Link>
                    {application.status === 'pending' && (
                        <button onClick={handleWithdraw} className="btn btn-danger">
                            <i className="fas fa-times-circle me-2"></i>
                            Withdraw Application
                        </button>
                    )}
                </div>

                <div className="bg-white overflow-hidden shadow-sm rounded-lg">
                    {/* Job Details Section */}
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-2xl font-bold mb-2">{application.job.title}</h1>
                                <p className="text-success mb-2">{application.job.company}</p>
                                <div className="flex gap-4 text-gray-500">
                                    <span><i className="fas fa-map-marker-alt me-2"></i>{application.job.location}</span>
                                    <span><i className="fas fa-briefcase me-2"></i>{application.job.type}</span>
                                    <span><i className="fas fa-money-bill-alt me-2"></i>{application.job.salary_range}</span>
                                </div>
                            </div>
                            <span className={`badge ${getStatusBadgeClass(application.status)}`}>
                                {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                            </span>
                        </div>
                    </div>

                    {/* Application Details */}
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-xl font-semibold mb-4">Application Details</h2>
                        <div className="space-y-4">
                            <div>
                                <h3 className="font-semibold mb-2">Cover Letter</h3>
                                <div className="bg-light p-4 rounded">
                                    <p className="text-gray-600" style={{ whiteSpace: 'pre-line' }}>
                                        {application.cover_letter}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <h3 className="font-semibold mb-2">Resume</h3>
                                <a
                                    href={application.resume}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-outline-success"
                                >
                                    <i className="fas fa-file-pdf me-2"></i>
                                    View Resume
                                </a>
                            </div>

                            {application.notes && (
                                <div>
                                    <h3 className="font-semibold mb-2">Employer Notes</h3>
                                    <div className="bg-light p-4 rounded">
                                        <p className="text-gray-600">{application.notes}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="p-6">
                        <h2 className="text-xl font-semibold mb-4">Application Timeline</h2>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="w-8 h-8 rounded-full bg-success text-white flex items-center justify-center">
                                    <i className="fas fa-paper-plane"></i>
                                </div>
                                <div>
                                    <p className="font-semibold">Application Submitted</p>
                                    <p className="text-gray-500">{new Date(application.created_at).toLocaleString()}</p>
                                </div>
                            </div>

                            {application.reviewed_at && (
                                <div className="flex items-center gap-4">
                                    <div className="w-8 h-8 rounded-full bg-info text-white flex items-center justify-center">
                                        <i className="fas fa-eye"></i>
                                    </div>
                                    <div>
                                        <p className="font-semibold">Application Reviewed</p>
                                        <p className="text-gray-500">{new Date(application.reviewed_at).toLocaleString()}</p>
                                    </div>
                                </div>
                            )}

                            {application.status === 'shortlisted' && (
                                <div className="flex items-center gap-4">
                                    <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">
                                        <i className="fas fa-list-check"></i>
                                    </div>
                                    <div>
                                        <p className="font-semibold">Shortlisted</p>
                                        <p className="text-gray-500">Your application has been shortlisted</p>
                                    </div>
                                </div>
                            )}

                            {application.status === 'accepted' && (
                                <div className="flex items-center gap-4">
                                    <div className="w-8 h-8 rounded-full bg-success text-white flex items-center justify-center">
                                        <i className="fas fa-check"></i>
                                    </div>
                                    <div>
                                        <p className="font-semibold">Application Accepted</p>
                                        <p className="text-gray-500">Congratulations! Your application has been accepted</p>
                                    </div>
                                </div>
                            )}

                            {application.status === 'rejected' && (
                                <div className="flex items-center gap-4">
                                    <div className="w-8 h-8 rounded-full bg-danger text-white flex items-center justify-center">
                                        <i className="fas fa-times"></i>
                                    </div>
                                    <div>
                                        <p className="font-semibold">Application Rejected</p>
                                        <p className="text-gray-500">Unfortunately, your application was not successful</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
