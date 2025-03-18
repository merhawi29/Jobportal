import React from 'react';
import { Head } from '@inertiajs/react';
import { JobApplication } from '@/types';
import { Pagination } from '@/types';

interface Props {
    applications: Pagination<JobApplication>;
}

export default function Index({ applications }: Props) {
    return (
        <>
            <Head title="Received Applications" />
            <div className="container py-5">
                <h1 className="mb-4">Received Applications</h1>
                <div className="card">
                    <div className="card-body">
                        <div className="table-responsive">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Job Title</th>
                                        <th>Applicant</th>
                                        <th>Applied Date</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {applications.data.map((application) => (
                                        <tr key={application.id}>
                                            <td>{application.job.title}</td>
                                            <td>{application.user.name}</td>
                                            <td>{new Date(application.created_at).toLocaleDateString()}</td>
                                            <td>
                                                <span className={`badge ${application.status === 'accepted' ? 'bg-success' : application.status === 'rejected' ? 'bg-danger' : 'bg-warning'}`}>
                                                    {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="btn-group">
                                                    <a href={`/applications/${application.id}`} className="btn btn-sm btn-primary">
                                                        <i className="fas fa-eye"></i>
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