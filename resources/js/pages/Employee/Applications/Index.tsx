import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { JobApplication } from '@/types';
import { Pagination } from '@/types';

interface Props {
    applications: Pagination<JobApplication>;
}

export default function Index({ applications }: Props) {
    const [showInterviewModal, setShowInterviewModal] = useState(false);
    const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null);
    const [interviewData, setInterviewData] = useState({
        date: '',
        notes: ''
    });

    const updateStatus = (applicationId: number, status: JobApplication['status']) => {
        if (confirm(`Are you sure you want to mark this application as ${status.replace('_', ' ')}?`)) {
            router.put(route('employer.applications.update-status', applicationId), {
                status: status
            });
        }
    };

    const scheduleInterview = (application: JobApplication) => {
        setSelectedApplication(application);
        setShowInterviewModal(true);
    };

    const handleInterviewSubmit = () => {
        if (!selectedApplication) return;

        router.post(route('employer.applications.schedule-interview', selectedApplication.id), {
            ...interviewData,
            status: 'interview_scheduled'
        }, {
            onSuccess: () => {
                setShowInterviewModal(false);
                setSelectedApplication(null);
                setInterviewData({ date: '', notes: '' });
            }
        });
    };

    const getStatusBadgeClass = (status: JobApplication['status']) => {
        const classes = {
            pending: 'bg-secondary',
            under_review: 'bg-info',
            shortlisted: 'bg-warning',
            interview_scheduled: 'bg-primary',
            interviewed: 'bg-info',
            hired: 'bg-success',
            rejected: 'bg-danger'
        };
        return classes[status] || 'bg-secondary';
    };

    return (
        <>
            <Head title="Received Applications" />
            
            <div className="container bg-light border-bottom py-3">
            <div className="container mb-5">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-0">
                            <li className="breadcrumb-item">
                                <Link href="/" className="text-decoration-none">
                                    <i className="fas fa-home"></i> Home
                                </Link>
                            </li>
                            <li className="breadcrumb-item active">Received Applications</li>
                        </ol>
                    </nav>
                </div>
                <h1 className="md-4" >Received Applications</h1>
                <div className="card">
                    <div className="card-body">
                        <div className="table-responsive">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Job Title</th>
                                        <th>Applicant</th>
                                        <th>Applied Date</th>
                                        <th>Status</th>
                                        <th>Interview Date</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {applications.data.map((application) => (
                                        <tr key={application.id}>
                                            <td>{application.job.title}</td>
                                            <td>{application.user.name}</td>
                                            <td>{new Date(application.created_at).toLocaleDateString()}</td>
                                            <td>
                                                <span className={`badge ${getStatusBadgeClass(application.status)}`}>
                                                    {application.status.replace('_', ' ').charAt(0).toUpperCase() + 
                                                     application.status.replace('_', ' ').slice(1)}
                                                </span>
                                            </td>
                                            <td>
                                                {application.interview_date && 
                                                    new Date(application.interview_date).toLocaleDateString()}
                                            </td>
                                            <td>
                                                <div className="btn-group">
                                                    <Link 
                                                        href={route('employer.applications.show', application.id)} 
                                                        className="btn btn-sm btn-primary"
                                                        title="View Details"
                                                    >
                                                        <i className="fas fa-eye"></i>
                                                    </Link>
                                                    <button 
                                                        onClick={() => updateStatus(application.id, 'under_review')}
                                                        className="btn btn-sm btn-info"
                                                        title="Mark Under Review"
                                                        disabled={application.status === 'under_review'}
                                                    >
                                                        <i className="fas fa-search"></i>
                                                    </button>
                                                    <button 
                                                        onClick={() => scheduleInterview(application)}
                                                        className="btn btn-sm btn-primary"
                                                        title="Schedule Interview"
                                                        disabled={['hired', 'rejected'].includes(application.status)}
                                                    >
                                                        <i className="fas fa-calendar"></i>
                                                    </button>
                                                    <button 
                                                        onClick={() => updateStatus(application.id, 'hired')}
                                                        className="btn btn-sm btn-success"
                                                        title="Mark as Hired"
                                                        disabled={application.status === 'hired'}
                                                    >
                                                        <i className="fas fa-user-check"></i>
                                                    </button>
                                                    <button 
                                                        onClick={() => updateStatus(application.id, 'rejected')}
                                                        className="btn btn-sm btn-danger"
                                                        title="Reject"
                                                        disabled={application.status === 'rejected'}
                                                    >
                                                        <i className="fas fa-times"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Interview Scheduling Modal */}
            {showInterviewModal && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Schedule Interview</h5>
                                <button type="button" className="btn-close" onClick={() => setShowInterviewModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label className="form-label">Interview Date</label>
                                    <input
                                        type="datetime-local"
                                        className="form-control"
                                        value={interviewData.date}
                                        onChange={(e) => setInterviewData(prev => ({ ...prev, date: e.target.value }))}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Notes</label>
                                    <textarea
                                        className="form-control"
                                        value={interviewData.notes}
                                        onChange={(e) => setInterviewData(prev => ({ ...prev, notes: e.target.value }))}
                                        rows={3}
                                        placeholder="Enter interview details, location, or special instructions..."
                                    ></textarea>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowInterviewModal(false)}>
                                    Cancel
                                </button>
                                <button type="button" className="btn btn-primary" onClick={handleInterviewSubmit}>
                                    Schedule Interview
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
} 