import React from 'react';
import { Head, Link } from '@inertiajs/react';
import ModeratorLayout from '@/layouts/ModeratorLayout';
import { Activity } from '@/types';

interface Props {
    activity: Activity;
}

export default function Show({ activity }: Props) {
    return (
        <ModeratorLayout>
            <Head title="Activity Log Details" />

            <div className="container-fluid">
                <div className="row mb-4">
                    <div className="col">
                        <h2>Activity Log Details</h2>
                    </div>
                    <div className="col text-end">
                        <Link
                            href="/moderator/activity-logs"
                            className="btn btn-secondary"
                        >
                            Back to Logs
                        </Link>
                    </div>
                </div>

                <div className="card">
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-6">
                                <h5 className="card-title">Basic Information</h5>
                                <table className="table">
                                    <tbody>
                                        <tr>
                                            <th>Date</th>
                                            <td>{new Date(activity.created_at).toLocaleString()}</td>
                                        </tr>
                                        <tr>
                                            <th>User</th>
                                            <td>{activity.causer?.name || 'System'}</td>
                                        </tr>
                                        <tr>
                                            <th>Action</th>
                                            <td>
                                                <span className={`badge bg-${getEventBadgeColor(activity.event)}`}>
                                                    {activity.event}
                                                </span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>Description</th>
                                            <td>{activity.description}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div className="col-md-6">
                                <h5 className="card-title">Subject Information</h5>
                                {activity.subject ? (
                                    <table className="table">
                                        <tbody>
                                            <tr>
                                                <th>Type</th>
                                                <td>{activity.subject_type}</td>
                                            </tr>
                                            <tr>
                                                <th>ID</th>
                                                <td>{activity.subject_id}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                ) : (
                                    <p className="text-muted">No subject information available</p>
                                )}
                            </div>
                        </div>

                        {activity.properties && Object.keys(activity.properties).length > 0 && (
                            <div className="row mt-4">
                                <div className="col-12">
                                    <h5 className="card-title">Additional Properties</h5>
                                    <div className="table-responsive">
                                        <table className="table">
                                            <thead>
                                                <tr>
                                                    <th>Property</th>
                                                    <th>Value</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {Object.entries(activity.properties).map(([key, value]) => (
                                                    <tr key={key}>
                                                        <td>{key}</td>
                                                        <td>
                                                            {typeof value === 'object' ? (
                                                                <pre className="mb-0">
                                                                    {JSON.stringify(value, null, 2)}
                                                                </pre>
                                                            ) : (
                                                                value
                                                            )}
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
                </div>
            </div>
        </ModeratorLayout>
    );
}

function getEventBadgeColor(event: string | null): string {
    switch (event) {
        case 'created':
            return 'success';
        case 'updated':
            return 'info';
        case 'deleted':
            return 'danger';
        default:
            return 'secondary';
    }
}
