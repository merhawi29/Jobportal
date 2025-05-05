import React, { useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import ModeratorLayout from '@/layouts/ModeratorLayout';
import { useTheme } from '@/contexts/ThemeContext';
import toast from 'react-hot-toast';

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
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    
    useEffect(() => {
        // Show a success message when analytics data loads
        if (stats) {
            toast.success('Analytics data loaded successfully');
        } else {
            toast.error('Failed to load analytics data');
        }
    }, [stats]);
    
    // Function to handle unbanning a user directly from analytics
    const handleUnbanUser = (userId: number) => {
        if (confirm('Are you sure you want to unban this user?')) {
            router.post(`/moderator/users/${userId}/unban`, {}, {
                onSuccess: () => {
                    toast.success('User unbanned successfully');
                    // Refresh the page to update stats
                    window.location.reload();
                },
                onError: () => {
                    toast.error('Failed to unban user');
                }
            });
        }
    };
    
    // Function to handle mass unban
    const handleMassUnban = () => {
        if (confirm('Are you sure you want to unban all banned users?')) {
            toast.loading('Processing unban request...');
            
            router.post('/moderator/users/mass-unban', {}, {
                onSuccess: () => {
                    toast.dismiss();
                    toast.success('All users have been unbanned successfully');
                    window.location.reload();
                },
                onError: () => {
                    toast.dismiss();
                    toast.error('Failed to unban users');
                }
            });
        }
    };
    
    // Function to simulate processing actions with feedback
    const handleDataRefresh = () => {
        toast.loading('Refreshing analytics data...');
        
        // Simulate network request
        setTimeout(() => {
            toast.dismiss();
            toast.success('Analytics data refreshed');
            window.location.reload();
        }, 1500);
    };
    
    return (
        <ModeratorLayout>
            <Head title="Analytics - Moderator Dashboard" />

            <div className={`container py-5 ${isDark ? 'text-white' : ''}`}>
                <div className="row mb-4">
                    <div className="col-12 d-flex justify-content-between align-items-center">
                        <div>
                            <h1 className={`h3 mb-2 ${isDark ? 'text-white' : ''}`}>Analytics Dashboard</h1>
                            <p className={`${isDark ? 'text-gray-300' : 'text-muted'}`}>Overview of platform statistics and trends</p>
                        </div>
                        <button 
                            onClick={handleDataRefresh} 
                            className="btn btn-primary"
                        >
                            <i className="fas fa-sync me-2"></i> Refresh Data
                        </button>
                    </div>
                </div>

                {/* Job Statistics */}
                <div className="row mb-4">
                    <div className="col-12">
                        <div className={`card ${isDark ? 'bg-gray-800 border-gray-700' : ''}`}>
                            <div className={`card-header ${isDark ? 'bg-gray-800 border-gray-700' : ''}`}>
                                <h5 className={`card-title mb-0 ${isDark ? 'text-white' : ''}`}>Job Statistics</h5>
                            </div>
                            <div className={`card-body ${isDark ? 'bg-gray-800' : ''}`}>
                                <div className="row">
                                    <div className="col-md-3">
                                        <div className="d-flex align-items-center mb-3">
                                            <div className="flex-shrink-0">
                                                <div className={`${isDark ? 'bg-blue-900' : 'bg-primary bg-opacity-10'} p-2 rounded`}>
                                                    <i className="fas fa-briefcase text-primary"></i>
                                                </div>
                                            </div>
                                            <div className="flex-grow-1 ms-3">
                                                <h6 className={`mb-0 ${isDark ? 'text-gray-300' : ''}`}>Total Jobs</h6>
                                                <h4 className={`mb-0 ${isDark ? 'text-white' : ''}`}>{stats?.jobStats?.total || 0}</h4>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="d-flex align-items-center mb-3">
                                            <div className="flex-shrink-0">
                                                <div className={`${isDark ? 'bg-green-900' : 'bg-success bg-opacity-10'} p-2 rounded`}>
                                                    <i className="fas fa-check-circle text-success"></i>
                                                </div>
                                            </div>
                                            <div className="flex-grow-1 ms-3">
                                                <h6 className={`mb-0 ${isDark ? 'text-gray-300' : ''}`}>Active Jobs</h6>
                                                <h4 className={`mb-0 ${isDark ? 'text-white' : ''}`}>{stats?.jobStats?.active || 0}</h4>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="d-flex align-items-center mb-3">
                                            <div className="flex-shrink-0">
                                                <div className={`${isDark ? 'bg-yellow-900' : 'bg-warning bg-opacity-10'} p-2 rounded`}>
                                                    <i className="fas fa-clock text-warning"></i>
                                                </div>
                                            </div>
                                            <div className="flex-grow-1 ms-3">
                                                <h6 className={`mb-0 ${isDark ? 'text-gray-300' : ''}`}>Pending Review</h6>
                                                <h4 className={`mb-0 ${isDark ? 'text-white' : ''}`}>{stats?.jobStats?.pending || 0}</h4>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="d-flex align-items-center mb-3">
                                            <div className="flex-shrink-0">
                                                <div className={`${isDark ? 'bg-red-900' : 'bg-danger bg-opacity-10'} p-2 rounded`}>
                                                    <i className="fas fa-times-circle text-danger"></i>
                                                </div>
                                            </div>
                                            <div className="flex-grow-1 ms-3">
                                                <h6 className={`mb-0 ${isDark ? 'text-gray-300' : ''}`}>Rejected</h6>
                                                <h4 className={`mb-0 ${isDark ? 'text-white' : ''}`}>{stats?.jobStats?.rejected || 0}</h4>
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
                        <div className={`card ${isDark ? 'bg-gray-800 border-gray-700' : ''}`}>
                            <div className={`card-header d-flex justify-content-between align-items-center ${isDark ? 'bg-gray-800 border-gray-700' : ''}`}>
                                <h5 className={`card-title mb-0 ${isDark ? 'text-white' : ''}`}>User Statistics</h5>
                                {stats?.userStats?.banned > 0 && (
                                    <a 
                                        href="/moderator/users?status=banned" 
                                        className="btn btn-sm btn-outline-success"
                                        onClick={() => toast.success('Navigating to banned users list')}
                                    >
                                        View Banned Users
                                    </a>
                                )}
                            </div>
                            <div className={`card-body ${isDark ? 'bg-gray-800' : ''}`}>
                                <div className="row">
                                    <div className="col-md-4">
                                        <div className="d-flex align-items-center mb-3">
                                            <div className="flex-shrink-0">
                                                <div className={`${isDark ? 'bg-blue-900' : 'bg-primary bg-opacity-10'} p-2 rounded`}>
                                                    <i className="fas fa-users text-primary"></i>
                                                </div>
                                            </div>
                                            <div className="flex-grow-1 ms-3">
                                                <h6 className={`mb-0 ${isDark ? 'text-gray-300' : ''}`}>Total Users</h6>
                                                <h4 className={`mb-0 ${isDark ? 'text-white' : ''}`}>{stats?.userStats?.total || 0}</h4>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="d-flex align-items-center mb-3">
                                            <div className="flex-shrink-0">
                                                <div className={`${isDark ? 'bg-green-900' : 'bg-success bg-opacity-10'} p-2 rounded`}>
                                                    <i className="fas fa-user-check text-success"></i>
                                                </div>
                                            </div>
                                            <div className="flex-grow-1 ms-3">
                                                <h6 className={`mb-0 ${isDark ? 'text-gray-300' : ''}`}>Active Users</h6>
                                                <h4 className={`mb-0 ${isDark ? 'text-white' : ''}`}>{stats?.userStats?.active || 0}</h4>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="d-flex align-items-center mb-3">
                                            <div className="flex-shrink-0">
                                                <div className={`${isDark ? 'bg-red-900' : 'bg-danger bg-opacity-10'} p-2 rounded`}>
                                                    <i className="fas fa-user-slash text-danger"></i>
                                                </div>
                                            </div>
                                            <div className="flex-grow-1 ms-3">
                                                <h6 className={`mb-0 ${isDark ? 'text-gray-300' : ''}`}>Banned Users</h6>
                                                <div className="d-flex align-items-center">
                                                    <h4 className={`mb-0 ${isDark ? 'text-white' : ''}`}>{stats?.userStats?.banned || 0}</h4>
                                                    {stats?.userStats?.banned > 0 && (
                                                        <button 
                                                            className="btn btn-sm btn-success ms-3"
                                                            onClick={handleMassUnban}
                                                            title="Unban all banned users"
                                                        >
                                                            <i className="fas fa-unlock me-1"></i> Unban All
                                                        </button>
                                                    )}
                                                </div>
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
                        <div className={`card ${isDark ? 'bg-gray-800 border-gray-700' : ''}`}>
                            <div className={`card-header d-flex justify-content-between align-items-center ${isDark ? 'bg-gray-800 border-gray-700' : ''}`}>
                                <h5 className={`card-title mb-0 ${isDark ? 'text-white' : ''}`}>Report Statistics</h5>
                                {stats?.reportStats?.pending > 0 && (
                                    <a 
                                        href="/moderator/reports?status=pending" 
                                        className="btn btn-sm btn-warning"
                                        onClick={() => toast.success('Navigating to pending reports')}
                                    >
                                        <i className="fas fa-exclamation-circle me-1"></i>
                                        View Pending Reports
                                    </a>
                                )}
                            </div>
                            <div className={`card-body ${isDark ? 'bg-gray-800' : ''}`}>
                                <div className="row">
                                    <div className="col-md-3">
                                        <div className="d-flex align-items-center mb-3">
                                            <div className="flex-shrink-0">
                                                <div className={`${isDark ? 'bg-blue-900' : 'bg-primary bg-opacity-10'} p-2 rounded`}>
                                                    <i className="fas fa-flag text-primary"></i>
                                                </div>
                                            </div>
                                            <div className="flex-grow-1 ms-3">
                                                <h6 className={`mb-0 ${isDark ? 'text-gray-300' : ''}`}>Total Reports</h6>
                                                <h4 className={`mb-0 ${isDark ? 'text-white' : ''}`}>{stats?.reportStats?.total || 0}</h4>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="d-flex align-items-center mb-3">
                                            <div className="flex-shrink-0">
                                                <div className={`${isDark ? 'bg-yellow-900' : 'bg-warning bg-opacity-10'} p-2 rounded`}>
                                                    <i className="fas fa-exclamation-circle text-warning"></i>
                                                </div>
                                            </div>
                                            <div className="flex-grow-1 ms-3">
                                                <h6 className={`mb-0 ${isDark ? 'text-gray-300' : ''}`}>Pending</h6>
                                                <h4 className={`mb-0 ${isDark ? 'text-white' : ''}`}>{stats?.reportStats?.pending || 0}</h4>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="d-flex align-items-center mb-3">
                                            <div className="flex-shrink-0">
                                                <div className={`${isDark ? 'bg-green-900' : 'bg-success bg-opacity-10'} p-2 rounded`}>
                                                    <i className="fas fa-check-circle text-success"></i>
                                                </div>
                                            </div>
                                            <div className="flex-grow-1 ms-3">
                                                <h6 className={`mb-0 ${isDark ? 'text-gray-300' : ''}`}>Resolved</h6>
                                                <h4 className={`mb-0 ${isDark ? 'text-white' : ''}`}>{stats?.reportStats?.resolved || 0}</h4>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="d-flex align-items-center mb-3">
                                            <div className="flex-shrink-0">
                                                <div className={`${isDark ? 'bg-gray-700' : 'bg-secondary bg-opacity-10'} p-2 rounded`}>
                                                    <i className="fas fa-ban text-secondary"></i>
                                                </div>
                                            </div>
                                            <div className="flex-grow-1 ms-3">
                                                <h6 className={`mb-0 ${isDark ? 'text-gray-300' : ''}`}>Dismissed</h6>
                                                <h4 className={`mb-0 ${isDark ? 'text-white' : ''}`}>{stats?.reportStats?.dismissed || 0}</h4>
                                            </div>
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
