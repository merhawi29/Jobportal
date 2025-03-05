import React from 'react';
import { Head } from '@inertiajs/react';

interface ModeratorAction {
    id: number;
    moderator: {
        name: string;
    };
    action_type: string;
    target_type: string;
    action: string;
    reason: string;
    created_at: string;
    details: any;
}

interface Props {
    logs: ModeratorAction[];
}

export default function ActivityLogs({ logs }: Props) {
    const getActionBadgeColor = (actionType: string) => {
        switch (actionType) {
            case 'job_review':
                return 'bg-primary';
            case 'user_ban':
            case 'user_warning':
                return 'bg-danger';
            case 'report_resolve':
                return 'bg-success';
            case 'report_dismiss':
                return 'bg-secondary';
            default:
                return 'bg-info';
        }
    };

    const formatActionType = (type: string) => {
        return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };

    return (
        <>
            <Head title="Activity Logs - Moderator Dashboard" />

            <div className="container py-5">
                <div className="row mb-4">
                    <div className="col-12">
                        <h1 className="h3 mb-2">Activity Logs</h1>
                        <p className="text-muted">Track all moderator actions and changes</p>
                    </div>
                </div>

                <div className="card">
                    <div className="card-header">
                        <div className="row align-items-center">
                            <div className="col">
                                <h5 className="mb-0">Recent Activities</h5>
                            </div>
                            <div className="col-auto">
                                <div className="dropdown">
                                    <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                                        Filter
                                    </button>
                                    <ul className="dropdown-menu">
                                        <li><a className="dropdown-item" href="#">All Activities</a></li>
                                        <li><a className="dropdown-item" href="#">Job Reviews</a></li>
                                        <li><a className="dropdown-item" href="#">User Actions</a></li>
                                        <li><a className="dropdown-item" href="#">Reports</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card-body p-0">
                        <div className="table-responsive">
                            <table className="table table-hover mb-0">
                                <thead className="bg-light">
                                    <tr>
                                        <th>Moderator</th>
                                        <th>Action</th>
                                        <th>Target</th>
                                        <th>Reason</th>
                                        <th>Date</th>
                                        <th>Details</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {logs?.map((log) => (
                                        <tr key={log.id}>
                                            <td>{log.moderator.name}</td>
                                            <td>
                                                <span className={`badge ${getActionBadgeColor(log.action_type)}`}>
                                                    {formatActionType(log.action_type)}
                                                </span>
                                            </td>
                                            <td>
                                                <span className="text-capitalize">{log.target_type}</span>
                                            </td>
                                            <td>
                                                <span className="text-truncate d-inline-block" style={{ maxWidth: '200px' }}>
                                                    {log.reason || '-'}
                                                </span>
                                            </td>
                                            <td>{new Date(log.created_at).toLocaleString()}</td>
                                            <td>
                                                <button
                                                    className="btn btn-sm btn-outline-primary"
                                                    data-bs-toggle="tooltip"
                                                    title="View Details"
                                                >
                                                    <i className="fas fa-info-circle"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="card-footer">
                        <nav>
                            <ul className="pagination justify-content-center mb-0">
                                <li className="page-item disabled">
                                    <a className="page-link" href="#" tabIndex={-1}>Previous</a>
                                </li>
                                <li className="page-item active"><a className="page-link" href="#">1</a></li>
                                <li className="page-item"><a className="page-link" href="#">2</a></li>
                                <li className="page-item"><a className="page-link" href="#">3</a></li>
                                <li className="page-item">
                                    <a className="page-link" href="#">Next</a>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
        </>
    );
}
