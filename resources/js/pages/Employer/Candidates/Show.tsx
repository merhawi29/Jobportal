import React from 'react';
import { Link } from '@inertiajs/react';
import NavBar from '@/components/nav';
import Footer from '@/components/Footer';

interface Education {
    institution: string;
    degree: string;
    field?: string;
    start_date?: string;
    end_date?: string;
    description?: string;
}

interface JobSeekerProfile {
    id: number;
    title: string;
    skills: string | string[];
    experience_years: number;
    education: string | Education[] | any;
    location: string;
    about: string;
    resume: string | null;
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
    candidate: User;
}

export default function CandidateShow({ candidate }: Props) {
    return (
        <>
            {/* <NavBar /> */}
            <div className="container py-5">
                {/* <div className="mb-4">
                    <Link href={route('/')} className="btn btn-outline-secondary">
                        <i className="fas fa-arrow-left me-2"></i>Back to Search Results
                    </Link>
                </div> */}
                <div className="mb-4">
                    <Link  href="/" className='btn btn-outline-secondary' >
                    <i className="fas fa-arrow-left me-2"></i>Back
                    </Link>
                </div>
                
                <div className="card shadow-sm">
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-3 text-center mb-4 mb-md-0">
                                <img 
                                    src={candidate.job_seeker_profile?.profile_picture || '/assets/img/logo/testimonial.png'} 
                                    alt={`${candidate.name}'s profile`}
                                    className="img-fluid rounded-circle mb-3"
                                    style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                                />
                                <h4 className="mb-1">{candidate.name}</h4>
                                {candidate.job_seeker_profile?.title && (
                                    <p className="text-muted">{candidate.job_seeker_profile.title}</p>
                                )}
                                
                                <div className="d-grid gap-2 mt-4">
                                    <a 
                                        href={`mailto:${candidate.email}`} 
                                        className="btn btn-primary"
                                    >
                                        <i className="fas fa-envelope me-2"></i>Contact
                                    </a>
                                    {candidate.job_seeker_profile?.resume && (
                                        <a 
                                            href={candidate.job_seeker_profile.resume} 
                                            className="btn btn-outline-primary"
                                            target="_blank"
                                        >
                                            <i className="fas fa-file-pdf me-2"></i>Download Resume
                                        </a>
                                    )}
                                </div>
                            </div>
                            
                            <div className="col-md-9">
                                {candidate.job_seeker_profile ? (
                                    <>
                                        <div className="mb-4">
                                            <h5>About</h5>
                                            <p>{candidate.job_seeker_profile.about || 'No information provided.'}</p>
                                        </div>
                                        
                                        <div className="row mb-4">
                                            <div className="col-md-6">
                                                <h5>Experience</h5>
                                                <p>{candidate.job_seeker_profile.experience_years} years</p>
                                            </div>
                                            <div className="col-md-6">
                                                <h5>Location</h5>
                                                <p>{candidate.job_seeker_profile.location || 'Not specified'}</p>
                                            </div>
                                        </div>
                                        
                                        {candidate.job_seeker_profile.education && (
                                            <div className="mb-4">
                                                <h5>Education</h5>
                                                {typeof candidate.job_seeker_profile.education === 'string' ? (
                                                    <p>{candidate.job_seeker_profile.education}</p>
                                                ) : Array.isArray(candidate.job_seeker_profile.education) ? (
                                                    <div>
                                                        {candidate.job_seeker_profile.education.map((edu, index) => (
                                                            <div key={index} className="mb-2">
                                                                <div className="fw-bold">{edu.institution || edu.school}</div>
                                                                <div>{edu.degree || edu.qualification}</div>
                                                                {(edu.start_date || edu.end_date) && (
                                                                    <div className="text-muted">
                                                                        {edu.start_date} {edu.start_date && edu.end_date && ' - '} {edu.end_date}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <p>Education details not available in expected format.</p>
                                                )}
                                            </div>
                                        )}
                                        
                                        {candidate.job_seeker_profile.skills && (
                                            <div className="mb-4">
                                                <h5>Skills</h5>
                                                <div className="d-flex flex-wrap gap-2">
                                                    {Array.isArray(candidate.job_seeker_profile.skills) 
                                                        ? candidate.job_seeker_profile.skills.map((skill, index) => (
                                                            <span key={index} className="badge bg-primary py-2 px-3">
                                                                {typeof skill === 'string' ? skill.trim() : skill}
                                                            </span>
                                                        ))
                                                        : typeof candidate.job_seeker_profile.skills === 'string' 
                                                            ? candidate.job_seeker_profile.skills.split(',').map((skill, index) => (
                                                                <span key={index} className="badge bg-primary py-2 px-3">
                                                                    {skill.trim()}
                                                                </span>
                                                            ))
                                                            : null
                                                    }
                                                </div>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="alert alert-info">
                                        <i className="fas fa-info-circle me-2"></i>
                                        This candidate has not completed their profile yet.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
} 