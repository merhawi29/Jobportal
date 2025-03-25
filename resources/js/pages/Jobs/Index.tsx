import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Job } from '@/types';

interface Props {
    jobs: {
        data: Job[];
        current_page: number;
        last_page: number;
    };
    filters: {
        search?: string;
        type?: string;
        sector?: string;
    };
    auth: {
        user: {
            role: string;
        } | null;
    };
}

export default function Index({ jobs, filters, auth }: Props) {
    const isEmployee = auth.user?.role === 'employee';
    const [isFilterOpen, setIsFilterOpen] = useState({
        sector: true,
        jobTypes: true,
        jobSites: true
    });
    const [selectedJobTypes, setSelectedJobTypes] = useState<string[]>([]);

    const jobTypes = [
        { id: 'permanent', label: 'Permanent (Full-time)' },
        { id: 'part-time', label: 'Part-time' },
        { id: 'remote', label: 'Remote' },
        { id: 'freelance', label: 'Freelance' },
        { id: 'contractual', label: 'Contractual' },
        { id: 'volunteer', label: 'Volunteer' },
        { id: 'intern-paid', label: 'Intern (Paid)' },
        { id: 'intern-unpaid', label: 'Intern (Unpaid)' }
    ];

    const handleJobTypeChange = (typeId: string) => {
        setSelectedJobTypes(prev => {
            if (prev.includes(typeId)) {
                return prev.filter(type => type !== typeId);
            }
            return [...prev, typeId];
        });
    };

    const formatTimeAgo = (date: string) => {
        const now = new Date();
        const postDate = new Date(date);
        const diffInMinutes = Math.floor((now.getTime() - postDate.getTime()) / (1000 * 60));

        if (diffInMinutes < 60) {
            return `${diffInMinutes} minutes ago`;
        } else if (diffInMinutes < 1440) {
            const hours = Math.floor(diffInMinutes / 60);
            return `${hours} hours ago`;
        } else {
            const days = Math.floor(diffInMinutes / 1440);
            return `${days} days ago`;
        }
    };

    return (
        <>
            <Head title="Job Listings" />
             
            <div className="container-fluid bg-light border-bottom py-3">
            <div className="container mb-5">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-0">
                            <li className="breadcrumb-item">
                                <Link href="/" className="text-decoration-none">
                                    <i className="fas fa-home"></i> Home
                                </Link>
                            </li>
                            <li className="breadcrumb-item active">Job List</li>
                        </ol>
                    </nav>
                </div>

                {isEmployee && (
                    <div className="mb-4">
                        <Link href={route('jobs.create')} className="btn btn-outline-success">
                            <i className="fas fa-plus me-2"></i>
                            Post new Job
                        </Link>
                    </div>
                )}

                <div className="row g-4">
                    {/* Filter Sidebar */}
                    <div className="col-lg-3">
                        <div className="card border-0 rounded-3">
                            <div className="card-body">
                                <h2 className="h4 mb-4 fw-bold">Filter Jobs</h2>

                                {/* Sector Filter */}
                                <div className="mb-4">
                                    <div 
                                        className="d-flex justify-content-between align-items-center mb-3"
                                        onClick={() => setIsFilterOpen(prev => ({ ...prev, sector: !prev.sector }))}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <h3 className="h5 mb-0 fw-bold">Sector</h3>
                                        <i className={`fas fa-chevron-${isFilterOpen.sector ? 'up' : 'down'}`}></i>
                                    </div>
                                    {isFilterOpen.sector && (
                                        <select className="form-select border-0 bg-light">
                                            <option value="">Select sector</option>
                                            <option value="technology">Technology</option>
                                            <option value="healthcare">Healthcare</option>
                                            <option value="finance">Finance</option>
                                            <option value="education">Education</option>
                                            <option value="retail">Retail</option>
                                        </select>
                                    )}
                                </div>

                                {/* Job Types Filter */}
                                <div className="mb-4">
                                    <div 
                                        className="d-flex justify-content-between align-items-center mb-3"
                                        onClick={() => setIsFilterOpen(prev => ({ ...prev, jobTypes: !prev.jobTypes }))}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <h3 className="h5 mb-0 fw-bold">Job Types</h3>
                                        <i className={`fas fa-chevron-${isFilterOpen.jobTypes ? 'up' : 'down'}`}></i>
                                    </div>
                                    {isFilterOpen.jobTypes && (
                                        <div className="d-flex flex-column gap-2">
                                            {jobTypes.map(type => (
                                                <div className="form-check" key={type.id}>
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        id={type.id}
                                                        checked={selectedJobTypes.includes(type.id)}
                                                        onChange={() => handleJobTypeChange(type.id)}
                                                    />
                                                    <label className="form-check-label" htmlFor={type.id}>
                                                        {type.label}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Job Sites Filter */}
                                <div className="mb-4">
                                    <div 
                                        className="d-flex justify-content-between align-items-center mb-3"
                                        onClick={() => setIsFilterOpen(prev => ({ ...prev, jobSites: !prev.jobSites }))}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <h3 className="h5 mb-0 fw-bold">Job Sites</h3>
                                        <i className={`fas fa-chevron-${isFilterOpen.jobSites ? 'up' : 'down'}`}></i>
                                    </div>
                                    {isFilterOpen.jobSites && (
                                        <div>Job sites filter content here</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Job Listings */}
                    <div className="col-lg-9">
                        <div className="mb-4">
                            <h1 className="h4 fw-bold">All jobs</h1>
                        </div>

                        <div className="d-flex flex-column gap-4">
                            {jobs.data.map((job) => (
                                <div key={job.id} className="card border-0 rounded-3 hover:bg-gray-100">
                                    <div className="card-body hover:bg-gray-200">
                                        <div className="d-flex justify-content-between align-items-start mb-3">
                                            <div>
                                                <Link 
                                                    href={route('jobs.show', job.id)} 
                                                    className="h5 text-decoration-none mb-2 d-block fw-bold"
                                                >
                                                    {job.title}
                            </Link>
                                                <div className="d-flex align-items-center gap-2">
                                                    <span className="text-muted">{job.company}</span>
                                                    {job.user?.verified && (
                                                        <i className="fas fa-check-circle text-success"></i>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="d-flex gap-2">
                                                <button 
                                                    onClick={() => window.location.href = `mailto:?subject=Job Opening: ${job.title}&body=Check out this job posting: ${window.location.origin}${route('jobs.show', job.id)}`}
                                                    className="btn btn-outline-secondary btn-sm"
                                                >
                                                    <i className="fas fa-share-alt"></i>
                                                </button>
                                                <button 
                                                    onClick={() => router.post(route('jobs.save', job.id))}
                                                    className="btn btn-outline-secondary btn-sm"
                                                >
                                                    <i className="far fa-bookmark"></i>
                                                </button>
                                            </div>
                                        </div>

                                        <div className="d-flex flex-wrap gap-3 mb-3">
                                            <div className="badge bg-light text-dark border">
                                                <i className="fas fa-map-marker-alt me-1"></i>
                                                {job.location}
                                            </div>
                                            <div className="badge bg-light text-dark border">
                                                <i className="fas fa-briefcase me-1"></i>
                                                {job.type}
                                            </div>
                                            {job.salary_range && (
                                                <div className="badge bg-light text-dark border">
                                                    <i className="fas fa-money-bill-wave me-1"></i>
                                                    {job.salary_range}
                        </div>
                    )}
                </div>

                                        <div className="d-flex justify-content-between align-items-center">
                                            <Link 
                                                href={route('jobs.show', job.id)}
                                                className="btn btn-outline-success btn-sm px-4"
                                            >
                                                View Details
                                            </Link>
                                            <small className="text-muted">
                                                Posted {formatTimeAgo(job.created_at)}
                                            </small>
                                        </div>
                                    </div>
                                </div>
                    ))}
                </div>

                {/* Pagination */}
                {jobs.last_page > 1 && (
                    <div className="d-flex justify-content-center mt-4">
                        <nav aria-label="Page navigation">
                            <ul className="pagination">
                                {Array.from({ length: jobs.last_page }, (_, i) => i + 1).map((page) => (
                                    <li
                                        key={page}
                                        className={`page-item ${page === jobs.current_page ? 'active' : ''}`}
                                    >
                                        <Link
                                                    href={route('jobs.index', { ...filters, page })}
                                            className="page-link"
                                        >
                                            {page}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>
                )}
            </div>
        </div>
            </div>
        </>
    );
}

