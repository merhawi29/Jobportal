import React, { useState } from 'react';
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
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className={`d-flex ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
            {/* Sidebar */}
            <div 
                className={`${isDark ? 'bg-gray-800 text-white' : 'bg-dark text-white'} transition-width duration-300`} 
                style={{ 
                    width: isSidebarOpen ? '250px' : '60px', 
                    minHeight: '100vh',
                    overflow: 'hidden',
                    transition: 'width 0.3s ease'
                }}
            >
                <div className="p-3">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        {isSidebarOpen && <h5 className="mb-0">Moderator Panel</h5>}
                        <div className="d-flex">
                            <button 
                                onClick={toggleSidebar} 
                                className="p-2 rounded me-2"
                                title={isSidebarOpen ? "Close Sidebar" : "Open Sidebar"}
                            >
                                <i className={`fas ${isSidebarOpen ? 'fa-times' : 'fa-bars'}`}></i>
                            </button>
                            <button 
                                onClick={toggleTheme} 
                                className={`p-2 rounded-full ${isDark ? 'bg-gray-700 text-yellow-300' : 'bg-blue-100 text-blue-800'}`}
                                title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
                            >
                                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>
                    {isSidebarOpen && (
                        <div className="mb-4">
                            <small className={`${isDark ? 'text-gray-400' : 'text-muted'}`}>Welcome, {auth?.user?.name || 'Moderator'}</small>
                        </div>
                    )}
                    <ul className="nav flex-column">
                        <li className="nav-item">
                            <Link href="/" className={`nav-link ${isDark ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-white'}`}>
                                <i className="fas fa-home me-2"></i>
                                {isSidebarOpen && 'Back to Home'}
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link href="/moderator/dashboard" className={`nav-link ${isDark ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-white'}`}>
                                <i className="fas fa-tachometer-alt me-2"></i>
                                {isSidebarOpen && 'Dashboard'}
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link href="/moderator/jobs" className={`nav-link ${isDark ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-white'}`}>
                                <i className="fas fa-briefcase me-2"></i>
                                {isSidebarOpen && 'Manage Jobs'}
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link href="/moderator/users" className={`nav-link ${isDark ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-white'}`}>
                                <i className="fas fa-users me-2"></i>
                                {isSidebarOpen && 'Manage Users'}
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link href="/moderator/reports" className={`nav-link ${isDark ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-white'}`}>
                                <i className="fas fa-flag me-2"></i>
                                {isSidebarOpen && 'Reports'}
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link href="/moderator/analytics" className={`nav-link ${isDark ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-white'}`}>
                                <i className="fas fa-chart-bar me-2"></i>
                                {isSidebarOpen && 'Analytics'}
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link href="/moderator/logs" className={`nav-link ${isDark ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-white'}`}>
                                <i className="fas fa-history me-2"></i>
                                {isSidebarOpen && 'Activity Logs'}
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
                                {isSidebarOpen && 'Logout'}
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
