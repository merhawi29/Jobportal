import React from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import { useTheme } from '@/contexts/ThemeContext';

interface Interview {
    id: number;
    scheduled_at: string;
    location: string;
    type: 'in_person' | 'video' | 'phone';
    status: 'pending' | 'accepted' | 'declined' | 'rescheduled';
    notes: string;
    job_application: {
        id: number;
        status: string;
        user: {
            name: string;
            email: string;
        };
        job: {
            title: string;
            company: string;
            user_id: number;
        };
    };
}

interface Props {
    interview: Interview;
}

export default function Show({ interview }: Props) {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const { auth } = usePage().props as any;
    const isEmployer = auth?.user?.id === interview.job_application.job.user_id;
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

    if (!interview) {
        return (
            <div className="container py-4">
                <div className="alert alert-danger">
                    Interview not found.
                </div>
            </div>
        );
    }

    const formatDateTime = (dateTime: string) => {
        return new Date(dateTime).toLocaleString();
    };

    const getStatusBadgeClass = (status: string) => {
        const classes: Record<string, string> = {
            pending: 'bg-warning text-dark',
            accepted: 'bg-success text-white',
            declined: 'bg-danger text-white',
            rescheduled: 'bg-info text-white'
        };
        return `badge ${classes[status] || 'bg-secondary'}`;
    };

    const getTypeIcon = (type: string) => {
        const icons: Record<string, string> = {
            in_person: 'fas fa-user',
            video: 'fas fa-video',
            phone: 'fas fa-phone'
        };
        return icons[type] || 'fas fa-calendar';
    };

    const handleDelete = () => {
        if (confirm('Are you sure you want to cancel this interview?')) {
            router.delete(route('interviews.destroy', interview.id), {
                onSuccess: () => {
                    // Will automatically redirect to the success location
                    // defined in the controller
                }
            });
        }
    };

    return (
        <>
            <Head title="Interview Details" />

            <div className="container py-4">
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <div className="card">
                            <div className="card-header d-flex justify-content-between align-items-center">
                                <h4 className="mb-0">Interview Details</h4>
                                <span className={getStatusBadgeClass(interview.status)}>
                                    {interview.status.charAt(0).toUpperCase() + interview.status.slice(1)}
                                </span>
                            </div>
                            <div className="card-body">
                                {/* Applicant Information */}
                                <div className="mb-4">
                                    <h5 className="card-title">Applicant Information</h5>
                                    <div className="card bg-light">
                                        <div className="card-body">
                                            <p className="mb-1"><strong>Name:</strong> {interview.job_application.user.name}</p>
                                            <p className="mb-1"><strong>Email:</strong> {interview.job_application.user.email}</p>
                                            <p className="mb-0">
                                                <strong>Applied for:</strong> {interview.job_application.job.title} at {interview.job_application.job.company}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Interview Information */}
                                <div className="mb-4">
                                    <h5 className="card-title">Interview Information</h5>
                                    <div className="card bg-light">
                                        <div className="card-body">
                                            <div className="mb-3">
                                                <strong>Type:</strong>
                                                <div className="d-flex align-items-center mt-1">
                                                    <i className={`${getTypeIcon(interview.type)} me-2`}></i>
                                                    <span className="text-capitalize">
                                                        {interview.type.replace('_', ' ')}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="mb-3">
                                                <strong>Date & Time:</strong>
                                                <div className="mt-1">
                                                    {formatDateTime(interview.scheduled_at)}
                                                </div>
                                            </div>

                                            <div className="mb-3">
                                                <strong>
                                                    {interview.type === 'in_person' ? 'Location' : 'Meeting Link/Phone Number'}:
                                                </strong>
                                                <div className="mt-1">
                                                    {interview.location}
                                                </div>
                                            </div>

                                            {interview.notes && (
                                                <div>
                                                    <strong>Additional Notes:</strong>
                                                    <div className="mt-1">
                                                        {interview.notes}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="d-flex justify-content-between">
                                    <a 
                                        href={route('interviews.index')} 
                                        className="btn btn-outline-secondary"
                                    >
                                        <i className="fas fa-arrow-left me-2"></i>
                                        Back to Interviews
                                    </a>
                                    <div>
                                        <a 
                                            href={route('interviews.edit', interview.id)} 
                                            className="btn btn-primary me-2"
                                        >
                                            <i className="fas fa-edit me-2"></i>
                                            Edit Interview
                                        </a>
                                        <button 
                                            className="btn btn-danger"
                                            onClick={handleDelete}
                                        >
                                            <i className="fas fa-times me-2"></i>
                                            Cancel Interview
                                        </button>
                                    </div>
                                </div>

                                {/* Add test email button */}
                                {isEmployer && (
                                    <div className="mt-4 border-t pt-4">
                                        <h3 className={`font-medium text-lg mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                            Email Testing
                                        </h3>
                                        <p className={`text-sm mb-3 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                            Use this to test if emails are being sent correctly to the applicant.
                                        </p>
                                        <form action={route('interviews.test-email', interview.id)} method="POST">
                                            <input type="hidden" name="_token" value={csrfToken} />
                                            <button 
                                                type="submit"
                                                className={`inline-flex items-center px-4 py-2 border rounded-md font-semibold text-xs 
                                                    ${isDark 
                                                        ? 'bg-indigo-700 hover:bg-indigo-600 border-indigo-800 text-white' 
                                                        : 'bg-indigo-600 hover:bg-indigo-500 border-indigo-700 text-white'}`}
                                            >
                                                Send Test Email
                                            </button>
                                            <span className={`ml-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                                This will send a test email to {interview.job_application.user.email}
                                            </span>
                                        </form>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
} 