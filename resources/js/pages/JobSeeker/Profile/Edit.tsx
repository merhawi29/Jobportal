import React, { FormEvent, useState } from 'react';
import { Head, router, Link } from '@inertiajs/react';
import axios from 'axios';
const [error, setError] = useState<string | null>(null);



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
        portfolio_url: string | null;
        resume: string | null;
        is_public: boolean;
        profile_image: string | null;
        show_email: boolean;
        show_phone: boolean;
        show_education: boolean;
        show_experience: boolean;
        show_skills: boolean;
        show_certifications: boolean;
        show_social_links: boolean;
        show_resume: boolean;
    };
    status?: string;
    flash: {
        success?: string;
        error?: string;
    };
}

interface Education {
    institution: string;
    degree: string;
    field: string;
    start_date: string;
    end_date?: string;
}

interface Experience {
    company: string;
    position: string;
    description: string;
    start_date: string;
    end_date?: string;
}

interface Certification {
    name: string;
    issuer: string;
    date: string;
}

interface FormData {
    name: string;
    email: string;
    phone: string;
    location: string;
    education: Education[];
    experience: Experience[];
    skills: string[];
    certifications: Certification[];
    about: string;
    linkedin_url: string;
    github_url: string;
    portfolio_url: string;
    is_public: boolean;
    resume: File | null;
    profile_image: string | null;
    show_email: boolean;
    show_phone: boolean;
    show_education: boolean;
    show_experience: boolean;
    show_skills: boolean;
    show_certifications: boolean;
    show_social_links: boolean;
    show_resume: boolean;
}

export default function Edit({ profile, status, flash }: Props) {
    const [formData, setFormData] = useState<FormData>({
        name: profile.name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        location: profile.location || '',
        education: profile.education || [{
            institution: '',
            degree: '',
            field: '',
            start_date: '',
            end_date: ''
        }],
        experience: profile.experience || [{
            company: '',
            position: '',
            description: '',
            start_date: '',
            end_date: ''
        }],
        skills: profile.skills || [],
        certifications: profile.certifications || [{
            name: '',
            issuer: '',
            date: ''
        }],
        about: profile.about || '',
        linkedin_url: profile.linkedin_url || '',
        github_url: profile.github_url || '',
        portfolio_url: profile.portfolio_url || '',
        is_public: profile.is_public || false,
        resume: null,
        profile_image: null,
        show_email: profile.show_email ?? true,
        show_phone: profile.show_phone ?? true,
        show_education: profile.show_education ?? true,
        show_experience: profile.show_experience ?? true,
        show_skills: profile.show_skills ?? true,
        show_certifications: profile.show_certifications ?? true,
        show_social_links: profile.show_social_links ?? true,
        show_resume: profile.show_resume ?? true
    });

    // Add/remove education entry
    const addEducation = () => {
        setFormData(prev => ({
            ...prev,
            education: [...prev.education, {
                institution: '',
                degree: '',
                field: '',
                start_date: '',
                end_date: ''
            }]
        }));
    };

    const removeEducation = (index: number) => {
        setFormData(prev => ({
            ...prev,
            education: prev.education.filter((_, i) => i !== index)
        }));
    };

    // Add/remove experience entry
    const addExperience = () => {
        setFormData(prev => ({
            ...prev,
            experience: [...prev.experience, {
                company: '',
                position: '',
                description: '',
                start_date: '',
                end_date: ''
            }]
        }));
    };

    const removeExperience = (index: number) => {
        setFormData(prev => ({
            ...prev,
            experience: prev.experience.filter((_, i) => i !== index)
        }));
    };

    // Add/remove skill
    const addSkill = () => {
        setFormData(prev => ({
            ...prev,
            skills: [...prev.skills, '']
        }));
    };

    const removeSkill = (index: number) => {
        setFormData(prev => ({
            ...prev,
            skills: prev.skills.filter((_, i) => i !== index)
        }));
    };

    // Add/remove certification
    const addCertification = () => {
        setFormData(prev => ({
            ...prev,
            certifications: [...prev.certifications, {
                name: '',
                issuer: '',
                date: ''
            }]
        }));
    };

    const removeCertification = (index: number) => {
        setFormData(prev => ({
            ...prev,
            certifications: prev.certifications.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        const form = new FormData();

        // Log the data being sent
        // console.log('Submitting form data:', formData);

        // Ensure all JSON fields are properly stringified
        (Object.keys(formData) as Array<keyof FormData>).forEach(key => {
            if (key === 'resume' && formData[key]) {
                form.append(key, formData[key] as File);
            } else if (key === 'is_public') {
                form.append(key, formData[key].toString());
            } else if (['education', 'experience', 'skills', 'certifications'].includes(key)) {
                // Ensure these fields are valid JSON strings
                try {

                    // Parse and stringify to validate JSON
                    const validJson = JSON.stringify(formData[key]);
                    form.append(key, validJson);
                } catch (e) {
                    console.error(`Invalid JSON for ${key}:`, e);
                    form.append(key, '[]'); // Default to empty array if invalid
                }
            } else {
                form.append(key, formData[key] as string);
            }
        });

        form.append('_method', 'PUT');

        router.post(route('jobseeker.profile.update'), form, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                console.log('Profile updated successfully');
            },
            onError: (errors) => {
                console.error('Profile update failed:', errors);
            }
        });
    };

    const formatJsonInput = (value: string, key: string) => {
        try {
            const parsed = JSON.parse(value);
            return JSON.stringify(parsed, null, 2);
        } catch (e) {
            console.error(`Invalid JSON for ${key}:`, e);
            return '[]';
        }
    };

    const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return;

        const formData = new FormData();
        formData.append('photo', e.target.files[0]);

        try {
            const response = await axios.post(route('jobseeker.profile.photo'), formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setFormData(prev => prev ? { ...prev, profile_image: response.data.profile_image } : null);
        } catch (err) {
            setError('Failed to upload photo');
        }
    };

    return (
        <div className="py-12">
            <Head title="Edit Profile" />
            {/* Flash Messages */}
            {flash.success && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
                    <span className="block sm:inline">{flash.success}</span>
                </div>
            )}

            {flash.error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                    <span className="block sm:inline">{flash.error}</span>
                </div>
            )}

            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 mb-6">
                <Link
                    href={route('jobseeker.profile.show')}
                    className="btn btn-outline-success"
                >
                    <i className="fas fa-arrow-left me-2"></i>
                    Back
                </Link>
            </div>

            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                {status && (
                    <div className="alert alert-success mb-4">
                        {status}
                    </div>
                )}

                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                    <h2 className="text-2xl font-bold mb-6">Edit Profile</h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            {/* Basic Information */}
                            <div>
                                <label className="form-label">Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={formData.name}
                                    onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    required
                                />
                            </div>

                            <div>
                                <label className="form-label">Email</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    value={formData.email}
                                    onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                    required
                                />
                            </div>

                            <div>
                                <label className="form-label">Phone</label>
                                <input
                                    type="tel"
                                    className="form-control"
                                    value={formData.phone}
                                    onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                                />
                            </div>

                            <div>
                                <label className="form-label">Location</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={formData.location}
                                    onChange={e => setFormData(prev => ({ ...prev, location: e.target.value }))}
                                />
                            </div>

                            {/* Professional Information */}
                            <div className="md:col-span-2">
                                <label className="form-label">About</label>
                                <textarea
                                    className="form-control"
                                    rows={3}
                                    value={formData.about}
                                    onChange={e => setFormData(prev => ({ ...prev, about: e.target.value }))}
                                ></textarea>
                            </div>

                            <div className="md:col-span-2">
                                <div className="flex justify-between items-center mb-3">
                                    <label className="form-label text-lg font-semibold">Education</label>
                                    <button
                                        type="button"
                                        className="btn btn-outline-success btn-sm"
                                        onClick={addEducation}
                                    >
                                        <i className="fas fa-plus me-1"></i> Add Education
                                    </button>
                                </div>
                                {formData.education.map((edu, index) => (
                                    <div key={index} className="mb-4 p-4 border rounded-lg shadow-sm">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="form-label">Institution</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={edu.institution}
                                                    onChange={e => {
                                                        const newEducation = [...formData.education];
                                                        newEducation[index].institution = e.target.value;
                                                        setFormData(prev => ({ ...prev, education: newEducation }));
                                                    }}
                                                />
                                            </div>
                                            <div>
                                                <label className="form-label">Degree</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={edu.degree}
                                                    onChange={e => {
                                                        const newEducation = [...formData.education];
                                                        newEducation[index].degree = e.target.value;
                                                        setFormData(prev => ({ ...prev, education: newEducation }));
                                                    }}
                                                />
                                            </div>
                                            <div>
                                                <label className="form-label">Field of Study</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={edu.field}
                                                    onChange={e => {
                                                        const newEducation = [...formData.education];
                                                        newEducation[index].field = e.target.value;
                                                        setFormData(prev => ({ ...prev, education: newEducation }));
                                                    }}
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="form-label">Start Date</label>
                                                    <input
                                                        type="date"
                                                        className="form-control"
                                                        value={edu.start_date}
                                                        onChange={e => {
                                                            const newEducation = [...formData.education];
                                                            newEducation[index].start_date = e.target.value;
                                                            setFormData(prev => ({ ...prev, education: newEducation }));
                                                        }}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="form-label">End Date</label>
                                                    <input
                                                        type="date"
                                                        className="form-control"
                                                        value={edu.end_date || ''}
                                                        onChange={e => {
                                                            const newEducation = [...formData.education];
                                                            newEducation[index].end_date = e.target.value;
                                                            setFormData(prev => ({ ...prev, education: newEducation }));
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-3">
                                            <button
                                                type="button"
                                                className="btn btn-outline-danger btn-sm"
                                                onClick={() => removeEducation(index)}
                                            >
                                                <i className="fas fa-trash me-1"></i> Remove
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="md:col-span-2">
                                <div className="flex justify-between items-center mb-3">
                                    <label className="form-label text-lg font-semibold">Experience</label>
                                    <button
                                        type="button"
                                        className="btn btn-outline-success btn-sm"
                                        onClick={addExperience}
                                    >
                                        <i className="fas fa-plus me-1"></i> Add Experience
                                    </button>
                                </div>
                                {formData.experience.map((exp, index) => (
                                    <div key={index} className="mb-4 p-4 border rounded-lg shadow-sm">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="form-label">Company</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={exp.company}
                                                    onChange={e => {
                                                        const newExperience = [...formData.experience];
                                                        newExperience[index].company = e.target.value;
                                                        setFormData(prev => ({ ...prev, experience: newExperience }));
                                                    }}
                                                />
                                            </div>
                                            <div>
                                                <label className="form-label">Position</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={exp.position}
                                                    onChange={e => {
                                                        const newExperience = [...formData.experience];
                                                        newExperience[index].position = e.target.value;
                                                        setFormData(prev => ({ ...prev, experience: newExperience }));
                                                    }}
                                                />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="form-label">Description</label>
                                <textarea
                                    className="form-control"
                                    rows={3}
                                                    value={exp.description}
                                                    onChange={e => {
                                                        const newExperience = [...formData.experience];
                                                        newExperience[index].description = e.target.value;
                                                        setFormData(prev => ({ ...prev, experience: newExperience }));
                                                    }}
                                ></textarea>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="form-label">Start Date</label>
                                                    <input
                                                        type="date"
                                                        className="form-control"
                                                        value={exp.start_date}
                                                        onChange={e => {
                                                            const newExperience = [...formData.experience];
                                                            newExperience[index].start_date = e.target.value;
                                                            setFormData(prev => ({ ...prev, experience: newExperience }));
                                                        }}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="form-label">End Date</label>
                                                    <input
                                                        type="date"
                                                        className="form-control"
                                                        value={exp.end_date || ''}
                                                        onChange={e => {
                                                            const newExperience = [...formData.experience];
                                                            newExperience[index].end_date = e.target.value;
                                                            setFormData(prev => ({ ...prev, experience: newExperience }));
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-3">
                                            <button
                                                type="button"
                                                className="btn btn-outline-danger btn-sm"
                                                onClick={() => removeExperience(index)}
                                            >
                                                <i className="fas fa-trash me-1"></i> Remove
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Skills Section */}
                            <div className="md:col-span-2">
                                <div className="flex justify-between items-center mb-3">
                                    <label className="form-label text-lg font-semibold">Skills</label>
                                    <button
                                        type="button"
                                        className="btn btn-outline-success btn-sm"
                                        onClick={addSkill}
                                    >
                                        <i className="fas fa-plus me-1"></i> Add Skill
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {formData.skills.map((skill, index) => (
                                        <div key={index} className="relative">
                                            <input
                                                type="text"
                                                className="form-control pr-10"
                                                value={skill}
                                                onChange={e => {
                                                    const newSkills = [...formData.skills];
                                                    newSkills[index] = e.target.value;
                                                    setFormData(prev => ({ ...prev, skills: newSkills }));
                                                }}
                                                placeholder="Enter a skill"
                                            />
                                            <button
                                                type="button"
                                                className="btn btn-outline-danger btn-sm absolute right-2 top-1/2 transform -translate-y-1/2"
                                                onClick={() => removeSkill(index)}
                                            >
                                                <i className="fas fa-times"></i>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Certifications Section */}
                            <div className="md:col-span-2">
                                <div className="flex justify-between items-center mb-3">
                                    <label className="form-label text-lg font-semibold">Certifications</label>
                                    <button
                                        type="button"
                                        className="btn btn-outline-success btn-sm"
                                        onClick={addCertification}
                                    >
                                        <i className="fas fa-plus me-1"></i> Add Certification
                                    </button>
                                </div>
                                {formData.certifications.map((cert, index) => (
                                    <div key={index} className="mb-4 p-4 border rounded-lg shadow-sm">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="form-label">Certification Name</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={cert.name}
                                                    onChange={e => {
                                                        const newCertifications = [...formData.certifications];
                                                        newCertifications[index].name = e.target.value;
                                                        setFormData(prev => ({ ...prev, certifications: newCertifications }));
                                                    }}
                                                />
                                            </div>
                                            <div>
                                                <label className="form-label">Issuing Organization</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={cert.issuer}
                                                    onChange={e => {
                                                        const newCertifications = [...formData.certifications];
                                                        newCertifications[index].issuer = e.target.value;
                                                        setFormData(prev => ({ ...prev, certifications: newCertifications }));
                                                    }}
                                                />
                                            </div>
                                            <div>
                                                <label className="form-label">Date Obtained</label>
                                                <input
                                                    type="date"
                                                    className="form-control"
                                                    value={cert.date}
                                                    onChange={e => {
                                                        const newCertifications = [...formData.certifications];
                                                        newCertifications[index].date = e.target.value;
                                                        setFormData(prev => ({ ...prev, certifications: newCertifications }));
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div className="mt-3">
                                            <button
                                                type="button"
                                                className="btn btn-outline-danger btn-sm"
                                                onClick={() => removeCertification(index)}
                                            >
                                                <i className="fas fa-trash me-1"></i> Remove
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Social Links */}
                            <div>
                                <label className="form-label">LinkedIn URL</label>
                                <input
                                    type="url"
                                    className="form-control"
                                    value={formData.linkedin_url}
                                    onChange={e => setFormData(prev => ({ ...prev, linkedin_url: e.target.value }))}
                                />
                            </div>

                            <div>
                                <label className="form-label">GitHub URL</label>
                                <input
                                    type="url"
                                    className="form-control"
                                    value={formData.github_url}
                                    onChange={e => setFormData(prev => ({ ...prev, github_url: e.target.value }))}
                                />
                            </div>

                            <div className="relative">
                        <img
                            src={formData.profile_image || '/default-avatar.png'}
                            alt="Profile"
                            className="w-32 h-32 rounded-full object-cover"
                        />
                        <label className="block mt-2">
                            <span className="sr-only">Choose profile photo</span>
                            <input
                                type="file"
                                onChange={handlePhotoUpload}
                                accept="image/*"
                                className="block w-full text-sm text-slate-500
                                    file:mr-4 file:py-2 file:px-4
                                    file:rounded-full file:border-0
                                    file:text-sm file:font-semibold
                                    file:bg-blue-50 file:text-blue-700
                                    hover:file:bg-blue-100"
                            />
                        </label>
                    </div>

                            {/* Resume Upload */}
                            <div>
                                <label className="form-label">Resume</label>
                                <input
                                    type="file"
                                    className="form-control"
                                    accept=".pdf,.doc,.docx"
                                    onChange={e => setFormData(prev => ({
                                        ...prev,
                                        resume: e.target.files ? e.target.files[0] : null
                                    }))}
                                />
                            </div>

                            {/* Privacy Settings */}
                            <div className="md:col-span-2">
                                <div className="bg-light p-4 rounded-lg">
                                    <h3 className="text-lg font-semibold mb-4">Privacy Settings</h3>
                                    <p className="text-gray-600 mb-4">Control what information is visible to other users.</p>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="form-check">
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                id="is_public"
                                                checked={formData.is_public}
                                                onChange={e => setFormData(prev => ({
                                                    ...prev,
                                                    is_public: e.target.checked
                                                }))}
                                            />
                                            <label className="form-check-label" htmlFor="is_public">
                                                Make profile public
                                            </label>
                                        </div>

                                        <div className="form-check">
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                id="show_email"
                                                checked={formData.show_email}
                                                onChange={e => setFormData(prev => ({
                                                    ...prev,
                                                    show_email: e.target.checked
                                                }))}
                                            />
                                            <label className="form-check-label" htmlFor="show_email">
                                                Show email address
                                            </label>
                                        </div>

                                        <div className="form-check">
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                id="show_phone"
                                                checked={formData.show_phone}
                                                onChange={e => setFormData(prev => ({
                                                    ...prev,
                                                    show_phone: e.target.checked
                                                }))}
                                            />
                                            <label className="form-check-label" htmlFor="show_phone">
                                                Show phone number
                                            </label>
                                        </div>

                                        <div className="form-check">
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                id="show_education"
                                                checked={formData.show_education}
                                                onChange={e => setFormData(prev => ({
                                                    ...prev,
                                                    show_education: e.target.checked
                                                }))}
                                            />
                                            <label className="form-check-label" htmlFor="show_education">
                                                Show education history
                                            </label>
                                        </div>

                                        <div className="form-check">
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                id="show_experience"
                                                checked={formData.show_experience}
                                                onChange={e => setFormData(prev => ({
                                                    ...prev,
                                                    show_experience: e.target.checked
                                                }))}
                                            />
                                            <label className="form-check-label" htmlFor="show_experience">
                                                Show work experience
                                            </label>
                                        </div>

                                        <div className="form-check">
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                id="show_skills"
                                                checked={formData.show_skills}
                                                onChange={e => setFormData(prev => ({
                                                    ...prev,
                                                    show_skills: e.target.checked
                                                }))}
                                            />
                                            <label className="form-check-label" htmlFor="show_skills">
                                                Show skills
                                            </label>
                                        </div>

                                        <div className="form-check">
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                id="show_certifications"
                                                checked={formData.show_certifications}
                                                onChange={e => setFormData(prev => ({
                                                    ...prev,
                                                    show_certifications: e.target.checked
                                                }))}
                                            />
                                            <label className="form-check-label" htmlFor="show_certifications">
                                                Show certifications
                                            </label>
                                        </div>

                                        <div className="form-check">
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                id="show_social_links"
                                                checked={formData.show_social_links}
                                                onChange={e => setFormData(prev => ({
                                                    ...prev,
                                                    show_social_links: e.target.checked
                                                }))}
                                            />
                                            <label className="form-check-label" htmlFor="show_social_links">
                                                Show social links
                                            </label>
                                        </div>

                                        <div className="form-check">
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                id="show_resume"
                                                checked={formData.show_resume}
                                                onChange={e => setFormData(prev => ({
                                                    ...prev,
                                                    show_resume: e.target.checked
                                                }))}
                                            />
                                            <label className="form-check-label" htmlFor="show_resume">
                                                Show resume
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <button type="submit" className="btn btn-outline-success btn-sm">
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}


