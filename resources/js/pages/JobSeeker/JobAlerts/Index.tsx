import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';

interface JobAlert {
    id: number;
    title: string;
    keywords: string[];
    location: string | null;
    categories: number[];
    job_types: number[];
    min_salary: number | null;
    max_salary: number | null;
    frequency: 'daily' | 'weekly' | 'immediate';
    notification_method: 'email' | 'push' | 'both';
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

interface User {
    id: number;
    name: string;
    email: string;
    profile_picture?: string | null;
    role: string;
}

interface Props {
    auth: {
        user: User;
    };
    jobAlerts: JobAlert[];
    flash: { success?: string };
}

const JobAlertsIndex = ({ auth, jobAlerts, flash }: Props) => {
    const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

    const toggleStatus = (id: number) => {
        router.post(route('job-alerts.toggle-status', id));
    };

    const deleteAlert = (id: number) => {
        router.delete(route('job-alerts.destroy', id));
    };

    const formatFrequency = (frequency: string) => {
        switch (frequency) {
            case 'daily':
                return 'Daily';
            case 'weekly':
                return 'Weekly';
            case 'immediate':
                return 'Immediate';
            default:
                return frequency;
        }
    };

    const formatNotificationMethod = (method: string) => {
        switch (method) {
            case 'email':
                return 'Email';
            case 'push':
                return 'Push Notification';
            case 'both':
                return 'Email & Push';
            default:
                return method;
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Job Alerts</h2>}
        >
            <Head title="Job Alerts" />
            
            <div className="container py-5">
                <div className="row">
                    <div className="col-12">
                        {flash.success && (
                            <div className="alert alert-success alert-dismissible fade show" role="alert">
                                {flash.success}
                                <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                            </div>
                        )}
                        
                        <div className="card shadow-sm">
                            <div className="card-body">
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <h5 className="card-title mb-0">Your Job Alerts</h5>
                                    <Link 
                                        href={route('job-alerts.create')}
                                        className="btn btn-primary"
                                    >
                                        <i className="fas fa-plus me-1"></i> Create Alert
                                    </Link>
                                </div>
                                
                                {jobAlerts.length === 0 ? (
                                    <div className="text-center py-5">
                                        <i className="fas fa-bell fa-3x text-muted mb-3"></i>
                                        <h5>No Job Alerts Yet</h5>
                                        <p className="text-muted">Create job alerts to get notified when jobs matching your criteria are posted.</p>
                                        <Link 
                                            href={route('job-alerts.create')}
                                            className="btn btn-primary mt-3"
                                        >
                                            Create Your First Alert
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="table-responsive">
                                        <table className="table table-hover">
                                            <thead>
                                                <tr>
                                                    <th>Title</th>
                                                    <th>Criteria</th>
                                                    <th>Frequency</th>
                                                    <th>Notification Method</th>
                                                    <th>Status</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {jobAlerts.map((alert) => (
                                                    <tr key={alert.id}>
                                                        <td>{alert.title}</td>
                                                        <td>
                                                            <div className="small">
                                                                {alert.keywords && alert.keywords.length > 0 && (
                                                                    <div><strong>Keywords:</strong> {alert.keywords.join(', ')}</div>
                                                                )}
                                                                {alert.location && (
                                                                    <div><strong>Location:</strong> {alert.location}</div>
                                                                )}
                                                                {alert.min_salary && alert.max_salary && (
                                                                    <div><strong>Salary:</strong> ${alert.min_salary} - ${alert.max_salary}</div>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td>{formatFrequency(alert.frequency)}</td>
                                                        <td>{formatNotificationMethod(alert.notification_method)}</td>
                                                        <td>
                                                            <div className="form-check form-switch">
                                                                <input 
                                                                    className="form-check-input"
                                                                    type="checkbox"
                                                                    id={`status-switch-${alert.id}`}
                                                                    checked={alert.is_active}
                                                                    onChange={() => toggleStatus(alert.id)}
                                                                />
                                                                <label className="form-check-label" htmlFor={`status-switch-${alert.id}`}>
                                                                    {alert.is_active ? 'Active' : 'Paused'}
                                                                </label>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="d-flex">
                                                                <Link
                                                                    href={route('job-alerts.edit', alert.id)}
                                                                    className="btn btn-sm btn-outline-primary me-2"
                                                                    title="Edit"
                                                                >
                                                                    <i className="fas fa-edit"></i>
                                                                </Link>
                                                                {confirmDelete === alert.id ? (
                                                                    <>
                                                                        <button 
                                                                            className="btn btn-sm btn-danger me-1"
                                                                            onClick={() => deleteAlert(alert.id)}
                                                                            title="Confirm Delete"
                                                                        >
                                                                            <i className="fas fa-check"></i>
                                                                        </button>
                                                                        <button 
                                                                            className="btn btn-sm btn-secondary"
                                                                            onClick={() => setConfirmDelete(null)}
                                                                            title="Cancel"
                                                                        >
                                                                            <i className="fas fa-times"></i>
                                                                        </button>
                                                                    </>
                                                                ) : (
                                                                    <button 
                                                                        className="btn btn-sm btn-outline-danger"
                                                                        onClick={() => setConfirmDelete(alert.id)}
                                                                        title="Delete"
                                                                    >
                                                                        <i className="fas fa-trash"></i>
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                                
                                <div className="mt-4">
                                    <div className="alert alert-info">
                                        <h6><i className="fas fa-info-circle me-2"></i>About Job Alerts</h6>
                                        <p className="small mb-0">
                                            Job alerts notify you when new jobs matching your criteria are posted. You can set up multiple alerts with different criteria and notification preferences.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default JobAlertsIndex; 