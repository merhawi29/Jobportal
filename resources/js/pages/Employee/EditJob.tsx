import React, { FormEvent, useState, useEffect } from 'react';
import { router, Link } from '@inertiajs/react';
import { Head } from '@inertiajs/react';

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
}

interface FormData {
    [key: string]: string;
    title: string;
    company: string;
    location: string;
    type: string;
    salary_range: string;
    description: string;
    requirements: string;
    benefits: string;
    deadline: string;
}

interface FormErrors {
    [key: string]: string | undefined;
    error?: string;
}

interface Props {
    job: Job;
}

const EditJob: React.FC<Props> = ({ job }) => {
    const [formData, setFormData] = useState<FormData>({
        title: job.title,
        company: job.company,
        location: job.location,
        type: job.type,
        salary_range: job.salary_range,
        description: job.description,
        requirements: job.requirements,
        benefits: job.benefits,
        deadline: job.deadline
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        router.put(route('jobs.update', job.id), formData, {
            preserveScroll: true,
            onSuccess: () => {
                setIsSubmitting(false);
            },
            onError: (errors) => {
                setIsSubmitting(false);
                setErrors(errors);
            }
        });
    };

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this job post?')) {
            router.delete(route('jobs.destroy', job.id), {
                onSuccess: () => {
                    // Redirect to jobs list after successful deletion
                    router.visit(route('jobs.index'));
                }
            });
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: undefined
            }));
        }
    };

    return (
        <>
            <Head title="Edit Job Post" />
            <div className="bg-light min-vh-100 py-5">
                <div className="container">
                    <div className="mb-4 d-flex justify-content-between align-items-center">
                        <Link href={route('jobs.index')} className="btn btn-outline-success">
                            <i className="fas fa-arrow-left me-2"></i>
                            Back to Jobs
                        </Link>
                        <button 
                            onClick={handleDelete}
                            className="btn btn-danger"
                        >
                            <i className="fas fa-trash me-2"></i>
                            Delete Job
                        </button>
                    </div>
                    <div className="row justify-content-center">
                        <div className="col-lg-8">
                            <div className="card border-0 shadow-sm">
                                <div className="card-header bg-gradient text-blue py-4" style={{ background: 'linear-gradient(135deg, #00b074 0%, #008c5d 100%)' }}>
                                    <h2 className="h3 mb-0 fw-bold text-white">Edit Job Post</h2>
                                </div>
                                <div className="card-body p-4">
                                    <form onSubmit={handleSubmit}>
                                        <div className="row g-4">
                                            <div className="col-md-6">
                                                <div className="mb-3">
                                                    <label htmlFor="title" className="form-label fw-medium">Job Title</label>
                                                    <input
                                                        type="text"
                                                        className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                                                        id="title"
                                                        name="title"
                                                        value={formData.title}
                                                        onChange={handleChange}
                                                        placeholder="e.g. Senior Web Developer"
                                                    />
                                                    {errors.title && <div className="invalid-feedback">{errors.title}</div>}
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="mb-3">
                                                    <label htmlFor="company" className="form-label fw-medium">Company Name</label>
                                                    <input
                                                        type="text"
                                                        className={`form-control ${errors.company ? 'is-invalid' : ''}`}
                                                        id="company"
                                                        name="company"
                                                        value={formData.company}
                                                        onChange={handleChange}
                                                        placeholder="Your company name"
                                                    />
                                                    {errors.company && <div className="invalid-feedback">{errors.company}</div>}
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="mb-3">
                                                    <label htmlFor="location" className="form-label fw-medium">Location</label>
                                                    <input
                                                        type="text"
                                                        className={`form-control ${errors.location ? 'is-invalid' : ''}`}
                                                        id="location"
                                                        name="location"
                                                        value={formData.location}
                                                        onChange={handleChange}
                                                        placeholder="e.g. New York, NY"
                                                    />
                                                    {errors.location && <div className="invalid-feedback">{errors.location}</div>}
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="mb-3">
                                                    <label htmlFor="type" className="form-label fw-medium">Job Type</label>
                                                    <select
                                                        className={`form-select ${errors.type ? 'is-invalid' : ''}`}
                                                        id="type"
                                                        name="type"
                                                        value={formData.type}
                                                        onChange={handleChange}
                                                    >
                                                        <option value="">Select job type</option>
                                                        <option value="Full-time">Full-time</option>
                                                        <option value="Part-time">Part-time</option>
                                                        <option value="Contract">Contract</option>
                                                        <option value="Freelance">Freelance</option>
                                                        <option value="Internship">Internship</option>
                                                    </select>
                                                    {errors.type && <div className="invalid-feedback">{errors.type}</div>}
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="mb-3">
                                                    <label htmlFor="salary_range" className="form-label fw-medium">Salary Range</label>
                                                    <input
                                                        type="text"
                                                        className={`form-control ${errors.salary_range ? 'is-invalid' : ''}`}
                                                        id="salary_range"
                                                        name="salary_range"
                                                        value={formData.salary_range}
                                                        onChange={handleChange}
                                                        placeholder="e.g. $50,000 - $70,000"
                                                    />
                                                    {errors.salary_range && <div className="invalid-feedback">{errors.salary_range}</div>}
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="mb-3">
                                                    <label htmlFor="deadline" className="form-label fw-medium">Application Deadline</label>
                                                    <input
                                                        type="date"
                                                        className={`form-control ${errors.deadline ? 'is-invalid' : ''}`}
                                                        id="deadline"
                                                        name="deadline"
                                                        value={formData.deadline}
                                                        onChange={handleChange}
                                                    />
                                                    {errors.deadline && <div className="invalid-feedback">{errors.deadline}</div>}
                                                </div>
                                            </div>
                                            <div className="col-12">
                                                <div className="mb-3">
                                                    <label htmlFor="description" className="form-label fw-medium">Job Description</label>
                                                    <textarea
                                                        className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                                                        id="description"
                                                        name="description"
                                                        value={formData.description}
                                                        onChange={handleChange}
                                                        rows={4}
                                                        placeholder="Describe the role and responsibilities"
                                                    ></textarea>
                                                    {errors.description && <div className="invalid-feedback">{errors.description}</div>}
                                                </div>
                                            </div>
                                            <div className="col-12">
                                                <div className="mb-3">
                                                    <label htmlFor="requirements" className="form-label fw-medium">Requirements</label>
                                                    <textarea
                                                        className={`form-control ${errors.requirements ? 'is-invalid' : ''}`}
                                                        id="requirements"
                                                        name="requirements"
                                                        value={formData.requirements}
                                                        onChange={handleChange}
                                                        rows={4}
                                                        placeholder="List the required skills and qualifications"
                                                    ></textarea>
                                                    {errors.requirements && <div className="invalid-feedback">{errors.requirements}</div>}
                                                </div>
                                            </div>
                                            <div className="col-12">
                                                <div className="mb-4">
                                                    <label htmlFor="benefits" className="form-label fw-medium">Benefits</label>
                                                    <textarea
                                                        className={`form-control ${errors.benefits ? 'is-invalid' : ''}`}
                                                        id="benefits"
                                                        name="benefits"
                                                        value={formData.benefits}
                                                        onChange={handleChange}
                                                        rows={4}
                                                        placeholder="List the benefits and perks"
                                                    ></textarea>
                                                    {errors.benefits && <div className="invalid-feedback">{errors.benefits}</div>}
                                                </div>
                                            </div>
                                            <div className="col-12">
                                                <button
                                                    type="submit"
                                                    className="btn btn-primary px-5 py-3 fw-medium"
                                                    disabled={isSubmitting}
                                                    style={{ background: 'linear-gradient(135deg, #00b074 0%, #008c5d 100%)', border: 'none' }}
                                                >
                                                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default EditJob; 