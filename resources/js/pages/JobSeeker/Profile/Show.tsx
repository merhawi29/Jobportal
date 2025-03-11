import React from 'react';
import { Head, Link } from '@inertiajs/react';

interface Props {
    profile: {
        name: string;
        email: string;
        phone: string;
        location: string | null;
        education: any[] | null;
        experience: any[] | null;
        skills: string[] | null;
        certifications: any[] | null;
        about: string | null;
        linkedin_url: string | null;
        github_url: string | null;
        profile_image: string | null;
        resume: string | null;
        is_public: boolean;
        show_email: boolean;
        show_phone: boolean;
        show_education: boolean;
        show_experience: boolean;
        show_skills: boolean;
        show_certifications: boolean;
        show_social_links: boolean;
        show_resume: boolean;
    };
    isOwnProfile?: boolean;
}

export default function Show({ profile, isOwnProfile = false }: Props) {
    return (
        <>
            <div className="py-12">
                <Head title="Profile" />

                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="mb-6 flex justify-between items-center">
                        <Link
                            href={route('home')}
                            className="btn btn-outline-success"
                        >
                            <i className="fas fa-arrow-left me-2"></i>
                            Back to Home
                        </Link>
                        {isOwnProfile && (
                            <Link
                                href={route('jobseeker.profile.edit')}
                                className="btn btn-outline-success"
                            >
                                <i className="fas fa-edit me-2"></i>
                                Edit Profile
                            </Link>
                        )}
                    </div>

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        {/* Profile Header */}
                        <div className="p-6 border-b border-gray-200 bg-light">
                            <div className="flex items-center gap-6">
                                {profile.profile_image ? (
                                    <img
                                        src={profile.profile_image}
                                        alt={profile.name}
                                        className="rounded-circle"
                                        style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                                    />
                                ) : (
                                    <div
                                        className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center"
                                        style={{ width: '120px', height: '120px' }}
                                    >
                                        <i className="fas fa-user fa-3x"></i>
                                    </div>
                                )}
                                <div>
                                    <h1 className="text-3xl font-bold mb-2">{profile.name}</h1>
                                    <div className="text-gray-600">
                                        <p><i className="fas fa-map-marker-alt me-2"></i>{profile.location || 'Location not specified'}</p>
                                        {(isOwnProfile || profile.show_email) && (
                                            <p><i className="fas fa-envelope me-2"></i>{profile.email}</p>
                                        )}
                                        {(isOwnProfile || profile.show_phone) && profile.phone && (
                                            <p><i className="fas fa-phone me-2"></i>{profile.phone}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* About Section */}
                        <div className="p-6 border-b border-gray-200">
                            <h2 className="text-xl font-semibold mb-4">About</h2>
                            <p className="text-gray-600">{profile.about || 'No description provided.'}</p>
                        </div>

                        {/* Skills Section */}
                        {(isOwnProfile || profile.show_skills) && (
                            <div className="p-6 border-b border-gray-200">
                                <h2 className="text-xl font-semibold mb-4">Skills</h2>
                                <div className="flex flex-wrap gap-2">
                                    {profile.skills && profile.skills.length > 0 ? (
                                        profile.skills.map((skill, index) => (
                                            <span key={index} className="badge bg-success">{skill}</span>
                                        ))
                                    ) : (
                                        <p className="text-gray-600">No skills listed.</p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Experience Section */}
                        {(isOwnProfile || profile.show_experience) && (
                            <div className="p-6 border-b border-gray-200">
                                <h2 className="text-xl font-semibold mb-4">Experience</h2>
                                {profile.experience && profile.experience.length > 0 ? (
                                    <div className="space-y-4">
                                        {profile.experience.map((exp, index) => (
                                            <div key={index} className="border-l-4 border-success pl-4">
                                                <h3 className="font-semibold">{exp.position}</h3>
                                                <p className="text-success">{exp.company}</p>
                                                <p className="text-gray-600">
                                                    {exp.start_date} - {exp.end_date || 'Present'}
                                                </p>
                                                <p className="mt-2">{exp.description}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-600">No experience listed.</p>
                                )}
                            </div>
                        )}

                        {/* Education Section */}
                        {(isOwnProfile || profile.show_education) && (
                            <div className="p-6 border-b border-gray-200">
                                <h2 className="text-xl font-semibold mb-4">Education</h2>
                                {profile.education && profile.education.length > 0 ? (
                                    <div className="space-y-4">
                                        {profile.education.map((edu, index) => (
                                            <div key={index} className="border-l-4 border-success pl-4">
                                                <h3 className="font-semibold">{edu.degree}</h3>
                                                <p className="text-success">{edu.institution}</p>
                                                <p className="text-gray-600">
                                                    {edu.start_date} - {edu.end_date || 'Present'}
                                                </p>
                                                <p>{edu.field}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-600">No education listed.</p>
                                )}
                            </div>
                        )}

                        {/* Certifications Section */}
                        {(isOwnProfile || profile.show_certifications) && (
                            <div className="p-6 border-b border-gray-200">
                                <h2 className="text-xl font-semibold mb-4">Certifications</h2>
                                {profile.certifications && profile.certifications.length > 0 ? (
                                    <div className="space-y-4">
                                        {profile.certifications.map((cert, index) => (
                                            <div key={index} className="border-l-4 border-success pl-4">
                                                <h3 className="font-semibold">{cert.name}</h3>
                                                <p className="text-success">{cert.issuer}</p>
                                                <p className="text-gray-600">{cert.date}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-600">No certifications listed.</p>
                                )}
                            </div>
                        )}

                        {/* Social Links & Resume */}
                        {(isOwnProfile || profile.show_social_links || profile.show_resume) && (
                            <div className="p-6">
                                <h2 className="text-xl font-semibold mb-4">Links & Documents</h2>
                                <div className="space-y-3">
                                    {(isOwnProfile || profile.show_social_links) && (
                                        <>
                                            {profile.linkedin_url && (
                                                <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" className="btn btn-outline-success btn-sm me-2">
                                                    <i className="fab fa-linkedin me-2"></i>LinkedIn Profile
                                                </a>
                                            )}
                                            {profile.github_url && (
                                                <a href={profile.github_url} target="_blank" rel="noopener noreferrer" className="btn btn-outline-success btn-sm me-2">
                                                    <i className="fab fa-github me-2"></i>GitHub Profile
                                                </a>
                                            )}
                                        </>
                                    )}
                                    {(isOwnProfile || profile.show_resume) && profile.resume && (
                                        <a href={profile.resume} target="_blank" rel="noopener noreferrer" className="btn btn-outline-success btn-sm">
                                            <i className="fas fa-file-pdf me-2"></i>View Resume
                                        </a>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
