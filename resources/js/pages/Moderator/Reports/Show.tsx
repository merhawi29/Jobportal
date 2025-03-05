import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import ModeratorLayout from '@/layouts/ModeratorLayout';

interface Report {
    id: number;
    reporter: {
        id: number;
        name: string;
        email: string;
    };
    target: {
        id: number;
        name: string;
        type: string;
        details: any;
    };
    type: string;
    reason: string;
    description: string;
    status: string;
    created_at: string;
    resolution_notes?: string;
    dismissal_reason?: string;
}

interface Props {
    report: Report;
}

export default function Show({ report }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        notes: '',
        reason: ''
    });

    const handleResolve = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/moderator/reports/${report.id}/resolve`);
    };

    const handleDismiss = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/moderator/reports/${report.id}/dismiss`);
    };

    return (
        <ModeratorLayout>
            <Head title="View Report" />

            <div className="container-fluid py-4">
                <div className="row">
                    <div className="col-md-8">
                        <div className="card mb-4">
                            <div className="card-header d-flex justify-content-between align-items-center">
                                <h2 className="h4 mb-0">Report Details</h2>
                                <span className={`badge bg-${getStatusBadgeColor(report.status)}`}>
                                    {report.status}
                                </span>
                            </div>
                            <div className="card-body">
                                <div className="mb-4">
                                    <h5 className="mb-3">Report Information</h5>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <p><strong>Type:</strong> <span className={`badge bg-${getReportTypeBadgeColor(report.type)}`}>{report.type}</span></p>
                                            <p><strong>Reason:</strong> {report.reason}</p>
                                            <p><strong>Date:</strong> {new Date(report.created_at).toLocaleString()}</p>
                                        </div>
                                        <div className="col-md-6">
                                            <p><strong>Reporter:</strong> {report.reporter.name}</p>
                                            <p><strong>Reporter Email:</strong> {report.reporter.email}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <h5 className="mb-3">Description</h5>
                                    <p className="text-muted">{report.description}</p>
                                </div>

                                <div className="mb-4">
                                    <h5 className="mb-3">Target Information</h5>
                                    <div className="card bg-light">
                                        <div className="card-body">
                                            <p><strong>Type:</strong> {report.target.type}</p>
                                            <p><strong>Name:</strong> {report.target.name}</p>
                                            {report.target.details && (
                                                <div className="mt-3">
                                                    <h6>Additional Details:</h6>
                                                    <pre className="bg-white p-3 rounded">
                                                        {JSON.stringify(report.target.details, null, 2)}
                                                    </pre>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {report.status === 'resolved' && report.resolution_notes && (
                                    <div className="mb-4">
                                        <h5 className="mb-3">Resolution Notes</h5>
                                        <p className="text-muted">{report.resolution_notes}</p>
                                    </div>
                                )}

                                {report.status === 'dismissed' && report.dismissal_reason && (
                                    <div className="mb-4">
                                        <h5 className="mb-3">Dismissal Reason</h5>
                                        <p className="text-muted">{report.dismissal_reason}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4">
                        {report.status === 'pending' && (
                            <div className="card mb-4">
                                <div className="card-header">
                                    <h5 className="mb-0">Take Action</h5>
                                </div>
                                <div className="card-body">
                                    <form onSubmit={handleResolve} className="mb-4">
                                        <div className="mb-3">
                                            <label className="form-label">Resolution Notes</label>
                                            <textarea
                                                className="form-control"
                                                rows={3}
                                                value={data.notes}
                                                onChange={e => setData('notes', e.target.value)}
                                                disabled={processing}
                                            />
                                            {errors.notes && (
                                                <div className="text-danger">{errors.notes}</div>
                                            )}
                                        </div>
                                        <button
                                            type="submit"
                                            className="btn btn-success w-100"
                                            disabled={processing}
                                        >
                                            Resolve Report
                                        </button>
                                    </form>

                                    <form onSubmit={handleDismiss}>
                                        <div className="mb-3">
                                            <label className="form-label">Dismissal Reason</label>
                                            <textarea
                                                className="form-control"
                                                rows={3}
                                                value={data.reason}
                                                onChange={e => setData('reason', e.target.value)}
                                                disabled={processing}
                                            />
                                            {errors.reason && (
                                                <div className="text-danger">{errors.reason}</div>
                                            )}
                                        </div>
                                        <button
                                            type="submit"
                                            className="btn btn-danger w-100"
                                            disabled={processing}
                                        >
                                            Dismiss Report
                                        </button>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </ModeratorLayout>
    );
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
