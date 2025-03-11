import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Job } from '@/types';

interface Props {
    savedJobs: {
        data: {
            id: number;
            job: Job;
            created_at: string;
        }[];
        current_page: number;
        last_page: number;
    };
}

export default function Index({ savedJobs }: Props) {
    const handleUnsave = (jobId: number) => {
        if (confirm('Are you sure you want to remove this job from your saved list?')) {
            router.delete(route('jobs.unsave', jobId));
        }
    };

    return (
        <div className="py-12">
            <Head title="Saved Jobs" />

            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div className="mb-6 flex justify-between items-center">
                    <h1 className="text-3xl font-bold">Saved Jobs</h1>
                    <Link href={route('jobs.index')} className="btn btn-outline-success">
                        <i className="fas fa-search me-2"></i>
                        Browse Jobs
                    </Link>
                </div>

                {savedJobs.data.length === 0 ? (
                    <div className="bg-white overflow-hidden shadow-sm rounded-lg p-6 text-center">
                        <p className="text-gray-500 mb-4">You haven't saved any jobs yet.</p>
                        <Link href={route('jobs.index')} className="btn btn-success">
                            Browse Available Jobs
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {savedJobs.data.map(({ job, created_at }) => (
                            <div key={job.id} className="bg-white overflow-hidden shadow-sm rounded-lg p-6">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <Link
                                            href={route('jobs.show', job.id)}
                                            className="text-xl font-semibold text-success hover:text-success-dark"
                                        >
                                            {job.title}
                                        </Link>
                                        <p className="text-gray-600 mt-1">{job.company}</p>
                                        <div className="flex gap-4 mt-2 text-gray-500">
                                            <span><i className="fas fa-map-marker-alt me-2"></i>{job.location}</span>
                                            <span><i className="fas fa-briefcase me-2"></i>{job.type}</span>
                                            <span><i className="fas fa-money-bill-alt me-2"></i>{job.salary_range}</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Link
                                            href={route('jobs.show', job.id)}
                                            className="btn btn-success"
                                        >
                                            Apply Now
                                        </Link>
                                        <button
                                            onClick={() => handleUnsave(job.id)}
                                            className="btn btn-outline-danger"
                                        >
                                            <i className="fas fa-heart-broken"></i>
                                        </button>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <p className="text-gray-600 line-clamp-2">{job.description}</p>
                                </div>
                                <div className="mt-4 text-sm text-gray-500">
                                    <span><i className="fas fa-clock me-2"></i>Saved on {new Date(created_at).toLocaleDateString()}</span>
                                    <span className="ms-4"><i className="fas fa-calendar-alt me-2"></i>Deadline: {new Date(job.deadline).toLocaleDateString()}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {savedJobs.last_page > 1 && (
                    <div className="mt-6 flex justify-center">
                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                            {Array.from({ length: savedJobs.last_page }, (_, i) => i + 1).map((page) => (
                                <Link
                                    key={page}
                                    href={route('saved-jobs.index', { page })}
                                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium
                                        ${page === savedJobs.current_page
                                            ? 'z-10 bg-success border-success text-white'
                                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                        }
                                        ${page === 1 ? 'rounded-l-md' : ''}
                                        ${page === savedJobs.last_page ? 'rounded-r-md' : ''}
                                    `}
                                >
                                    {page}
                                </Link>
                            ))}
                        </nav>
                    </div>
                )}
            </div>
        </div>
    );
}
