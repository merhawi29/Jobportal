import React from 'react';
import { Link } from '@inertiajs/react';
import JobCard from '@/components/JobCard';

interface Job {
    id: number;
    title: string;
    company: string;
    location: string;
    type: string;
    salary_range: string;
    deadline: string;
    created_at: string;
    user: {
        name: string;
    };
}

interface Props {
    jobs: {
        data: Job[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

const Index = ({ jobs }: Props) => {
    return (
        <div className="bg-light min-vh-100">
            <div className="container py-5">
                <div className="row mb-4 align-items-center">
                    <div className="col">
                        <h1 className="h2 fw-bold mb-0">Available Jobs</h1>
                    </div>
                    <div className="col-auto">
                        <Link href="/jobs/create" className="btn btn-primary">
                            <i className="fas fa-plus-circle me-2"></i>
                            Post New Job
                        </Link>
                    </div>
                </div>

                <div className="row">
                    {jobs.data.map((job) => (
                        <JobCard key={job.id} job={job} />
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
                                            href={`/jobs?page=${page}`}
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
