import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';

interface Interview {
    id: number;
    scheduled_at: string;
    location: string;
    type: 'in_person' | 'video' | 'phone';
    status: 'pending' | 'accepted' | 'declined' | 'rescheduled';
    notes: string;
    job_application: {
        id: number;
        user: {
            name: string;
            email: string;
        };
        job: {
            title: string;
            company: string;
        };
    };
}

interface Props {
    interviews: {
        data: Interview[];
        current_page: number;
        last_page: number;
    };
}

export default function Index({ interviews }: Props) {
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

    return (
        <>
            <Head title="Interview Invitations" />
            <div className="container-fluid bg-light border-bottom py-3">
                <div className="container">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-0">
                            <li className="breadcrumb-item">
                                <Link href="/" className="text-decoration-none">
                                    <i className="fas fa-home"></i> Home
                                </Link>
                            </li>
                            <li className="breadcrumb-item active">Interview Invitations</li>
                        </ol>
                    </nav>
                </div>
            </div>
            <div className="container py-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h1 className="h3">Interview Invitations</h1>
                </div>

                <div className="card">
                    <div className="card-body">
                        <div className="table-responsive">
                            <table className="table table-hover">
                                <thead className="table-light">
                                    <tr>
                                        <th>Applicant</th>
                                        <th>Job</th>
                                        <th>Schedule</th>
                                        <th>Type</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {interviews.data.map((interview) => (
                                        <tr key={interview.id}>
                                            <td>
                                                <div>
                                                    <div className="fw-bold">
                                                        {interview.job_application.user?.name || 'N/A'}
                                                    </div>
                                                    <div className="text-muted small">
                                                        {interview.job_application.user?.email || 'No email provided'}
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div>
                                                    <div className="fw-bold">
                                                            {interview.job_application.job?.title}
                                                    </div>
                                                    <div className="text-muted small">
                                                        {interview.job_application.job?.company}
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div>
                                                    <div>{formatDateTime(interview.scheduled_at)}</div>
                                                    <div className="text-muted small">
                                                        {interview.location}
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    <i className={`${getTypeIcon(interview.type)} me-2`}></i>
                                                    <span className="text-capitalize">
                                                        {interview.type.replace('_', ' ')}
                                                    </span>
                                                </div>
                                            </td>
                                            <td>
                                                <span className={getStatusBadgeClass(interview.status)}>
                                                    {interview.status.charAt(0).toUpperCase() + interview.status.slice(1)}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="btn-group">
                                                    <a 
                                                        href={route('interviews.show', interview.id)}
                                                        className="btn btn-sm btn-outline-primary"
                                                    >
                                                        View
                                                    </a>
                                                    <a 
                                                        href={route('interviews.edit', interview.id)}
                                                        className="btn btn-sm btn-outline-secondary"
                                                    >
                                                        Edit
                                                    </a>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Pagination */}
                {interviews.last_page > 1 && (
                    <div className="d-flex justify-content-center mt-4">
                        <nav>
                            <ul className="pagination">
                                {Array.from({ length: interviews.last_page }, (_, i) => i + 1).map((page) => (
                                    <li 
                                        key={page} 
                                        className={`page-item ${page === interviews.current_page ? 'active' : ''}`}
                                    >
                                        <a
                                            className="page-link"
                                            href={route('interviews.index', { page })}
                                        >
                                            {page}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>
                )}
            </div>
        </>
    );
} 