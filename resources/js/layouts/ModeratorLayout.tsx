import React from 'react';
import { Link, usePage } from '@inertiajs/react';

interface Props {
    children: React.ReactNode;
    auth?: {
        user: {
            name: string;
        };
    };
    [key: string]: any;
}

export default function ModeratorLayout({ children }: Props) {
    const { auth } = usePage<Props>().props;

    return (
        <div className="d-flex">
            {/* Sidebar */}
            <div className="bg-dark text-white" style={{ width: '250px', minHeight: '100vh' }}>
                <div className="p-3">
                    <h5 className="mb-4">Moderator Panel</h5>
                    <div className="mb-4">
                        <small className="text-muted">Welcome, {auth?.user?.name || 'Moderator'}</small>
                    </div>
                    <ul className="nav flex-column">
                        <li className="nav-item">
                            <Link href="/moderator/dashboard" className="nav-link text-white">
                                <i className="fas fa-tachometer-alt me-2"></i>
                                Dashboard
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link href="/moderator/jobs" className="nav-link text-white">
                                <i className="fas fa-briefcase me-2"></i>
                                Manage Jobs
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link href="/moderator/users" className="nav-link text-white">
                                <i className="fas fa-users me-2"></i>
                                Manage Users
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link href="/moderator/reports" className="nav-link text-white">
                                <i className="fas fa-flag me-2"></i>
                                Reports
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link href="/moderator/analytics" className="nav-link text-white">
                                <i className="fas fa-chart-bar me-2"></i>
                                Analytics
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link href="/moderator/logs" className="nav-link text-white">
                                <i className="fas fa-history me-2"></i>
                                Activity Logs
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link href="/moderator/settings" className="nav-link text-white">
                                <i className="fas fa-cog me-2"></i>
                                Settings
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-grow-1 p-4">
                {children}
            </div>
        </div>
    );
}
