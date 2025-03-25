import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Job } from '@/types';
import { Pagination } from '@/types';

interface Props {
    jobs: Pagination<Job>;
}

export default function Index({ jobs }: Props) {
    return (
        <>
            <Head title="My Job Posts" />
            <div className="container bg-light border-bottom py-3">
            <div className="container mb-5">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-0">
                            <li className="breadcrumb-item">
                                <Link href="/" className="text-decoration-none">
                                    <i className="fas fa-home"></i> Home
                                </Link>
                            </li>
                            <li className="breadcrumb-item active">My Job Post</li>
                        </ol>
                    </nav>
                </div>      
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
                                                    <a href={`/jobs/${job.id}`} className="btn btn-sm btn-success">
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