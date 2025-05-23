import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import NavBar from '@/components/nav';
import Footer from '@/components/Footer';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

interface Job {
    id: number;
    title: string;
}

interface Props {
    candidate: User;
    jobs?: Job[];
    flash?: {
        success?: string;
        error?: string;
    };
}

export default function CandidateShow({ candidate, jobs = [], flash }: Props) {
    const [formData, setFormData] = useState({
        message: '',
        job_id: '',
        job_title: ''
    });

    // Show flash messages if they exist
    React.useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        
        // If changing job, also update job_title
        if (name === 'job_id' && value) {
            const selectedJob = jobs.find(job => job.id === parseInt(value));
            setFormData({
                ...formData,
                job_id: value,
                job_title: selectedJob ? selectedJob.title : ''
            });
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        router.post(route('employer.message.jobseeker', candidate.id), formData);
    };

    return (
        <>
            <NavBar />
            
            <div className="container py-5">
                <div className="row mb-4">
                    <div className="col-12">
                        <Link href={route('employer.candidates.search')} className="btn btn-outline-secondary">
                            <i className="fas fa-arrow-left me-2"></i>Back to Candidates
                        </Link>
                        <h2 className="mt-3">Candidate Profile</h2>
                    </div>
                </div>
                
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
                                <i className="fas fa-envelope me-2"></i>Contact via Email
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
                                
                                {/* Direct Message Form */}
                                <div className="card mt-4">
                                    <div className="card-header bg-light">
                                        <h5 className="mb-0">Send Direct Message</h5>
                                    </div>
                                    <div className="card-body">
                                        <form onSubmit={handleSubmit}>
                                            <div className="mb-3">
                                                <label htmlFor="job_id" className="form-label">Related Job (Optional)</label>
                                                <select 
                                                    id="job_id" 
                                                    name="job_id"
                                                    className="form-select" 
                                                    value={formData.job_id}
                                                    onChange={handleChange}
                                                >
                                                    <option value="">-- Select a job --</option>
                                                    {jobs.map(job => (
                                                        <option key={job.id} value={job.id}>{job.title}</option>
                                                    ))}
                                                </select>
                                                <small className="text-muted">If your message relates to a specific job posting</small>
                                            </div>
                                            
                                            <div className="mb-3">
                                                <label htmlFor="message" className="form-label">Message <span className="text-danger">*</span></label>
                                                <textarea 
                                                    id="message"
                                                    name="message"
                                                    className="form-control"
                                                    rows={5}
                                                    value={formData.message}
                                                    onChange={handleChange}
                                                    required
                                                    placeholder="Write your message to the candidate here..."
                                                />
                                            </div>
                                            
                                            <button type="submit" className="btn btn-success">
                                                <i className="fas fa-paper-plane me-2"></i>
                                                Send Message
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="alert alert-info">
                                This candidate has not completed their profile yet.
                            </div>
                        )}
                    </div>
                </div>
            </div>
            
            <Footer />
            <ToastContainer position="bottom-right" />
        </>
    );
} 