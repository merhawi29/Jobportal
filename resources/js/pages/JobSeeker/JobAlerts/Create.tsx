import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Link } from '@inertiajs/react';

interface User {
    id: number;
    name: string;
    email: string;
    profile_picture?: string | null;
    role: string;
}

interface CreateProps {
    auth: {
        user: User;
    };
    categories: Record<number, string>;
    jobTypes: Record<number, string>;
}

const JobAlertsCreate = ({ auth, categories, jobTypes }: CreateProps) => {
    const { data, setData, post, processing, errors } = useForm<{
        title: string;
        keywords: string[];
        location: string;
        categories: number[];
        job_types: number[];
        min_salary: string;
        max_salary: string;
        frequency: string;
        notification_method: string;
    }>({
        title: '',
        keywords: [] as string[],
        location: '',
        categories: [] as number[],
        job_types: [] as number[],
        min_salary: '',
        max_salary: '',
        frequency: 'daily',
        notification_method: 'email',
    });

    const [keywordInput, setKeywordInput] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('job-alerts.store'));
    };

    const addKeyword = () => {
        if (keywordInput.trim() && !data.keywords.includes(keywordInput.trim())) {
            setData('keywords', [...data.keywords, keywordInput.trim()]);
            setKeywordInput('');
        }
    };

    const removeKeyword = (keyword: string) => {
        setData('keywords', data.keywords.filter(k => k !== keyword));
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addKeyword();
        }
    };

    const handleCategoryChange = (id: number) => {
        const currentCategories = [...data.categories];
        if (currentCategories.includes(id)) {
            setData('categories', currentCategories.filter(c => c !== id));
        } else {
            setData('categories', [...currentCategories, id]);
        }
    };

    const handleJobTypeChange = (id: number) => {
        const currentJobTypes = [...data.job_types];
        if (currentJobTypes.includes(id)) {
            setData('job_types', currentJobTypes.filter(jt => jt !== id));
        } else {
            setData('job_types', [...currentJobTypes, id]);
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Create Job Alert</h2>}
        >
            <Head title="Create Job Alert" />
            
            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-md-10">
                        <div className="card shadow-sm">
                            <div className="card-header bg-transparent">
                                <h5 className="mb-0">Create New Job Alert</h5>
                            </div>
                            <div className="card-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="row mb-4">
                                        <div className="col-md-6">
                                            <label htmlFor="title" className="form-label">Alert Name*</label>
                                            <input
                                                type="text"
                                                className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                                                id="title"
                                                value={data.title}
                                                onChange={e => setData('title', e.target.value)}
                                                placeholder="E.g., Frontend Developer Jobs in New York"
                                            />
                                            {errors.title && <div className="invalid-feedback">{errors.title}</div>}
                                            <div className="form-text">Give your alert a descriptive name</div>
                                        </div>
                                    </div>
                                    
                                    <h6 className="mb-3">Search Criteria</h6>
                                    
                                    <div className="row mb-4">
                                        <div className="col-md-6">
                                            <label className="form-label">Keywords</label>
                                            <div className="input-group mb-2">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Enter keywords"
                                                    value={keywordInput}
                                                    onChange={e => setKeywordInput(e.target.value)}
                                                    onKeyPress={handleKeyPress}
                                                />
                                                <button 
                                                    className="btn btn-outline-primary" 
                                                    type="button"
                                                    onClick={addKeyword}
                                                >
                                                    Add
                                                </button>
                                            </div>
                                            <div className="form-text mb-2">Press Enter or click Add to add keywords</div>
                                            
                                            {data.keywords.length > 0 && (
                                                <div className="d-flex flex-wrap gap-2 mt-2">
                                                    {data.keywords.map(keyword => (
                                                        <div key={keyword} className="badge bg-light text-dark p-2 d-flex align-items-center">
                                                            {keyword}
                                                            <button 
                                                                type="button" 
                                                                className="btn-close ms-2" 
                                                                aria-label="Remove"
                                                                onClick={() => removeKeyword(keyword)}
                                                                style={{ fontSize: '0.65rem' }}
                                                            ></button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        
                                        <div className="col-md-6">
                                            <label htmlFor="location" className="form-label">Location</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="location"
                                                value={data.location || ''}
                                                onChange={e => setData('location', e.target.value)}
                                                placeholder="E.g., New York, Remote, etc."
                                            />
                                            <div className="form-text">Enter a city, state, or "Remote"</div>
                                        </div>
                                    </div>
                                    
                                    <div className="row mb-4">
                                        <div className="col-md-6">
                                            <label className="form-label d-block">Job Categories</label>
                                            <div className="row">
                                                {Object.entries(categories).map(([id, name]) => (
                                                    <div className="col-md-6" key={id}>
                                                        <div className="form-check mb-2">
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                id={`category-${id}`}
                                                                checked={data.categories.includes(Number(id))}
                                                                onChange={() => handleCategoryChange(Number(id))}
                                                            />
                                                            <label className="form-check-label" htmlFor={`category-${id}`}>
                                                                {name}
                                                            </label>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        
                                        <div className="col-md-6">
                                            <label className="form-label d-block">Job Types</label>
                                            <div className="row">
                                                {Object.entries(jobTypes).map(([id, name]) => (
                                                    <div className="col-md-6" key={id}>
                                                        <div className="form-check mb-2">
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                id={`job-type-${id}`}
                                                                checked={data.job_types.includes(Number(id))}
                                                                onChange={() => handleJobTypeChange(Number(id))}
                                                            />
                                                            <label className="form-check-label" htmlFor={`job-type-${id}`}>
                                                                {name}
                                                            </label>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="row mb-4">
                                        <div className="col-md-6">
                                            <label htmlFor="min-salary" className="form-label">Minimum Salary</label>
                                            <div className="input-group">
                                                <span className="input-group-text">$</span>
                                                <input
                                                    type="number"
                                                    className={`form-control ${errors.min_salary ? 'is-invalid' : ''}`}
                                                    id="min-salary"
                                                    value={data.min_salary}
                                                    onChange={e => setData('min_salary', e.target.value)}
                                                    placeholder="Min yearly salary"
                                                    min="0"
                                                />
                                                {errors.min_salary && <div className="invalid-feedback">{errors.min_salary}</div>}
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <label htmlFor="max-salary" className="form-label">Maximum Salary</label>
                                            <div className="input-group">
                                                <span className="input-group-text">$</span>
                                                <input
                                                    type="number"
                                                    className={`form-control ${errors.max_salary ? 'is-invalid' : ''}`}
                                                    id="max-salary"
                                                    value={data.max_salary}
                                                    onChange={e => setData('max_salary', e.target.value)}
                                                    placeholder="Max yearly salary"
                                                    min="0"
                                                />
                                                {errors.max_salary && <div className="invalid-feedback">{errors.max_salary}</div>}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <h6 className="mb-3">Notification Settings</h6>
                                    
                                    <div className="row mb-4">
                                        <div className="col-md-6">
                                            <label className="form-label">Alert Frequency</label>
                                            <div className="form-check mb-2">
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    name="frequency"
                                                    id="frequency-immediate"
                                                    value="immediate"
                                                    checked={data.frequency === 'immediate'}
                                                    onChange={() => setData('frequency', 'immediate')}
                                                />
                                                <label className="form-check-label" htmlFor="frequency-immediate">
                                                    Immediate - As soon as matching jobs are posted
                                                </label>
                                            </div>
                                            <div className="form-check mb-2">
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    name="frequency"
                                                    id="frequency-daily"
                                                    value="daily"
                                                    checked={data.frequency === 'daily'}
                                                    onChange={() => setData('frequency', 'daily')}
                                                />
                                                <label className="form-check-label" htmlFor="frequency-daily">
                                                    Daily - Receive a daily digest of matching jobs
                                                </label>
                                            </div>
                                            <div className="form-check mb-2">
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    name="frequency"
                                                    id="frequency-weekly"
                                                    value="weekly"
                                                    checked={data.frequency === 'weekly'}
                                                    onChange={() => setData('frequency', 'weekly')}
                                                />
                                                <label className="form-check-label" htmlFor="frequency-weekly">
                                                    Weekly - Receive a weekly digest of matching jobs
                                                </label>
                                            </div>
                                        </div>
                                        
                                        <div className="col-md-6">
                                            <label className="form-label">Notification Method</label>
                                            <div className="form-check mb-2">
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    name="notification_method"
                                                    id="method-email"
                                                    value="email"
                                                    checked={data.notification_method === 'email'}
                                                    onChange={() => setData('notification_method', 'email')}
                                                />
                                                <label className="form-check-label" htmlFor="method-email">
                                                    Email
                                                </label>
                                            </div>
                                            <div className="form-check mb-2">
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    name="notification_method"
                                                    id="method-push"
                                                    value="push"
                                                    checked={data.notification_method === 'push'}
                                                    onChange={() => setData('notification_method', 'push')}
                                                />
                                                <label className="form-check-label" htmlFor="method-push">
                                                    Push Notification
                                                </label>
                                            </div>
                                            <div className="form-check mb-2">
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    name="notification_method"
                                                    id="method-both"
                                                    value="both"
                                                    checked={data.notification_method === 'both'}
                                                    onChange={() => setData('notification_method', 'both')}
                                                />
                                                <label className="form-check-label" htmlFor="method-both">
                                                    Both Email & Push
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="d-flex justify-content-between mt-4 pt-3 border-top">
                                        <a href={route('job-alerts.index')} className="btn btn-secondary">
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
                                                    Creating...
                                                </>
                                            ) : 'Create Job Alert'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default JobAlertsCreate;
