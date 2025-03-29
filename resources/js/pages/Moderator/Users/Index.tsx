import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import ModeratorLayout from '@/layouts/ModeratorLayout';
import toast from 'react-hot-toast';

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
    return (
        <ModeratorLayout>
            <Head title="Manage Users" />

            <div className="container-fluid py-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="h4 mb-0">Manage Users</h2>
                    <div className="d-flex gap-2">
                        <select className="form-select" defaultValue="all">
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="banned">Banned</option>
                        </select>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search users..."
                        />
                    </div>
                </div>

                <div className="card">
                    <div className="card-body">
                        <div className="table-responsive">
                            <table className="table table-hover">
                                <thead>
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
                                        <tr key={user.id}>
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
                                                                onClick={() => handleWarn(user.id)}
                                                                className="btn btn-sm btn-warning"
                                                            >
                                                                <i className="fas fa-exclamation-triangle"></i>
                                                            </button>
                                                            <button
                                                                onClick={() => handleBan(user.id)}
                                                                className="btn btn-sm btn-danger"
                                                            >
                                                                <i className="fas fa-ban"></i>
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleUnban(user.id)}
                                                            className="btn btn-sm btn-success"
                                                        >
                                                            <i className="fas fa-check"></i>
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleDelete(user.id)}
                                                        className="btn btn-sm btn-danger"
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
                                            className="page-link"
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

function handleWarn(userId: number) {
    if (confirm('Are you sure you want to warn this user?')) {
        const reason = prompt('Please enter a warning reason:');
        if (reason) {
            router.post(`/moderator/users/${userId}/warn`, {
                reason: reason
            }, {
                onSuccess: () => {
                    toast.success('Warning sent successfully');
                },
                onError: () => {
                    toast.error('Failed to send warning');
                }
            });
        }
    }
}

function handleBan(userId: number) {
    if (confirm('Are you sure you want to ban this user?')) {
        const reason = prompt('Please enter a ban reason:');
        if (reason) {
            router.post(`/moderator/users/${userId}/ban`, {
                reason: reason
            }, {
                onSuccess: () => {
                    toast.success('User banned successfully');
                },
                onError: () => {
                    toast.error('Failed to ban user');
                }
            });
        }
    }
}

function handleUnban(userId: number) {
    if (confirm('Are you sure you want to unban this user?')) {
        router.post(`/moderator/users/${userId}/unban`, {}, {
            onSuccess: () => {
                toast.success('User unbanned successfully');
            },
            onError: () => {
                toast.error('Failed to unban user');
            }
        });
    }
}

function handleDelete(userId: number) {
    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
        router.delete(`/moderator/users/${userId}`, {
            onSuccess: () => {
                toast.success('User deleted successfully');
            },
            onError: () => {
                toast.error('Failed to delete user');
            }
        });
    }
}
