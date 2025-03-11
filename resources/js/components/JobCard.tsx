import React from 'react';
import { Link } from '@inertiajs/react';

interface JobCardProps {
    job: {
        id: number;
        title: string;
        company: string;
        location: string;
        type: string;
        salary_range: string;
        deadline: string;
    };
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
    return (
        <div className="col-12 mb-4">
            <div className="card border-0 shadow-sm">
                <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start">
                        <div>
                            <h2 className="h4 fw-bold mb-2">
                                <Link href={`/jobs/${job.id}`} className="text-decoration-none text-dark">
                                    {job.title}
                                </Link>
                            </h2>
                            <div className="text-muted h5 mb-3">{job.company}</div>
                            <div className="d-flex flex-wrap gap-3 text-muted">
                                <span>
                                    <i className="fas fa-map-marker-alt me-1"></i>
                                    {job.location}
                                </span>
                                <span>
                                    <i className="fas fa-briefcase me-1"></i>
                                    {job.type}
                                </span>
                                <span>
                                    <i className="fas fa-money-bill-wave me-1"></i>
                                    {job.salary_range}
                                </span>
                            </div>
                        </div>
                        <div className="text-end">
                            <div className="small text-muted mb-2">
                                Deadline: {new Date(job.deadline).toLocaleDateString()}
                            </div>
                            <Link
                                href={`/jobs/${job.id}`}
                                className="btn btn-outline-success btn-sm"
                            >
                                View Details
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobCard;
