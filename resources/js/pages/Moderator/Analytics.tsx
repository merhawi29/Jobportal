import React from 'react';
import { Head } from '@inertiajs/react';

interface Props {
    stats: {
        jobStats: {
            total: number;
            active: number;
            pending: number;
            rejected: number;
        };
        userStats: {
            total: number;
            active: number;
            banned: number;
        };
        reportStats: {
            total: number;
            pending: number;
            resolved: number;
            dismissed: number;
        };
    };
}

export default function Analytics({ stats }: Props) {
    return (
        <>
            <Head title="Analytics - Moderator Dashboard" />

            <div className="container py-5">
                <div className="row mb-4">
                    <div className="col-12">
                        <h1 className="h3 mb-2">Analytics Dashboard</h1>
                        <p className="text-muted">Overview of platform statistics and trends</p>
                    </div>
                </div>

                {/* Job Statistics */}
                <div className="row mb-4">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-header">
                                <h5 className="card-title mb-0">Job Statistics</h5>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-3">
                                        <div className="d-flex align-items-center mb-3">
                                            <div className="flex-shrink-0">
                                                <div className="bg-primary bg-opacity-10 p-2 rounded">
                                                    <i className="fas fa-briefcase text-primary"></i>
                                                </div>
                                            </div>
                                            <div className="flex-grow-1 ms-3">
                                                <h6 className="mb-0">Total Jobs</h6>
                                                <h4 className="mb-0">{stats?.jobStats?.total || 0}</h4>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="d-flex align-items-center mb-3">
                                            <div className="flex-shrink-0">
                                                <div className="bg-success bg-opacity-10 p-2 rounded">
                                                    <i className="fas fa-check-circle text-success"></i>
                                                </div>
                                            </div>
                                            <div className="flex-grow-1 ms-3">
                                                <h6 className="mb-0">Active Jobs</h6>
                                                <h4 className="mb-0">{stats?.jobStats?.active || 0}</h4>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="d-flex align-items-center mb-3">
                                            <div className="flex-shrink-0">
                                                <div className="bg-warning bg-opacity-10 p-2 rounded">
                                                    <i className="fas fa-clock text-warning"></i>
                                                </div>
                                            </div>
                                            <div className="flex-grow-1 ms-3">
                                                <h6 className="mb-0">Pending Review</h6>
                                                <h4 className="mb-0">{stats?.jobStats?.pending || 0}</h4>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="d-flex align-items-center mb-3">
                                            <div className="flex-shrink-0">
                                                <div className="bg-danger bg-opacity-10 p-2 rounded">
                                                    <i className="fas fa-times-circle text-danger"></i>
                                                </div>
                                            </div>
                                            <div className="flex-grow-1 ms-3">
                                                <h6 className="mb-0">Rejected</h6>
                                                <h4 className="mb-0">{stats?.jobStats?.rejected || 0}</h4>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* User Statistics */}
                <div className="row mb-4">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-header">
                                <h5 className="card-title mb-0">User Statistics</h5>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-4">
                                        <div className="d-flex align-items-center mb-3">
                                            <div className="flex-shrink-0">
                                                <div className="bg-primary bg-opacity-10 p-2 rounded">
                                                    <i className="fas fa-users text-primary"></i>
                                                </div>
                                            </div>
                                            <div className="flex-grow-1 ms-3">
                                                <h6 className="mb-0">Total Users</h6>
                                                <h4 className="mb-0">{stats?.userStats?.total || 0}</h4>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="d-flex align-items-center mb-3">
                                            <div className="flex-shrink-0">
                                                <div className="bg-success bg-opacity-10 p-2 rounded">
                                                    <i className="fas fa-user-check text-success"></i>
                                                </div>
                                            </div>
                                            <div className="flex-grow-1 ms-3">
                                                <h6 className="mb-0">Active Users</h6>
                                                <h4 className="mb-0">{stats?.userStats?.active || 0}</h4>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="d-flex align-items-center mb-3">
                                            <div className="flex-shrink-0">
                                                <div className="bg-danger bg-opacity-10 p-2 rounded">
                                                    <i className="fas fa-user-slash text-danger"></i>
                                                </div>
                                            </div>
                                            <div className="flex-grow-1 ms-3">
                                                <h6 className="mb-0">Banned Users</h6>
                                                <h4 className="mb-0">{stats?.userStats?.banned || 0}</h4>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Report Statistics */}
                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-header">
                                <h5 className="card-title mb-0">Report Statistics</h5>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-3">
                                        <div className="d-flex align-items-center mb-3">
                                            <div className="flex-shrink-0">
                                                <div className="bg-primary bg-opacity-10 p-2 rounded">
                                                    <i className="fas fa-flag text-primary"></i>
                                                </div>
                                            </div>
                                            <div className="flex-grow-1 ms-3">
                                                <h6 className="mb-0">Total Reports</h6>
                                                <h4 className="mb-0">{stats?.reportStats?.total || 0}</h4>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="d-flex align-items-center mb-3">
                                            <div className="flex-shrink-0">
                                                <div className="bg-warning bg-opacity-10 p-2 rounded">
                                                    <i className="fas fa-exclamation-circle text-warning"></i>
                                                </div>
                                            </div>
                                            <div className="flex-grow-1 ms-3">
                                                <h6 className="mb-0">Pending</h6>
                                                <h4 className="mb-0">{stats?.reportStats?.pending || 0}</h4>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="d-flex align-items-center mb-3">
                                            <div className="flex-shrink-0">
                                                <div className="bg-success bg-opacity-10 p-2 rounded">
                                                    <i className="fas fa-check-circle text-success"></i>
                                                </div>
                                            </div>
                                            <div className="flex-grow-1 ms-3">
                                                <h6 className="mb-0">Resolved</h6>
                                                <h4 className="mb-0">{stats?.reportStats?.resolved || 0}</h4>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="d-flex align-items-center mb-3">
                                            <div className="flex-shrink-0">
                                                <div className="bg-secondary bg-opacity-10 p-2 rounded">
                                                    <i className="fas fa-ban text-secondary"></i>
                                                </div>
                                            </div>
                                            <div className="flex-grow-1 ms-3">
                                                <h6 className="mb-0">Dismissed</h6>
                                                <h4 className="mb-0">{stats?.reportStats?.dismissed || 0}</h4>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
