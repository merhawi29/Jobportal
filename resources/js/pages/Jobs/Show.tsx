import React, { FormEvent, useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Job } from '@/types';
interface Props {
    job: Job;
    auth: {
        user: null | {
            id: number;
            role: string;
        };
    };
    isSaved?: boolean;
    hasApplied?: boolean;
}

export default function Show({ job, auth, isSaved = false, hasApplied = false }: Props) {
    const isJobSeeker = auth.user?.role === "job_seeker";
    // console.log(isJobSeeker);
    const isJobOwner = auth.user?.id === job.user_id;
    const [isApplying, setIsApplying] = useState(false);
    const [formData, setFormData] = useState({
        cover_letter: '',
        resume: null as File | null,
    });

    const handleSave = () => {
        if (!auth.user) {
            window.location.href = route('login');
            return;
        }

        if (isSaved) {
            router.delete(route('jobs.unsave', job.id));
        } else {
            router.post(route('jobs.save', job.id));
        }
    };

    const handleApply = (e: FormEvent) => {
        e.preventDefault();

        if (!auth.user) {
            window.location.href = route('login');
            return;
        }

        const form = new FormData();
        form.append('cover_letter', formData.cover_letter);
        if (formData.resume) {
            form.append('resume', formData.resume);
        }

        router.post(route('job-applications.store', job.id), form, {
            onSuccess: () => {
                setIsApplying(false);
                setFormData({ cover_letter: '', resume: null });
            }
        });
    };

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this job post? This action cannot be undone.')) {
            router.delete(route('jobs.destroy', job.id));
        }
    };

    return (
        <div className="bg-light min-vh-100">
            <Head title={`${job.title} - Job Details`} />

            <div className="container py-5">
                <div className="mb-4 d-flex justify-content-between align-items-center">
                    <Link href={route('jobs.index')} className="btn btn-outline-success">
                        <i className="fas fa-arrow-left me-2"></i>
                        Back to Jobs
                    </Link>
                    {isJobOwner && (
                        <div className="d-flex gap-2">
                            <Link
                                href={route('jobs.edit', job.id)}
                                className="btn btn-primary"
                            >
                                <i className="fas fa-edit me-2"></i>
                                Edit Job
                            </Link>
                            <button
                                onClick={handleDelete}
                                className="btn btn-danger"
                            >
                                <i className="fas fa-trash me-2"></i>
                                Delete Job
                            </button>
                        </div>
                    )}
                </div>

                <div className="bg-white shadow-sm rounded p-4">
                    <div className="d-flex justify-content-between align-items-start mb-4">
                        <div>
                            <h1 className="h2 mb-2">{job.title}</h1>
                            <p className="text-success mb-0">{job.company}</p>
                        </div>
                        { isJobSeeker && (
                            <div className="d-flex gap-2">
                                <button
                                    onClick={handleSave}
                                    className={`btn ${isSaved ? 'btn-danger' : 'btn-outline-success'}`}
                                >
                                    <i className={`fas fa-heart${isSaved ? '' : '-broken'} me-2`}></i>
                                    {isSaved ? 'Unsave' : 'Save Job'}
                                </button>
                                {!hasApplied && (
                                    <button
                                        onClick={() => setIsApplying(true)}
                                        className="btn btn-success"
                                    >
                                        <i className="fas fa-paper-plane me-2"></i>
                                        Apply Now
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="row mb-4">
                        <div className="col-md-6">
                            <p><strong>Location:</strong> {job.location}</p>
                            <p><strong>Job Type:</strong> {job.type}</p>
                        </div>
                        <div className="col-md-6">
                            <p><strong>Salary Range:</strong> {job.salary_range}</p>
                            <p><strong>Posted by:</strong> {job.user?.name}</p>
                            <p><strong>Deadline:</strong> {new Date(job.deadline).toLocaleDateString()}</p>
                        </div>
                    </div>

                    <div className="mb-4">
                        <h3 className="h4">Description</h3>
                        <p className="text-muted">{job.description}</p>
                    </div>

                    <div className="mb-4">
                        <h3 className="h4">Requirements</h3>
                        <div className="text-muted" style={{ whiteSpace: 'pre-line' }}>
                            {job.requirements}
                        </div>
                    </div>

                    <div className="mb-4">
                        <h3 className="h4">Benefits</h3>
                        <div className="text-muted" style={{ whiteSpace: 'pre-line' }}>
                            {job.benefits}
                        </div>
                    </div>

                    {/* Application Form Modal */}
                    {isApplying && (
                        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                            <div className="modal-dialog modal-lg">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title">Apply for {job.title}</h5>
                                        <button
                                            type="button"
                                            className="btn-close"
                                            onClick={() => setIsApplying(false)}
                                        ></button>
                                    </div>
                                    <form onSubmit={handleApply}>
                                        <div className="modal-body">
                                            <div className="mb-3">
                                                <label className="form-label">Cover Letter</label>
                                                <textarea
                                                    className="form-control"
                                                    rows={6}
                                                    value={formData.cover_letter}
                                                    onChange={e => setFormData(prev => ({
                                                        ...prev,
                                                        cover_letter: e.target.value
                                                    }))}
                                                    required
                                                    minLength={100}
                                                    placeholder="Write a compelling cover letter explaining why you're the perfect candidate for this position..."
                                                ></textarea>
                                                <small className="text-muted">
                                                    Minimum 100 characters. Be sure to highlight your relevant experience and skills.
                                                </small>
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label">Resume</label>
                                                <input
                                                    type="file"
                                                    className="form-control"

                                                    accept=".pdf,.doc,.docx"
                                                    onChange={e => setFormData(prev => ({
                                                        ...prev,
                                                        resume: e.target.files ? e.target.files[0] : null
                                                    }))}
                                                    required
                                                />
                                                <small className="text-muted">
                                                    Upload your resume (PDF, DOC, or DOCX format, max 2MB)
                                                </small>
                                            </div>
                                        </div>
                                        <div className="modal-footer">
                                            <button
                                                type="button"
                                                className="btn btn-secondary"
                                                onClick={() => setIsApplying(false)}
                                            >
                                                Cancel
                                            </button>
                                            <button type="submit" className="btn btn-outline-success">
                                                Submit Application
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
