import React from 'react';
import { Head, useForm } from '@inertiajs/react';

interface Props {
    jobApplication: {
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

export default function Create({ jobApplication }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        scheduled_at: '',
        location: '',
        type: 'video',
        notes: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('interviews.store', jobApplication.id));
    };

    return (
        <>
            <Head title="Schedule Interview" />

            <div className="container py-4">
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <div className="card">
                            <div className="card-header">
                                <h4 className="mb-0">Schedule Interview</h4>
                            </div>
                            <div className="card-body">
                                {/* Applicant Info */}
                                <div className="mb-4">
                                    <h5>Applicant Information</h5>
                                    <div className="text-muted">
                                        <p className="mb-1">{jobApplication.user.name}</p>
                                        <p className="mb-1">{jobApplication.user.email}</p>
                                        <p className="mb-0">
                                            Applied for: {jobApplication.job.title} at {jobApplication.job.company}
                                        </p>
                                    </div>
                                </div>

                                <hr className="my-4" />

                                {/* Interview Form */}
                                <form onSubmit={handleSubmit}>
                                    {/* Date and Time */}
                                    <div className="mb-3">
                                        <label htmlFor="scheduled_at" className="form-label">
                                            Date and Time
                                        </label>
                                        <input
                                            type="datetime-local"
                                            className={`form-control ${errors.scheduled_at ? 'is-invalid' : ''}`}
                                            id="scheduled_at"
                                            value={data.scheduled_at}
                                            onChange={e => setData('scheduled_at', e.target.value)}
                                            min={new Date().toISOString().slice(0, 16)}
                                        />
                                        {errors.scheduled_at && (
                                            <div className="invalid-feedback">{errors.scheduled_at}</div>
                                        )}
                                    </div>

                                    {/* Interview Type */}
                                    <div className="mb-3">
                                        <label htmlFor="type" className="form-label">
                                            Interview Type
                                        </label>
                                        <select
                                            className={`form-select ${errors.type ? 'is-invalid' : ''}`}
                                            id="type"
                                            value={data.type}
                                            onChange={e => setData('type', e.target.value)}
                                        >
                                            <option value="video">Video Call</option>
                                            <option value="phone">Phone Call</option>
                                            <option value="in_person">In Person</option>
                                        </select>
                                        {errors.type && (
                                            <div className="invalid-feedback">{errors.type}</div>
                                        )}
                                    </div>

                                    {/* Location */}
                                    <div className="mb-3">
                                        <label htmlFor="location" className="form-label">
                                            {data.type === 'in_person' ? 'Location' : 'Meeting Link/Phone Number'}
                                        </label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.location ? 'is-invalid' : ''}`}
                                            id="location"
                                            value={data.location}
                                            onChange={e => setData('location', e.target.value)}
                                            placeholder={data.type === 'in_person' 
                                                ? 'Enter physical location' 
                                                : data.type === 'video' 
                                                    ? 'Enter meeting link'
                                                    : 'Enter phone number'
                                            }
                                        />
                                        {errors.location && (
                                            <div className="invalid-feedback">{errors.location}</div>
                                        )}
                                    </div>

                                    {/* Notes */}
                                    <div className="mb-4">
                                        <label htmlFor="notes" className="form-label">
                                            Additional Notes
                                        </label>
                                        <textarea
                                            className={`form-control ${errors.notes ? 'is-invalid' : ''}`}
                                            id="notes"
                                            rows={4}
                                            value={data.notes}
                                            onChange={e => setData('notes', e.target.value)}
                                            placeholder="Enter any additional information or instructions for the candidate"
                                        />
                                        {errors.notes && (
                                            <div className="invalid-feedback">{errors.notes}</div>
                                        )}
                                    </div>

                                    {/* Submit Button */}
                                    <div className="d-flex justify-content-between">
                                        <a 
                                            href={route('applications.show', jobApplication.id)} 
                                            className="btn btn-outline-secondary"
                                        >
                                            Cancel
                                        </a>
                                        <button
                                            type="submit"
                                            className="btn btn-primary"
                                            disabled={processing}
                                        >
                                            {processing ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                    Scheduling...
                                                </>
                                            ) : (
                                                'Schedule Interview'
                                            )}
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