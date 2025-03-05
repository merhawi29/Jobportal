import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import ModeratorLayout from '@/layouts/ModeratorLayout';

interface Job {
    id: number;
    title: string;
    company: string;
    user: {
        name: string;
    };
    status: string;
    moderation_status: string;
    created_at: string;
    location: string;
    type: string;
}

interface Props {
    jobs: {
        data: Job[];
        current_page: number;
        last_page: number;
    };
    filters?: {
        status?: string;
        moderation_status?: string;
        search?: string;
    };
}

export default function Index({ jobs, filters = {} }: Props) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || 'all');
    const [moderationFilter, setModerationFilter] = useState(filters.moderation_status || 'all');

    const handleFilterChange = (type: string, value: string) => {
        const params = new URLSearchParams(window.location.search);
        params.set(type, value);
        router.get(`/moderator/jobs?${params.toString()}`);
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        handleFilterChange('search', searchTerm);
    };

    return (
        <ModeratorLayout>
            <Head title="Manage Jobs" />

            <div className="container-fluid py-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="h4 mb-0">Manage Jobs</h2>
                    <div className="d-flex gap-2">
                        <form onSubmit={handleSearch} className="d-flex gap-2">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search jobs..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <button type="submit" className="btn btn-primary">
                                <i className="fas fa-search"></i>
                            </button>
                        </form>
                    </div>
                </div>

                <div className="card mb-4">
                    <div className="card-body">
                        <div className="row g-3">
                            <div className="col-md-3">
                                <label className="form-label">Job Status</label>
                                <select
                                    className="form-select"
                                    value={statusFilter}
                                    onChange={(e) => handleFilterChange('status', e.target.value)}
                                >
                                    <option value="all">All Status</option>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                    <option value="closed">Closed</option>
                                </select>
                            </div>
                            <div className="col-md-3">
                                <label className="form-label">Moderation Status</label>
                                <select
                                    className="form-select"
                                    value={moderationFilter}
                                    onChange={(e) => handleFilterChange('moderation_status', e.target.value)}
                                >
                                    <option value="all">All Moderation</option>
                                    <option value="pending">Pending</option>
                                    <option value="approved">Approved</option>
                                    <option value="rejected">Rejected</option>
                                </select>
                            </div>
                            <div className="col-md-3">
                                <label className="form-label">Job Type</label>
                                <select
                                    className="form-select"
                                    onChange={(e) => handleFilterChange('type', e.target.value)}
                                >
                                    <option value="">All Types</option>
                                    <option value="full_time">Full Time</option>
                                    <option value="part_time">Part Time</option>
                                    <option value="contract">Contract</option>
                                    <option value="freelance">Freelance</option>
                                    <option value="internship">Internship</option>
                                </select>
                            </div>
                            <div className="col-md-3">
                                <label className="form-label">Sort By</label>
                                <select
                                    className="form-select"
                                    onChange={(e) => handleFilterChange('sort', e.target.value)}
                                >
                                    <option value="latest">Latest First</option>
                                    <option value="oldest">Oldest First</option>
                                    <option value="title">Title (A-Z)</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="card-body">
                        <div className="table-responsive">
                            <table className="table table-hover">
                                <thead>
                                    <tr>
                                        <th>Job Title</th>
                                        <th>Company</th>
                                        <th>Location</th>
                                        <th>Type</th>
                                        <th>Posted By</th>
                                        <th>Status</th>
                                        <th>Moderation</th>
                                        <th>Posted Date</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {jobs.data.map((job) => (
                                        <tr key={job.id}>
                                            <td>
                                                <Link href={`/moderator/jobs/${job.id}/edit`} className="text-decoration-none">
                                                    {job.title}
                                                </Link>
                                            </td>
                                            <td>{job.company}</td>
                                            <td>{job.location}</td>
                                            <td>
                                                <span className="badge bg-info">
                                                    {job.type}
                                                </span>
                                            </td>
                                            <td>{job.user.name}</td>
                                            <td>
                                                <span className={`badge bg-${getStatusBadgeColor(job.status)}`}>
                                                    {job.status}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`badge bg-${getModerationBadgeColor(job.moderation_status)}`}>
                                                    {job.moderation_status}
                                                </span>
                                            </td>
                                            <td>{new Date(job.created_at).toLocaleDateString()}</td>
                                            <td>
                                                <div className="btn-group">
                                                    <Link
                                                        href={`/moderator/jobs/${job.id}/edit`}
                                                        className="btn btn-sm btn-primary"
                                                        title="Edit Job"
                                                    >
                                                        <i className="fas fa-edit"></i>
                                                    </Link>
                                                    {job.moderation_status === 'pending' && (
                                                        <>
                                                            <button
                                                                onClick={() => handleApprove(job.id)}
                                                                className="btn btn-sm btn-success"
                                                                title="Approve Job"
                                                            >
                                                                <i className="fas fa-check"></i>
                                                            </button>
                                                            <button
                                                                onClick={() => handleReject(job.id)}
                                                                className="btn btn-sm btn-danger"
                                                                title="Reject Job"
                                                            >
                                                                <i className="fas fa-times"></i>
                                                            </button>
                                                        </>
                                                    )}
                                                    <button
                                                        onClick={() => handleDelete(job.id)}
                                                        className="btn btn-sm btn-danger"
                                                        title="Delete Job"
                                                    >
                                                        <i className="fas fa-trash"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <nav className="mt-4">
                            <ul className="pagination justify-content-center">
                                {Array.from({ length: jobs.last_page }, (_, i) => i + 1).map((page) => (
                                    <li key={page} className={`page-item ${page === jobs.current_page ? 'active' : ''}`}>
                                        <Link
                                            href={`/moderator/jobs?page=${page}`}
                                            className="page-link"
                                        >
                                            {page}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
        </ModeratorLayout>
    );
}

function getStatusBadgeColor(status: string): string {
    switch (status) {
        case 'active':
            return 'success';
        case 'inactive':
            return 'warning';
        case 'closed':
            return 'secondary';
        default:
            return 'info';
    }
}

function getModerationBadgeColor(status: string): string {
    switch (status) {
        case 'pending':
            return 'warning';
        case 'approved':
            return 'success';
        case 'rejected':
            return 'danger';
        default:
            return 'secondary';
    }
}

function handleApprove(jobId: number) {
    if (confirm('Are you sure you want to approve this job?')) {
        router.post(`/moderator/jobs/${jobId}/approve`);
    }
}

function handleReject(jobId: number) {
    const reason = prompt('Please provide a reason for rejection:');
    if (reason) {
        router.post(`/moderator/jobs/${jobId}/reject`, { reason });
    }
}

function handleDelete(jobId: number) {
    if (confirm('Are you sure you want to delete this job? This action cannot be undone.')) {
        router.delete(`/moderator/jobs/${jobId}`);
    }
}
