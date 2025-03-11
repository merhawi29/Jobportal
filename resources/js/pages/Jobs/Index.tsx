import React, { FormEvent, useState } from 'react';
import { Link, router } from '@inertiajs/react';
import JobCard from '@/components/JobCard';
import { Job } from '@/types';

interface Props {
    jobs: {
        data: Job[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    auth: {
        user: null | {
            role: string;
        };
    };
    filters?: {
        search?: string;
    };
}

const Index = ({ jobs, auth, filters }: Props) => {
    const [search, setSearch] = useState(filters?.search || '');
    const canPostJob = auth.user && ['employer', 'moderator', 'admin'].includes(auth.user.role);

    const handleSearch = (e: FormEvent) => {
        e.preventDefault();
        router.get(route('jobs.index'), { search }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    return (
        <div className="bg-light min-vh-100">
            <div className="container py-5">
                <div className="mb-4">
                    <Link href={route('home')} className="btn btn-outline-success">

                        <i className="fas fa-arrow-left me-2"></i>
                        Back to Home
                    </Link>
                </div>

                <div className="row mb-4 align-items-center">
                    <div className="col">
                        <h1 className="h2 fw-bold mb-0">Available Jobs</h1>
                    </div>
                    <div className="col-md-6">
                        <form onSubmit={handleSearch} className="d-flex gap-2">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search jobs..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <button type="submit" className="btn btn-outline-success">
                                <i className="fas fa-search me-2"></i>
                                Search
                            </button>
                        </form>
                    </div>
                    {canPostJob && (
                        <div className="col-auto">
                            <Link href="/create" className="btn btn-outline-success">
                                <i className="fas fa-plus-circle me-2"></i>
                                Post New Job
                            </Link>
                        </div>
                    )}
                </div>

                <div className="row">
                    {jobs.data.map((job) => (
                        <JobCard key={job.id} job={job} />
                    ))}
                </div>

                {jobs.data.length === 0 && (
                    <div className="text-center py-5">
                        <p className="text-muted">No jobs found</p>
                    </div>
                )}

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
                                            href={route('jobs.index', { page, search })}
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
    );
};

export default Index;
