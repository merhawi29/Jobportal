import React from 'react';
import { Head } from '@inertiajs/react';
import { Job } from '@/types';
import { Pagination } from '@/types';

interface Props {
    jobs: Pagination<Job>;
}

export default function Index({ jobs }: Props) {
    return (
        <>
            <Head title="My Job Posts" />
            <div className="container py-5">
                <h1 className="mb-4">My Job Posts</h1>
                <div className="card">
                    <div className="card-body">
                        <div className="table-responsive">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Title</th>
                                        <th>Posted Date</th>
                                        <th>Status</th>
                                        <th>Applications</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {jobs.data.map((job) => (
                                        <tr key={job.id}>
                                            <td>{job.title}</td>
                                            <td>{new Date(job.created_at).toLocaleDateString()}</td>
                                            <td>
                                                <span className={`badge ${job.status === 'approved' ? 'bg-success' : job.status === 'rejected' ? 'bg-danger' : 'bg-warning'}`}>
                                                    {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                                                </span>
                                            </td>
                                            <td>{job.applications_count || 0}</td>
                                            <td>
                                                <div className="btn-group">
                                                    <a href={`/jobs/${job.id}`} className="btn btn-sm btn-primary">
                                                        <i className="fas fa-eye"></i>
                                                    </a>
                                                    <a href={`/jobs/${job.id}/edit`} className="btn btn-sm btn-warning">
                                                        <i className="fas fa-edit"></i>
                                                    </a>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
} 