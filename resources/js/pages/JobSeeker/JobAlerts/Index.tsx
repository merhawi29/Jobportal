import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { JobAlert } from '@/types';
import { Pagination } from '@/types';

interface Props {
    alerts: Pagination<JobAlert>;
}

export default function Index({ alerts }: Props) {
    const toggleAlert = (alertId: number, isActive: boolean) => {
        router.put(route('job-alerts.toggle', alertId), {
            is_active: !isActive
        });
    };

    const deleteAlert = (alertId: number) => {
        if (confirm('Are you sure you want to delete this alert?')) {
            router.delete(route('job-alerts.destroy', alertId));
        }
    };

    const formatKeywords = (keywords: string[] | undefined | null) => {
        if (!keywords || keywords.length === 0) return 'None';
        return keywords.join(', ');
    };

    return (
        <>
            <Head title="My Job Alerts" />
            <div className="container py-5">
                <div className="mb-4">
                    <Link href={route('home')} className="btn btn-outline-secondary btn-sm">
                        <i className="fas fa-arrow-left me-2"></i>
                        Back to Home
                    </Link>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h1 className="h2">My Job Alerts</h1>
                    <Link href={route('job-alerts.create')} className="btn btn-primary">
                        <i className="fas fa-plus me-2"></i>
                        Create New Alert
                    </Link>
                </div>

                {alerts.data.length === 0 ? (
                    <div className="card">
                        <div className="card-body text-center py-5">
                            <i className="fas fa-bell fa-3x text-muted mb-3"></i>
                            <h3 className="h4 mb-3">No Job Alerts Yet</h3>
                            <p className="text-muted mb-3">
                                Create job alerts to get notified when new jobs match your criteria.
                            </p>
                            <Link href={route('job-alerts.create')} className="btn btn-primary">
                                Create Your First Alert
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="card">
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table table-hover">
                                    <thead>
                                        <tr>
                                            <th>Alert Criteria</th>
                                            <th>Keywords</th>
                                            <th>Notification</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {alerts.data.map(alert => (
                                            <tr key={alert.id}>
                                                <td>
                                                    <div className="mb-1">
                                                        {alert.job_title && (
                                                            <span className="badge bg-primary me-2">
                                                                {alert.job_title}
                                                            </span>
                                                        )}
                                                        {alert.job_type && (
                                                            <span className="badge bg-info me-2">
                                                                {alert.job_type}
                                                            </span>
                                                        )}
                                                        {alert.location && (
                                                            <span className="badge bg-secondary">
                                                                {alert.location}
                                                            </span>
                                                        )}
                                                    </div>
                                                    {(alert.salary_min || alert.salary_max) && (
                                                        <small className="text-muted">
                                                            Salary: {alert.salary_min || 'Any'} - {alert.salary_max || 'Any'}
                                                        </small>
                                                    )}
                                                </td>
                                                <td>
                                                    <small>{formatKeywords(alert.keywords)}</small>
                                                </td>
                                                <td>
                                                    <div>
                                                        <span className="badge bg-success me-2">
                                                            {alert.notification_type}
                                                        </span>
                                                        <small className="text-muted d-block">
                                                            {alert.frequency}
                                                        </small>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="form-check form-switch">
                                                        <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                            checked={alert.is_active}
                                                            onChange={() => toggleAlert(alert.id, alert.is_active)}
                                                        />
                                                        <label className="form-check-label">
                                                            {alert.is_active ? 'Active' : 'Inactive'}
                                                        </label>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="btn-group">
                                                        <Link
                                                            href={route('job-alerts.edit', alert.id)}
                                                            className="btn btn-sm btn-warning"
                                                            title="Edit Alert"
                                                        >
                                                            <i className="fas fa-edit"></i>
                                                        </Link>
                                                        <button
                                                            onClick={() => deleteAlert(alert.id)}
                                                            className="btn btn-sm btn-danger"
                                                            title="Delete Alert"
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
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
