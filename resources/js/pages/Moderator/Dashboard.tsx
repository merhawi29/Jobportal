import React from 'react';
import ModeratorLayout from '@/layouts/ModeratorLayout';
import { Head } from '@inertiajs/react';

interface DashboardStats {
    totalJobs: number;
    activeJobs: number;
    totalUsers: number;
    pendingReports: number;
}

interface Props {
    stats: DashboardStats;
}

export default function Dashboard({ stats }: Props) {
    return (
        <ModeratorLayout>
            <Head title="Moderator Dashboard" />

            <div className="container-fluid">
                <h2 className="mb-4">Dashboard Overview</h2>

                {/* Stats Cards */}
                <div className="row mb-4">
                    <div className="col-md-3">
                        <div className="card bg-primary text-white">
                            <div className="card-body">
                                <h5 className="card-title">Total Jobs</h5>
                                <h2 className="card-text">{stats.totalJobs}</h2>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card bg-success text-white">
                            <div className="card-body">
                                <h5 className="card-title">Active Jobs</h5>
                                <h2 className="card-text">{stats.activeJobs}</h2>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card bg-info text-white">
                            <div className="card-body">
                                <h5 className="card-title">Total Users</h5>
                                <h2 className="card-text">{stats.totalUsers}</h2>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card bg-warning text-white">
                            <div className="card-body">
                                <h5 className="card-title">Pending Reports</h5>
                                <h2 className="card-text">{stats.pendingReports}</h2>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="row mb-4">
                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-header">
                                <h5 className="card-title mb-0">Quick Actions</h5>
                            </div>
                            <div className="card-body">
                                <div className="d-grid gap-2">
                                    <a href="/moderator/jobs" className="btn btn-primary">
                                        <i className="fas fa-briefcase me-2"></i>
                                        Manage Jobs
                                    </a>
                                    <a href="/moderator/users" className="btn btn-info text-white">
                                        <i className="fas fa-users me-2"></i>
                                        Manage Users
                                    </a>
                                    <a href="/moderator/reports" className="btn btn-warning text-white">
                                        <i className="fas fa-flag me-2"></i>
                                        Handle Reports
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-header">
                                <h5 className="card-title mb-0">Recent Activity</h5>
                            </div>
                            <div className="card-body">
                                <div className="list-group list-group-flush">
                                    <div className="list-group-item">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div>
                                                <h6 className="mb-1">Job Review</h6>
                                                <small className="text-muted">Software Developer position</small>
                                            </div>
                                            <small className="text-muted">2 hours ago</small>
                                        </div>
                                    </div>
                                    <div className="list-group-item">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div>
                                                <h6 className="mb-1">User Report</h6>
                                                <small className="text-muted">Inappropriate content</small>
                                            </div>
                                            <small className="text-muted">5 hours ago</small>
                                        </div>
                                    </div>
                                    <div className="list-group-item">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div>
                                                <h6 className="mb-1">User Warning</h6>
                                                <small className="text-muted">Spam behavior</small>
                                            </div>
                                            <small className="text-muted">1 day ago</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ModeratorLayout>
    );
}
