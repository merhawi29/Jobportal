import React from 'react';
import { Head, useForm } from '@inertiajs/react';

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
    interview: Interview;
}

export default function Edit({ interview }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        scheduled_at: interview.scheduled_at.slice(0, 16), // Format for datetime-local input
        location: interview.location,
        type: interview.type,
        notes: interview.notes || ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('interviews.update', interview.id));
    };

    return (
        <>
            <Head title="Edit Interview" />
            <div className="container-fluid bg-light border-bottom py-3">
                <div className="container">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-0">
                            <li className="breadcrumb-item">
                                <a href={route('interviews.index')} className="text-decoration-none">
                                    <i className="fas fa-calendar"></i> Interviews
                                </a>
                            </li>
                            <li className="breadcrumb-item active">Edit Interview</li>
                        </ol>
                    </nav>
                </div>
            </div>

            <div className="container py-4">
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <div className="card">
                            <div className="card-header">
                                <h1 className="h4 mb-0">Edit Interview</h1>
                            </div>
                            <div className="card-body">
                                <div className="alert alert-info">
                                    <strong>Applicant:</strong> {interview.job_application.user.name}<br />
                                    <strong>Position:</strong> {interview.job_application.job.title} at {interview.job_application.job.company}
                                </div>

                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label className="form-label">Interview Date and Time</label>
                                        <input
                                            type="datetime-local"
                                            className={`form-control ${errors.scheduled_at ? 'is-invalid' : ''}`}
                                            value={data.scheduled_at}
                                            onChange={e => setData('scheduled_at', e.target.value)}
                                        />
                                        {errors.scheduled_at && (
                                            <div className="invalid-feedback">{errors.scheduled_at}</div>
                                        )}
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Location</label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.location ? 'is-invalid' : ''}`}
                                            value={data.location}
                                            onChange={e => setData('location', e.target.value)}
                                            placeholder="Office address or video call link"
                                        />
                                        {errors.location && (
                                            <div className="invalid-feedback">{errors.location}</div>
                                        )}
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Interview Type</label>
                                        <select
                                            className={`form-select ${errors.type ? 'is-invalid' : ''}`}
                                            value={data.type}
                                            onChange={e => setData('type', e.target.value as Interview['type'])}
                                        >
                                            <option value="in_person">In Person</option>
                                            <option value="video">Video Call</option>
                                            <option value="phone">Phone Call</option>
                                        </select>
                                        {errors.type && (
                                            <div className="invalid-feedback">{errors.type}</div>
                                        )}
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Notes</label>
                                        <textarea
                                            className={`form-control ${errors.notes ? 'is-invalid' : ''}`}
                                            value={data.notes}
                                            onChange={e => setData('notes', e.target.value)}
                                            rows={3}
                                            placeholder="Additional information or instructions for the candidate"
                                        ></textarea>
                                        {errors.notes && (
                                            <div className="invalid-feedback">{errors.notes}</div>
                                        )}
                                    </div>

                                    <div className="d-flex justify-content-between">
                                        <a
                                            href={route('interviews.index')}
                                            className="btn btn-secondary"
                                        >
                                            Cancel
                                        </a>
                                        <button
                                            type="submit"
                                            className="btn btn-primary"
                                            disabled={processing}
                                        >
                                            {processing ? 'Saving...' : 'Save Changes'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
} 