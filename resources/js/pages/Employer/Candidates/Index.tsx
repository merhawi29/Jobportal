import React from 'react';
import { Link } from '@inertiajs/react';
import NavBar from '@/components/nav';import Footer from '@/components/Footer';

interface JobSeekerProfile {
    id: number;
    title: string;
    skills: string;
    experience_years: number;
    education: string;
    location: string;
    about: string;
    profile_picture: string;
}

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    job_seeker_profile: JobSeekerProfile | null;
}

interface Props {
    candidates: {
        data: User[];
        links?: any[];
        meta?: {
            current_page?: number;
            from?: number;
            last_page?: number;
            links?: any[];
            path?: string;
            per_page?: number;
            to?: number;
            total?: number;
        };
    };
    filters: {
        name?: string;
        skills?: string;
        experience?: string;
    };
}

export default function CandidatesIndex({ candidates, filters }: Props) {
    return (
        <> 
        
               
            {/* <NavBar /> */}
            <div className="container py-5">
            <Link href={'/'} className="btn btn-outline-secondary">
                         <i className="fas fa-home me-2"></i>
                         Back to Home
                </Link>
                <h2 className="mb-4">Candidate Search Results</h2>
                
                {/* Search filters summary */}
                <div className="d-flex flex-wrap gap-2 mb-4">
                    {filters.name && (
                        <span className="badge bg-secondary px-3 py-2">
                            Name: {filters.name}
                            <button className="btn-close ms-2" style={{ fontSize: '0.5rem' }}></button>
                        </span>
                    )}
                    {filters.skills && (
                        <span className="badge bg-secondary px-3 py-2">
                            Skills: {filters.skills}
                            <button className="btn-close ms-2" style={{ fontSize: '0.5rem' }}></button>
                        </span>
                    )}
                    {filters.experience && (
                        <span className="badge bg-secondary px-3 py-2">
                            Experience: {filters.experience.charAt(0).toUpperCase() + filters.experience.slice(1)} Level
                            <button className="btn-close ms-2" style={{ fontSize: '0.5rem' }}></button>
                        </span>
                    )}
                </div>
                
                <div className="row">
                    <div className="col-12">
                        {candidates.data.length > 0 ? (
                            <>
                                <div className="row row-cols-1 row-cols-md-2 g-4">
                                    {candidates.data.map((candidate) => (
                                        <div key={candidate.id} className="col">
                                            <div className="card h-100 shadow-sm">
                                                <div className="card-body">
                                                    <div className="d-flex align-items-center mb-3">
                                                        <img
                                                            src={candidate.job_seeker_profile?.profile_picture || '/assets/img/logo/testimonial.png'} 
                                                            className="rounded-circle me-3"
                                                            alt={`${candidate.name}'s profile picture`}
                                                            style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                                                        />
                                                        <div>
                                                            <h5 className="card-title mb-0">{candidate.name}</h5>
                                                            <p className="text-muted mb-0">
                                                                {candidate.job_seeker_profile?.title || 'Job Seeker'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    
                                                    {candidate.job_seeker_profile && (
                                                        <>
                                                            <p className="card-text text-truncate-2">
                                                                {candidate.job_seeker_profile.about || 'No description provided.'}
                                                            </p>
                                                            
                                                            <div className="mb-3">
                                                                <strong>Experience:</strong> {candidate.job_seeker_profile.experience_years} years
                                                            </div>
                                                            
                                                            <div className="mb-3">
                                                                <strong>Location:</strong> {candidate.job_seeker_profile.location || 'Not specified'}
                                                            </div>
                                                            
                                                            {candidate.job_seeker_profile.skills && (
                                                                <div className="mb-3">
                                                                    <strong>Skills:</strong>
                                                                    <div className="d-flex flex-wrap gap-1 mt-1">
                                                                        {Array.isArray(candidate.job_seeker_profile.skills) 
                                                                            ? candidate.job_seeker_profile.skills.map((skill, index) => (
                                                                                <span key={index} className="badge bg-primary">{typeof skill === 'string' ? skill.trim() : skill}</span>
                                                                            ))
                                                                            : typeof candidate.job_seeker_profile.skills === 'string' 
                                                                                ? candidate.job_seeker_profile.skills.split(',').map((skill, index) => (
                                                                                    <span key={index} className="badge bg-primary">{skill.trim()}</span>
                                                                                ))
                                                                                : null
                                                                        }
                                                                    </div>
                                                                </div>
                                                            )}
                                                            
                                                            <Link 
                                                                href={route('employer.candidates.show', candidate.id)} 
                                                                className="btn btn-outline-success"
                                                            >
                                                                View Profile
                                                            </Link>
                                                        </>
                                                    )}
                                                    
                                                    {!candidate.job_seeker_profile && (
                                                        <div className="alert alert-info">
                                                            This candidate has not completed their profile yet.
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                
                                {/* Pagination */}
                                {candidates.meta && candidates.meta.last_page && candidates.meta.last_page > 1 && (
                                    <nav className="mt-4">
                                        <ul className="pagination justify-content-center">
                                            {candidates.meta.links && candidates.meta.links.map((link, index) => (
                                                <li key={index} className={`page-item ${link.active ? 'active' : ''} ${!link.url ? 'disabled' : ''}`}>
                                                    <Link 
                                                        href={link.url || '#'} 
                                                        className="page-link"
                                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                                    />
                                                </li>
                                            ))}
                                        </ul>
                                    </nav>
                                )}
                            </>
                        ) : (
                            <div className="alert alert-info text-center">
                                <i className="fas fa-info-circle me-2"></i>
                                No candidates found matching your search criteria.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
} 