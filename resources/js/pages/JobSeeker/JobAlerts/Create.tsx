import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';

export default function Create() {
    const [formData, setFormData] = useState({
        job_title: '',
        job_type: '',
        location: '',
        salary_min: '',
        salary_max: '',
        keywords: '',
        notification_type: 'email',
        frequency: 'immediately'
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(route('job-alerts.store'), formData);
    };

    return (
        <>
            <Head title="Create Job Alert" />
            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <div className="card">
                            <div className="card-header d-flex justify-content-between align-items-center">
                                <h2 className="h4 mb-0">Create Job Alert</h2>
                                <Link href={route('job-alerts.index')} className="btn btn-secondary btn-sm">
                                    <i className="fas fa-arrow-left me-2"></i>
                                    Back to Alerts
                                </Link>
                            </div>
                            <div className="card-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label className="form-label">Job Title</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={formData.job_title}
                                            onChange={e => setFormData(prev => ({ ...prev, job_title: e.target.value }))}
                                            placeholder="e.g., Software Engineer"
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Job Type</label>
                                        <select
                                            className="form-select"
                                            value={formData.job_type}
                                            onChange={e => setFormData(prev => ({ ...prev, job_type: e.target.value }))}
                                        >
                                            <option value="">Any</option>
                                            <option value="full-time">Full Time</option>
                                            <option value="part-time">Part Time</option>
                                            <option value="contract">Contract</option>
                                            <option value="remote">Remote</option>
                                            <option value="internship">Internship</option>
                                        </select>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Location</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={formData.location}
                                            onChange={e => setFormData(prev => ({ ...prev, location: e.target.value }))}
                                            placeholder="e.g., New York"
                                        />
                                    </div>

                                    <div className="row mb-3">
                                        <div className="col-md-6">
                                            <label className="form-label">Minimum Salary</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                value={formData.salary_min}
                                                onChange={e => setFormData(prev => ({ ...prev, salary_min: e.target.value }))}
                                                placeholder="Enter amount"
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">Maximum Salary</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                value={formData.salary_max}
                                                onChange={e => setFormData(prev => ({ ...prev, salary_max: e.target.value }))}
                                                placeholder="Enter amount"
                                            />
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Keywords (comma separated)</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={formData.keywords}
                                            onChange={e => setFormData(prev => ({ ...prev, keywords: e.target.value }))}
                                            placeholder="e.g., React, TypeScript, Laravel"
                                        />
                                        <small className="text-muted">
                                            Enter keywords related to skills, technologies, or job requirements
                                        </small>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Notification Type</label>
                                        <select
                                            className="form-select"
                                            value={formData.notification_type}
                                            onChange={e => setFormData(prev => ({ ...prev, notification_type: e.target.value }))}
                                        >
                                            <option value="email">Email</option>
                                            <option value="push">Push Notification</option>
                                            <option value="both">Both</option>
                                        </select>
                                    </div>

                                    <div className="mb-4">
                                        <label className="form-label">Alert Frequency</label>
                                        <select
                                            className="form-select"
                                            value={formData.frequency}
                                            onChange={e => setFormData(prev => ({ ...prev, frequency: e.target.value }))}
                                        >
                                            <option value="immediately">Immediately</option>
                                            <option value="daily">Daily Digest</option>
                                            <option value="weekly">Weekly Digest</option>
                                        </select>
                                    </div>

                                    <div className="d-flex gap-2">
                                        <button type="submit" className="btn btn-primary">
                                            Create Alert
                                        </button>
                                        <Link href={route('job-alerts.index')} className="btn btn-secondary">
                                            Cancel
                                        </Link>
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