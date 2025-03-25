import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';

interface Props {
    application: {
        id: number;
        status: string;
        job: {
            title: string;
        };
        user: {
            name: string;
            email: string;
        };
    };
}

export default function Show({ application }: Props) {
    const [notificationForm, setNotificationForm] = useState({
        status: '',
        message: ''
    });

    const sendNotification = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(route('employer.applications.notify', application.id), notificationForm);
    };

    return (
        <div className="container bg-light border-bottom py-3">
        <div className="container mb-5">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb mb-0">
                        <li className="breadcrumb-item">
                            <Link href="/" className="text-decoration-none">
                                <i className="fas fa-home"></i> Home
                            </Link>
                        </li>
                        <li className="breadcrumb-item active">Send Notification to Applicant</li>
                    </ol>
                </nav>
            </div> 
            <div className="card mt-4">
                <div className="card-header">
                    <h3 className="h5 mb-0">Send Notification to Applicant</h3>
                </div>
                <div className="card-body">
                    <form onSubmit={sendNotification}>
                        <div className="mb-3">
                            <label className="form-label">Update Status</label>
                            <select 
                                className="form-select"
                                value={notificationForm.status}
                                onChange={e => setNotificationForm(prev => ({ 
                                    ...prev, 
                                    status: e.target.value 
                                }))}
                                required
                            >
                                <option value="">Select Status</option>
                                <option value="shortlisted">Shortlisted</option>
                                <option value="hired">Hired</option>
                                <option value="rejected">Rejected</option>
                            </select>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Message to Applicant</label>
                            <textarea
                                className="form-control"
                                rows={4}
                                value={notificationForm.message}
                                onChange={e => setNotificationForm(prev => ({ 
                                    ...prev, 
                                    message: e.target.value 
                                }))}
                                placeholder="Enter your message to the applicant..."
                                required
                            ></textarea>
                        </div>

                        <button type="submit" className="btn btn-primary">
                            Send Notification
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
} 