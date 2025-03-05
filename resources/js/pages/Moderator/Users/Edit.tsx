import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import ModeratorLayout from '@/layouts/ModeratorLayout';

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
    user: User;
}

export default function Edit({ user }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/moderator/users/${user.id}`);
    };

    return (
        <ModeratorLayout>
            <Head title="Edit User" />

            <div className="container-fluid py-4">
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <div className="card">
                            <div className="card-header">
                                <h2 className="h4 mb-0">Edit User</h2>
                            </div>
                            <div className="card-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label className="form-label">Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={data.name}
                                            onChange={e => setData('name', e.target.value)}
                                            disabled={processing}
                                        />
                                        {errors.name && (
                                            <div className="text-danger">{errors.name}</div>
                                        )}
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Email</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            value={data.email}
                                            onChange={e => setData('email', e.target.value)}
                                            disabled={processing}
                                        />
                                        {errors.email && (
                                            <div className="text-danger">{errors.email}</div>
                                        )}
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Role</label>
                                        <select
                                            className="form-select"
                                            value={data.role}
                                            onChange={e => setData('role', e.target.value)}
                                            disabled={processing}
                                        >
                                            <option value="user">User</option>
                                            <option value="employer">Employer</option>
                                        </select>
                                        {errors.role && (
                                            <div className="text-danger">{errors.role}</div>
                                        )}
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Status</label>
                                        <select
                                            className="form-select"
                                            value={data.status}
                                            onChange={e => setData('status', e.target.value)}
                                            disabled={processing}
                                        >
                                            <option value="active">Active</option>
                                            <option value="banned">Banned</option>
                                        </select>
                                        {errors.status && (
                                            <div className="text-danger">{errors.status}</div>
                                        )}
                                    </div>

                                    <div className="d-flex justify-content-end gap-2">
                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            onClick={() => window.history.back()}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn btn-primary"
                                            disabled={processing}
                                        >
                                            Save Changes
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ModeratorLayout>
    );
}
