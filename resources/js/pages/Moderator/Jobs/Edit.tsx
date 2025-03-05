import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import ModeratorLayout from '@/layouts/ModeratorLayout';

interface Job {
    id: number;
    title: string;
    company: string;
    location: string;
    type: string;
    salary_range: string;
    description: string;
    requirements: string;
    benefits: string;
    deadline: string;
    status: string;
    moderation_status: string;
    moderation_reason: string | null;
    user: {
        name: string;
    };
}

interface Props {
    job: Job;
}

export default function Edit({ job }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        title: job.title,
        company: job.company,
        location: job.location,
        type: job.type,
        salary_range: job.salary_range,
        description: job.description,
        requirements: job.requirements,
        benefits: job.benefits,
        deadline: job.deadline,
        status: job.status,
        moderation_status: job.moderation_status,
        moderation_reason: job.moderation_reason || ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/moderator/jobs/${job.id}`);
    };

    return (
        <ModeratorLayout>
            <Head title="Edit Job" />

            <div className="container-fluid py-4">
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <div className="card">
                            <div className="card-header">
                                <h2 className="h4 mb-0">Edit Job</h2>
                            </div>
                            <div className="card-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label className="form-label">Company</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={data.company}
                                            onChange={e => setData('company', e.target.value)}
                                            disabled={processing}
                                        />
                                        {errors.company && (
                                            <div className="text-danger">{errors.company}</div>
                                        )}
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Job Title</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={data.title}
                                            onChange={e => setData('title', e.target.value)}
                                            disabled={processing}
                                        />
                                        {errors.title && (
                                            <div className="text-danger">{errors.title}</div>
                                        )}
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Description</label>
                                        <textarea
                                            className="form-control"
                                            rows={4}
                                            value={data.description}
                                            onChange={e => setData('description', e.target.value)}
                                            disabled={processing}
                                        />
                                        {errors.description && (
                                            <div className="text-danger">{errors.description}</div>
                                        )}
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Requirements</label>
                                        <textarea
                                            className="form-control"
                                            rows={4}
                                            value={data.requirements}
                                            onChange={e => setData('requirements', e.target.value)}
                                            disabled={processing}
                                        />
                                        {errors.requirements && (
                                            <div className="text-danger">{errors.requirements}</div>
                                        )}
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Benefits</label>
                                        <textarea
                                            className="form-control"
                                            rows={4}
                                            value={data.benefits}
                                            onChange={e => setData('benefits', e.target.value)}
                                            disabled={processing}
                                        />
                                        {errors.benefits && (
                                            <div className="text-danger">{errors.benefits}</div>
                                        )}
                                    </div>

                                    <div className="row">
                                        <div className="col-md-4 mb-3">
                                            <label className="form-label">Location</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={data.location}
                                                onChange={e => setData('location', e.target.value)}
                                                disabled={processing}
                                            />
                                            {errors.location && (
                                                <div className="text-danger">{errors.location}</div>
                                            )}
                                        </div>

                                        <div className="col-md-4 mb-3">
                                            <label className="form-label">Salary Range</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={data.salary_range}
                                                onChange={e => setData('salary_range', e.target.value)}
                                                disabled={processing}
                                            />
                                            {errors.salary_range && (
                                                <div className="text-danger">{errors.salary_range}</div>
                                            )}
                                        </div>

                                        <div className="col-md-4 mb-3">
                                            <label className="form-label">Type</label>
                                            <select
                                                className="form-select"
                                                value={data.type}
                                                onChange={e => setData('type', e.target.value)}
                                                disabled={processing}
                                            >
                                                <option value="Full-time">Full Time</option>
                                                <option value="Part-time">Part Time</option>
                                                <option value="Contract">Contract</option>
                                                <option value="Freelance">Freelance</option>
                                                <option value="Internship">Internship</option>
                                            </select>
                                            {errors.type && (
                                                <div className="text-danger">{errors.type}</div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-4 mb-3">
                                            <label className="form-label">Deadline</label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                value={data.deadline}
                                                onChange={e => setData('deadline', e.target.value)}
                                                disabled={processing}
                                            />
                                            {errors.deadline && (
                                                <div className="text-danger">{errors.deadline}</div>
                                            )}
                                        </div>

                                        <div className="col-md-4 mb-3">
                                            <label className="form-label">Status</label>
                                            <select
                                                className="form-select"
                                                value={data.status}
                                                onChange={e => setData('status', e.target.value)}
                                                disabled={processing}
                                            >
                                                <option value="active">Active</option>
                                                <option value="inactive">Inactive</option>
                                                <option value="closed">Closed</option>
                                            </select>
                                            {errors.status && (
                                                <div className="text-danger">{errors.status}</div>
                                            )}
                                        </div>

                                        <div className="col-md-4 mb-3">
                                            <label className="form-label">Moderation Status</label>
                                            <select
                                                className="form-select"
                                                value={data.moderation_status}
                                                onChange={e => setData('moderation_status', e.target.value)}
                                                disabled={processing}
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="approved">Approved</option>
                                                <option value="rejected">Rejected</option>
                                            </select>
                                            {errors.moderation_status && (
                                                <div className="text-danger">{errors.moderation_status}</div>
                                            )}
                                        </div>
                                    </div>

                                    {data.moderation_status === 'rejected' && (
                                        <div className="mb-3">
                                            <label className="form-label">Moderation Reason</label>
                                            <textarea
                                                className="form-control"
                                                rows={2}
                                                value={data.moderation_reason}
                                                onChange={e => setData('moderation_reason', e.target.value)}
                                                disabled={processing}
                                            />
                                            {errors.moderation_reason && (
                                                <div className="text-danger">{errors.moderation_reason}</div>
                                            )}
                                        </div>
                                    )}

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
