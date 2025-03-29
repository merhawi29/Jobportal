import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import FlashMessage from '@/components/FlashMessage';

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
        message: '',
        scheduleInterview: false,
        type: 'video',
        location: '',
        scheduled_at: ''
    });

    const sendNotification = (e: React.FormEvent) => {
        e.preventDefault();
        if (notificationForm.scheduleInterview) {
            router.post(route('employer.applications.schedule-interview', application.id), {
                type: notificationForm.type,
                location: notificationForm.location,
                scheduled_at: notificationForm.scheduled_at,
                message: notificationForm.message
            }, {
                onSuccess: () => {
                    router.visit(route('employer.applications.index'));
                }
            });
        } else {
            router.post(route('employer.applications.notify', application.id), {
                status: notificationForm.status,
                message: notificationForm.message
            }, {
                onSuccess: () => {
                    router.visit(route('employer.applications.index'));
                }
            });
        }
    };

    return (
        <div className="container bg-light border-bottom py-3">
            <FlashMessage />
            
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

            <div className="card">
                <div className="card-header">
                    <h3 className="h5 mb-0">Send Notification to Applicant</h3>
                </div>
                <div className="card-body">
                    <form onSubmit={sendNotification}>
                        <div className="mb-3">
                            <div className="form-check">
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="scheduleInterview"
                                    checked={notificationForm.scheduleInterview}
                                    onChange={e => setNotificationForm(prev => ({
                                        ...prev,
                                        scheduleInterview: e.target.checked
                                    }))}
                                />
                                <label className="form-check-label" htmlFor="scheduleInterview">
                                    Schedule Interview
                                </label>
                            </div>
                        </div>

                        {notificationForm.scheduleInterview ? (
                            <>
                                {/* Interview Type */}
                                <div className="mb-3">
                                    <label className="form-label">Interview Type</label>
                                    <select
                                        className="form-select"
                                        value={notificationForm.type}
                                        onChange={e => setNotificationForm(prev => ({
                                            ...prev,
                                            type: e.target.value
                                        }))}
                                        required
                                    >
                                        <option value="video">Video Call</option>
                                        <option value="phone">Phone Call</option>
                                        <option value="in_person">In Person</option>
                                    </select>
                                </div>

                                {/* Interview Date/Time */}
                                <div className="mb-3">
                                    <label className="form-label">Date and Time</label>
                                    <input
                                        type="datetime-local"
                                        className="form-control"
                                        value={notificationForm.scheduled_at}
                                        onChange={e => setNotificationForm(prev => ({
                                            ...prev,
                                            scheduled_at: e.target.value
                                        }))}
                                        min={new Date().toISOString().slice(0, 16)}
                                        required
                                    />
                                </div>

                                {/* Location/Link */}
                                <div className="mb-3">
                                    <label className="form-label">
                                        {notificationForm.type === 'in_person' ? 'Location' : 
                                         notificationForm.type === 'video' ? 'Meeting Link' : 'Phone Number'}
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={notificationForm.location}
                                        onChange={e => setNotificationForm(prev => ({
                                            ...prev,
                                            location: e.target.value
                                        }))}
                                        placeholder={
                                            notificationForm.type === 'in_person' ? 'Enter physical location' :
                                            notificationForm.type === 'video' ? 'Enter meeting link' :
                                            'Enter phone number'
                                        }
                                        required
                                    />
                                </div>
                            </>
                        ) : (
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
                                    <option value="pending">Pending Review</option>
                                    <option value="under_review">Under Review</option>
                                    <option value="interview_scheduled">Interview Scheduled</option>
                                    <option value="hired">Hired</option>
                                    <option value="rejected">Rejected</option>
                                </select>
                            </div>
                        )}

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
                            {notificationForm.scheduleInterview ? 'Schedule Interview' : 'Send Notification'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
} 