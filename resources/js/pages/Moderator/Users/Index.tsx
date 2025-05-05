import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import ModeratorLayout from '@/layouts/ModeratorLayout';
import toast from 'react-hot-toast';
import { useTheme } from '@/contexts/ThemeContext';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    status: string;
    created_at: string;
    last_login: string;
}

interface Props {
    users: {
        data: User[];
        current_page: number;
        last_page: number;
    };
}

export default function Index({ users }: Props) {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [isProcessing, setIsProcessing] = useState<number | null>(null);
    
    const handleUnban = (userId: number) => {
        if (confirm('Are you sure you want to unban this user?')) {
            setIsProcessing(userId);
            toast.loading('Processing unban request...');
            
            router.post(`/moderator/users/${userId}/unban`, {}, {
                onSuccess: () => {
                    toast.dismiss();
                    toast.success('User unbanned successfully');
                    setIsProcessing(null);
                },
                onError: () => {
                    toast.dismiss();
                    toast.error('Failed to unban user');
                    setIsProcessing(null);
                }
            });
        }
    };

    const handleBan = (userId: number) => {
        if (confirm('Are you sure you want to ban this user?')) {
            const reason = prompt('Please enter a ban reason:');
            if (reason) {
                setIsProcessing(userId);
                toast.loading('Banning user...');
                
                router.post(`/moderator/users/${userId}/ban`, {
                    reason: reason
                }, {
                    onSuccess: () => {
                        toast.dismiss();
                        toast.success('User banned successfully');
                        setIsProcessing(null);
                    },
                    onError: () => {
                        toast.dismiss();
                        toast.error('Failed to ban user');
                        setIsProcessing(null);
                    }
                });
            }
        }
    };

    const handleDelete = (userId: number) => {
        if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            setIsProcessing(userId);
            toast.loading('Deleting user...');
            
            router.delete(`/moderator/users/${userId}`, {
                onSuccess: () => {
                    toast.dismiss();
                    toast.success('User deleted successfully');
                    setIsProcessing(null);
                },
                onError: () => {
                    toast.dismiss();
                    toast.error('Failed to delete user');
                    setIsProcessing(null);
                }
            });
        }
    };
    
    return (
        <ModeratorLayout>
            <Head title="Manage Users" />

            <div className={`container-fluid py-4 ${isDark ? 'text-white' : ''}`}>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className={`h4 mb-0 ${isDark ? 'text-white' : ''}`}>Manage Users</h2>
                    <div className="d-flex gap-2">
                        <select className={`form-select ${isDark ? 'bg-gray-700 border-gray-600 text-white' : ''}`} defaultValue="all">
                            <option className={isDark ? 'text-white bg-gray-700' : ''} value="all">All Status</option>
                            <option className={isDark ? 'text-white bg-gray-700' : ''} value="active">Active</option>
                            <option className={isDark ? 'text-white bg-gray-700' : ''} value="banned">Banned</option>
                        </select>
                        <input
                            type="text"
                            className={`form-control ${isDark ? 'bg-gray-700 border-gray-600 text-white' : ''}`}
                            placeholder="Search users..."
                        />
                    </div>
                </div>

                <div className={`card ${isDark ? 'bg-gray-800 border-gray-700 text-white' : ''}`}>
                    <div className="card-body">
                        <div className="table-responsive">
                            <table className={`table table-hover ${isDark ? 'table-dark' : ''}`}>
                                <thead className={isDark ? 'text-white bg-gray-800' : ''}>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                        <th>Status</th>
                                        <th>Joined</th>
                                        <th>Last Login</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.data.map((user) => (
                                        <tr key={user.id} className={isDark ? 'text-white' : ''}>
                                            <td>{user.name}</td>
                                            <td>{user.email}</td>
                                            <td>
                                                <span className="badge bg-info">
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`badge bg-${user.status === 'active' ? 'success' : 'danger'}`}>
                                                    {user.status}
                                                </span>
                                            </td>
                                            <td>{new Date(user.created_at).toLocaleDateString()}</td>
                                            <td>{new Date(user.last_login).toLocaleDateString()}</td>
                                            <td>
                                                <div className="btn-group">
                                                    <Link
                                                        href={`/moderator/users/${user.id}/edit`}
                                                        className="btn btn-sm btn-primary"
                                                    >
                                                        <i className="fas fa-edit"></i>
                                                    </Link>
                                                    {user.status === 'active' ? (
                                                        <>
                                                            <button
                                                                onClick={() => handleBan(user.id)}
                                                                className="btn btn-sm btn-danger"
                                                                disabled={isProcessing === user.id}
                                                                title="Ban User"
                                                            >
                                                                <i className="fas fa-ban"></i>
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleUnban(user.id)}
                                                            className="btn btn-sm btn-success"
                                                            disabled={isProcessing === user.id}
                                                            title="Unban User"
                                                        >
                                                            <i className="fas fa-unlock"></i>
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleDelete(user.id)}
                                                        className="btn btn-sm btn-danger"
                                                        disabled={isProcessing === user.id}
                                                    >
                                                        <i className="fas fa-trash"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <nav className="mt-4">
                            <ul className="pagination justify-content-center">
                                {Array.from({ length: users.last_page }, (_, i) => i + 1).map((page) => (
                                    <li key={page} className={`page-item ${page === users.current_page ? 'active' : ''}`}>
                                        <Link
                                            href={`/moderator/users?page=${page}`}
                                            className={`page-link ${isDark ? 'bg-gray-700 text-white border-gray-600' : ''}`}
                                        >
                                            {page}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
        </ModeratorLayout>
    );
}
