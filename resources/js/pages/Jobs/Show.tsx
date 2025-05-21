import React, { FormEvent, useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import type { Job } from '@/types/index';
import ApplicationFormModal from '@/components/ApplicationFormModal';

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
    flash?: {
        success?: string;
        error?: string;
    };
    error?: string;
}

export default function Show({ job, auth, isSaved = false, hasApplied = false, flash, error }: Props) {
    const isJobOwner = auth.user?.id === job.user_id;
    const [isApplying, setIsApplying] = useState(false);
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);
    const [formData, setFormData] = useState({
        cover_letter: '',
        resume: null as File | null,
    });

    const handleSave = () => {
        if (!auth.user) {
            setShowLoginPrompt(true);
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
            setShowLoginPrompt(true);
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
        <>
            <Head title={job.title} />
            <div className="container py-5">
                <div className="row">
                    <div className="col-lg-8">
                        <div className="mb-4">
                            <Link href={route('jobs.index')} className="btn btn-outline-success">
                                <i className="fas fa-arrow-left me-2"></i>
                                Back to Jobs
                            </Link>
                        </div>
                        <div className="card border-0 shadow-sm">
                            <div className="card-body p-4">
                                <div className="d-flex justify-content-between align-items-start mb-4">
                                    <div>
                                        <h1 className="h2 mb-2">{job.title}</h1>
                                        <div className="d-flex align-items-center gap-2">
                                            <span className="text-muted">{job.company}</span>
                                            {job.user?.verified && (
                                                <i className="fas fa-check-circle text-success"></i>
                                            )}
                                        </div>
                                    </div>
                                    <div className="d-flex gap-2">
                                        {!isJobOwner && (
                                            <>
                                                <button
                                                    onClick={handleSave}
                                                    className={`btn ${isSaved ? 'btn-success' : 'btn-outline-success'}`}
                                                >
                                                    <i className={`fas fa-${isSaved ? 'bookmark' : 'bookmark'}`}></i>
                                                    {isSaved ? 'Saved' : 'Save'}
                                                </button>
                                                {!hasApplied && (
                                                    <button
                                                        onClick={() => {
                                                            if (!auth.user) {
                                                                setShowLoginPrompt(true);
                                                            } else {
                                                                setIsApplying(true);
                                                            }
                                                        }}
                                                        className="btn btn-success"
                                                    >
                                                        Apply Now
                                                    </button>
                                                )}
                                            </>
                                        )}
                                        {isJobOwner && (
                                            <div className="d-flex gap-2">
                                                <Link
                                                    href={route('jobs.edit', job.id)}
                                                    className="btn btn-outline-warning"
                                                >
                                                    <i className="fas fa-edit"></i> Edit
                                                </Link>
                                                <button
                                                    onClick={handleDelete}
                                                    className="btn btn-outline-danger"
                                                >
                                                    <i className="fas fa-trash"></i> Delete
                                                </button>
                                            </div>
                                        )}
                                    </div>
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
                                {auth.user ? (
                                    <ApplicationFormModal
                                        isOpen={isApplying}
                                        onClose={() => setIsApplying(false)}
                                        onSubmit={handleApply}
                                        jobTitle={job.title}
                                        formData={formData}
                                        setFormData={setFormData}
                                    />
                                ) : (
                                    <div className="alert alert-info">
                                        <i className="fas fa-info-circle me-2"></i>
                                        Please <Link href={route('login')} className="alert-link">login</Link> or <Link href={route('register')} className="alert-link">register</Link> to apply for this job.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Login Prompt Modal */}
            {showLoginPrompt && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1050
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        padding: '20px',
                        borderRadius: '8px',
                        maxWidth: '400px',
                        width: '90%',
                        position: 'relative'
                    }}>
                        <button 
                            onClick={() => setShowLoginPrompt(false)}
                            className="btn btn-outline-secondary"
                            style={{ 
                                position: 'absolute',
                                top: '10px',
                                right: '10px',
                                padding: '5px 10px',
                                borderRadius: '50%',
                                width: '30px',
                                height: '30px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            ×
                        </button>
                        <div style={{ marginBottom: '20px', marginTop: '10px' }}>
                            <h5 style={{ marginBottom: '10px' }}>Login Required</h5>
                            <p>Please login or register to apply for this job.</p>
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <a 
                                href={route('login')} 
                                className="btn btn-success"
                                style={{ flex: 1 }}
                            >
                                Login
                            </a>
                            <a 
                                href={route('register')} 
                                className="btn btn-outline-success"
                                style={{ flex: 1 }}
                            >
                                Register
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
