import React from 'react';
import { Head, Link } from '@inertiajs/react';
import ModeratorLayout from '@/layouts/ModeratorLayout';
import { Activity } from '@/types';

interface Props {
    logs: {
        data: Activity[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    filters: {
        log_name?: string;
        event?: string;
        search?: string;
    };
}

export default function Index({ logs, filters }: Props) {
    return (
        <ModeratorLayout>
            <Head title="Activity Logs" />

            <div className="container-fluid">
                <div className="row mb-4">
                    <div className="col">
                        <h2>Activity Logs</h2>
                    </div>
                </div>

                <div className="card">
                    <div className="card-body">
                        <div className="row mb-4">
                            <div className="col-md-4">
                                <div className="form-group">
                                    <label htmlFor="log_name">Log Name</label>
                                    <select
                                        id="log_name"
                                        className="form-control"
                                        value={filters.log_name || 'all'}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            window.location.href = `/moderator/activity-logs?log_name=${value}`;
                                        }}
                                    >
                                        <option value="all">All Logs</option>
                                        <option value="jobs">Jobs</option>
                                        <option value="users">Users</option>
                                        <option value="reports">Reports</option>
                                    </select>
                                </div>
                            </div>

                            <div className="col-md-4">
                                <div className="form-group">
                                    <label htmlFor="event">Event</label>
                                    <select
                                        id="event"
                                        className="form-control"
                                        value={filters.event || 'all'}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            window.location.href = `/moderator/activity-logs?event=${value}`;
                                        }}
                                    >
                                        <option value="all">All Events</option>
                                        <option value="created">Created</option>
                                        <option value="updated">Updated</option>
                                        <option value="deleted">Deleted</option>
                                    </select>
                                </div>
                            </div>

                            <div className="col-md-4">
                                <div className="form-group">
                                    <label htmlFor="search">Search</label>
                                    <input
                                        type="text"
                                        id="search"
                                        className="form-control"
                                        value={filters.search || ''}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            window.location.href = `/moderator/activity-logs?search=${value}`;
                                        }}
                                        placeholder="Search logs..."
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="table-responsive">
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>User</th>
                                        <th>Action</th>
                                        <th>Description</th>
                                        <th>Details</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {logs.data.map((log) => (
                                        <tr key={log.id}>
                                            <td>{new Date(log.created_at).toLocaleString()}</td>
                                            <td>{log.causer?.name || 'System'}</td>
                                            <td>
                                                <span className={`badge bg-${getEventBadgeColor(log.event)}`}>
                                                    {log.event}
                                                </span>
                                            </td>
                                            <td>{log.description}</td>
                                            <td>
                                                <Link
                                                    href={`/moderator/activity-logs/${log.id}`}
                                                    className="btn btn-sm btn-primary"
                                                >
                                                    View Details
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {logs.last_page > 1 && (
                            <nav className="mt-4">
                                <ul className="pagination justify-content-center">
                                    {Array.from({ length: logs.last_page }, (_, i) => i + 1).map((page) => (
                                        <li
                                            key={page}
                                            className={`page-item ${page === logs.current_page ? 'active' : ''}`}
                                        >
                                            <Link
                                                href={`/moderator/activity-logs?page=${page}`}
                                                className="page-link"
                                            >
                                                {page}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </nav>
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
