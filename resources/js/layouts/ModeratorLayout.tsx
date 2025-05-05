import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { useTheme } from '@/contexts/ThemeContext';
import { Moon, Sun } from 'lucide-react';

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
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <div className={`d-flex ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
            {/* Sidebar */}
            <div className={`${isDark ? 'bg-gray-800 text-white' : 'bg-dark text-white'}`} style={{ width: '250px', minHeight: '100vh' }}>
                <div className="p-3">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h5 className="mb-0">Moderator Panel</h5>
                        <button 
                            onClick={toggleTheme} 
                            className={`p-2 rounded-full ${isDark ? 'bg-gray-700 text-yellow-300' : 'bg-blue-100 text-blue-800'}`}
                            title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
                        >
                            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                        </button>
                    </div>
                    <div className="mb-4">
                        <small className={`${isDark ? 'text-gray-400' : 'text-muted'}`}>Welcome, {auth?.user?.name || 'Moderator'}</small>
                    </div>
                    <ul className="nav flex-column">
                        <li className="nav-item">
                            <Link href="/" className={`nav-link ${isDark ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-white'}`}>
                                <i className="fas fa-home me-2"></i>
                                Back to Home
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link href="/moderator/dashboard" className={`nav-link ${isDark ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-white'}`}>
                                <i className="fas fa-tachometer-alt me-2"></i>
                                Dashboard
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link href="/moderator/jobs" className={`nav-link ${isDark ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-white'}`}>
                                <i className="fas fa-briefcase me-2"></i>
                                Manage Jobs
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link href="/moderator/users" className={`nav-link ${isDark ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-white'}`}>
                                <i className="fas fa-users me-2"></i>
                                Manage Users
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link href="/moderator/reports" className={`nav-link ${isDark ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-white'}`}>
                                <i className="fas fa-flag me-2"></i>
                                Reports
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link href="/moderator/analytics" className={`nav-link ${isDark ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-white'}`}>
                                <i className="fas fa-chart-bar me-2"></i>
                                Analytics
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link href="/moderator/logs" className={`nav-link ${isDark ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-white'}`}>
                                <i className="fas fa-history me-2"></i>
                                Activity Logs
                            </Link>
                        </li>
                        <li className="nav-item mt-4">
                            <Link
                                className="nav-link text-danger d-flex align-items-center" 
                                href="/logout"
                                method="post"
                                as="button"
                            >
                                <i className="fas fa-sign-out-alt me-2"></i>
                                Logout
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Main Content */}
            <div className={`flex-grow-1 p-4 ${isDark ? 'bg-gray-900' : 'bg-gray-100'}`}>
                {children}
            </div>
        </div>
    );
}
