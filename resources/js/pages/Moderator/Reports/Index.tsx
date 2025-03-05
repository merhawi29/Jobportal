import React from 'react';
import { Head, Link } from '@inertiajs/react';
import ModeratorLayout from '@/layouts/ModeratorLayout';

interface Report {
    id: number;
    reporter: {
        name: string;
    };
    target: {
        name: string;
        type: string;
    };
    type: string;
    reason: string;
    status: string;
    created_at: string;
}

interface Props {
    reports: {
        data: Report[];
        current_page: number;
        last_page: number;
    };
}

export default function Index({ reports }: Props) {
    return (
        <ModeratorLayout>
            <Head title="Manage Reports" />

            <div className="container-fluid py-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="h4 mb-0">Manage Reports</h2>
                    <div className="d-flex gap-2">
                        <select className="form-select" defaultValue="all">
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="resolved">Resolved</option>
                            <option value="dismissed">Dismissed</option>
                        </select>
                        <select className="form-select" defaultValue="all">
                            <option value="all">All Types</option>
                            <option value="spam">Spam</option>
                            <option value="inappropriate">Inappropriate</option>
                            <option value="harassment">Harassment</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                </div>

                <div className="card">
                    <div className="card-body">
                        <div className="table-responsive">
                            <table className="table table-hover">
                                <thead>
                                    <tr>
                                        <th>Reporter</th>
                                        <th>Target</th>
                                        <th>Type</th>
                                        <th>Reason</th>
                                        <th>Status</th>
                                        <th>Date</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reports.data.map((report) => (
                                        <tr key={report.id}>
                                            <td>{report.reporter.name}</td>
                                            <td>
                                                <span className="badge bg-info">
                                                    {report.target.type}
                                                </span>
                                                {' '}
                                                {report.target.name}
                                            </td>
                                            <td>
                                                <span className={`badge bg-${getReportTypeBadgeColor(report.type)}`}>
                                                    {report.type}
                                                </span>
                                            </td>
                                            <td>{report.reason}</td>
                                            <td>
                                                <span className={`badge bg-${getStatusBadgeColor(report.status)}`}>
                                                    {report.status}
                                                </span>
                                            </td>
                                            <td>{new Date(report.created_at).toLocaleDateString()}</td>
                                            <td>
                                                <div className="btn-group">
                                                    <Link
                                                        href={`/moderator/reports/${report.id}`}
                                                        className="btn btn-sm btn-primary"
                                                    >
                                                        <i className="fas fa-eye"></i>
                                                    </Link>
                                                    {report.status === 'pending' && (
                                                        <>
                                                            <button
                                                                onClick={() => handleResolve(report.id)}
                                                                className="btn btn-sm btn-success"
                                                            >
                                                                <i className="fas fa-check"></i>
                                                            </button>
                                                            <button
                                                                onClick={() => handleDismiss(report.id)}
                                                                className="btn btn-sm btn-danger"
                                                            >
                                                                <i className="fas fa-times"></i>
                                                            </button>
                                                        </>
                                                    )}
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
                                {Array.from({ length: reports.last_page }, (_, i) => i + 1).map((page) => (
                                    <li key={page} className={`page-item ${page === reports.current_page ? 'active' : ''}`}>
                                        <Link
                                            href={`/moderator/reports?page=${page}`}
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

function getReportTypeBadgeColor(type: string): string {
    switch (type) {
        case 'spam':
            return 'warning';
        case 'inappropriate':
            return 'danger';
        case 'harassment':
            return 'danger';
        default:
            return 'secondary';
    }
}

function getStatusBadgeColor(status: string): string {
    switch (status) {
        case 'pending':
            return 'warning';
        case 'resolved':
            return 'success';
        case 'dismissed':
            return 'secondary';
        default:
            return 'secondary';
    }
}

function handleResolve(reportId: number) {
    if (confirm('Are you sure you want to resolve this report?')) {
        // Handle resolve action
    }
}

function handleDismiss(reportId: number) {
    if (confirm('Are you sure you want to dismiss this report?')) {
        // Handle dismiss action
    }
}
