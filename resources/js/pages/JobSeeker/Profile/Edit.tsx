import React, { useState, useEffect } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { Link } from '@inertiajs/react';
import { FormDataConvertible } from '@inertiajs/core';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import Textarea from '@/components/TextArea';

interface Props {
    profile: {
        name: string;
        email: string;
        phone: string;
        profile_picture: string | null;
        location: string;
        education: Array<{ institution: string; degree: string }>;
        experience: Array<{ company: string; position: string }>;
        skills: string[];
        about: string;
        linkedin_url: string | null;
        github_url: string | null;
        resume: string | null;
        privacy_settings: {
            profile_visibility: 'public' | 'private' | 'registered';
            show_email: boolean;
            show_phone: boolean;
            show_education: boolean;
            show_experience: boolean;
        };
    };
    flash?: {
        success?: string;
        error?: string;
    };
    error?: string;
}

interface JobSeekerProfileForm {
    [key: string]: FormDataConvertible;
    name: string;
    email: string;
    phone: string;
    profile_picture: File | null;
    location: string;
    education: Array<{ institution: string; degree: string }>;
    experience: Array<{ company: string; position: string }>;
    skills: string[];
    about: string;
    linkedin_url: string;
    github_url: string;
    resume: File | null;
    privacy_settings: {
        profile_visibility: 'public' | 'private' | 'registered';
        show_email: boolean;
        show_phone: boolean;
        show_education: boolean;
        show_experience: boolean;
    };
}

export default function Edit({ profile, flash, error }: Props) {
    const [imageError, setImageError] = useState(false);
    const [imageSrc, setImageSrc] = useState(profile.profile_picture || '/profile-photos/default-avatar.png');
    
    useEffect(() => {
        if (!profile.profile_picture) {
            setImageSrc('/profile-photos/default-avatar.png');
            return;
        }

        const img = new Image();
        img.src = profile.profile_picture;
        
        img.onload = () => {
            setImageError(false);
            setImageSrc(profile.profile_picture || '/profile-photos/default-avatar.png');
        };
        
        img.onerror = () => {
            setImageError(true);
            setImageSrc('/profile-photos/default-avatar.png');
        };
        
        return () => {
            img.onload = null;
            img.onerror = null;
        };
    }, [profile.profile_picture]);

    const { data, setData, post, processing, errors, progress } = useForm<JobSeekerProfileForm>({
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        profile_picture: null,
        location: profile.location,
        education: profile.education || [],
        experience: profile.experience || [],
        skills: profile.skills || [],
        about: profile.about,
        linkedin_url: profile.linkedin_url || '',
        github_url: profile.github_url || '',
        resume: null,
        privacy_settings: profile.privacy_settings || {
            profile_visibility: 'public',
            show_email: false,
            show_phone: false,
            show_education: true,
            show_experience: true
        }
    });

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            const file = e.target.files[0];
            setData('profile_picture', file);
            setImageSrc(URL.createObjectURL(file));
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        router.put(route('jobseeker.profile.update'), data);
    };

    return (
        <div className="container mx-auto p-4">
            <Link href={route('jobseeker.profile.show')} className="btn btn-outline-secondary">
                        <i className="fas fa-home me-2"></i>
                        Back to Profile
                    </Link>
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
            
                <h1 className="text-2xl font-semibold mb-6">Edit Profile</h1>

                <form onSubmit={submit}>
                    <div className="space-y-6">
                        <div>
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                type="text"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                disabled={processing}
                                required
                                placeholder="Enter your full name"
                            />
                            <InputError message={errors.name} />
                        </div>

                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={e => setData('email', e.target.value)}
                                disabled={processing}
                                required
                                placeholder="Enter your email"
                            />
                            <InputError message={errors.email} />
                        </div>

                        <div>
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input
                                id="phone"
                                type="tel"
                                value={data.phone}
                                onChange={e => setData('phone', e.target.value)}
                                disabled={processing}
                                placeholder="+251 99 999 9999"
                            />
                            <InputError message={errors.phone} />
                        </div>

                        <div>
                            <Label htmlFor="profile_picture">Profile Photo</Label>
                            <div className="mt-2 flex items-center gap-4">
                                <img
                                    src={data.profile_picture instanceof File ? URL.createObjectURL(data.profile_picture) : imageSrc}
                                    alt="Profile"
                                    className="w-20 h-20 rounded-full object-cover"
                                />
                                <Input
                                    id="profile_picture"
                                    type="file"
                                    onChange={handlePhotoChange}
                                    accept="image/*"
                                    disabled={processing}
                                />
                                {progress && (
                                    <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-success transition-all duration-300"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                )}
                                <InputError message={errors.profile_picture} />
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="location">Location</Label>
                            <Input
                                id="location"
                                type="text"
                                value={data.location}
                                onChange={e => setData('location', e.target.value)}
                                disabled={processing}
                                required
                                placeholder="City, Country"
                            />
                            <InputError message={errors.location} />
                        </div>

                        <div>
                            <Label htmlFor="resume">Resume</Label>
                            {profile.resume && (
                                <div className="mb-2">
                                    <a
                                        href={profile.resume || '/default-avatar.png'}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline"
                                    >
                                        Current Resume
                                    </a>
                                </div>
                            )}
                            <Input
                                id="resume"
                                type="file"
                                onChange={e => setData('resume', e.target.files?.[0] || null)}
                                accept=".pdf,.doc,.docx"
                                disabled={processing}
                            />
                            <InputError message={errors.resume} />
                        </div>
                    </div>

                    <div className="space-y-6 mt-6">
                        <div>
                            <Label htmlFor="education">Education</Label>
                            <div className="space-y-2">
                                {data.education.map((edu, index) => (
                                    <div key={index} className="flex gap-2">
                                        <Input
                                            type="text"
                                            value={edu.institution}
                                            onChange={e => {
                                                const newEducation = [...data.education];
                                                newEducation[index] = { ...edu, institution: e.target.value };
                                                setData('education', newEducation);
                                            }}
                                            placeholder="Institution"
                                            disabled={processing}
                                        />
                                        <Input
                                            type="text"
                                            value={edu.degree}
                                            onChange={e => {
                                                const newEducation = [...data.education];
                                                newEducation[index] = { ...edu, degree: e.target.value };
                                                setData('education', newEducation);
                                            }}
                                            placeholder="Degree"
                                            disabled={processing}
                                        />
                                        <Button
                                            type="button"
                                            className='btn btn-outline-danger'
                                            onClick={() => {
                                                const newEducation = [...data.education];
                                                newEducation.splice(index, 1);
                                                setData('education', newEducation);
                                            }}
                                            disabled={processing}
                                        >
                                            Remove
                                        </Button>
                                    </div>
                                ))}
                                <Button
                                    type="button"
                                    className='btn btn-outline-secondary'
                                    onClick={() => setData('education', [...data.education, { institution: '', degree: '' }])}
                                    disabled={processing}
                                >
                                    Add Education
                                </Button>
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="experience">Experience</Label>
                            <div className="space-y-2">
                                {data.experience.map((exp, index) => (
                                    <div key={index} className="flex gap-2">
                                        <Input
                                            type="text"
                                            value={exp.company}
                                            onChange={e => {
                                                const newExperience = [...data.experience];
                                                newExperience[index] = { ...exp, company: e.target.value };
                                                setData('experience', newExperience);
                                            }}
                                            placeholder="Company"
                                            disabled={processing}
                                        />
                                        <Input
                                            type="text"
                                            value={exp.position}
                                            onChange={e => {
                                                const newExperience = [...data.experience];
                                                newExperience[index] = { ...exp, position: e.target.value };
                                                setData('experience', newExperience);
                                            }}
                                            placeholder="Position"
                                            disabled={processing}
                                        />
                                        <Button
                                            type="button"
                                            className='btn btn-outline-danger'
                                            onClick={() => {
                                                const newExperience = [...data.experience];
                                                newExperience.splice(index, 1);
                                                setData('experience', newExperience);
                                            }}
                                            disabled={processing}
                                        >
                                            Remove
                                        </Button>
                                    </div>
                                ))}
                                <Button
                                    type="button"
                                    className='btn btn-outline-secondary'
                                    onClick={() => setData('experience', [...data.experience, { company: '', position: '' }])}
                                    disabled={processing}
                                >
                                    Add Experience
                                </Button>
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="skills">Skills</Label>
                            <div className="space-y-2">
                                {data.skills.map((skill, index) => (
                                    <div key={index} className="flex gap-2">
                                        <Input
                                            type="text"
                                            value={skill}
                                            onChange={e => {
                                                const newSkills = [...data.skills];
                                                newSkills[index] = e.target.value;
                                                setData('skills', newSkills);
                                            }}
                                            placeholder="Skill"
                                            disabled={processing}
                                        />
                                        <Button
                                            type="button"
                                            className='btn btn-outline-danger'
                                            onClick={() => {
                                                const newSkills = [...data.skills];
                                                newSkills.splice(index, 1);
                                                setData('skills', newSkills);
                                            }}
                                            disabled={processing}
                                        >
                                            Remove
                                        </Button>
                                    </div>
                                ))}
                                <Button
                                    type="button"
                                    className='btn btn-outline-secondary'
                                    onClick={() => setData('skills', [...data.skills, ''])}
                                    disabled={processing}
                                >
                                    Add Skill
                                </Button>
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="linkedin_url">LinkedIn URL</Label>
                            <Input
                                id="linkedin_url"
                                type="url"
                                value={data.linkedin_url}
                                onChange={e => setData('linkedin_url', e.target.value)}
                                placeholder="https://linkedin.com/in/your-profile"
                                disabled={processing}
                            />
                            <InputError message={errors.linkedin_url} />
                        </div>

                        <div>
                            <Label htmlFor="github_url">GitHub URL</Label>
                            <Input
                                id="github_url"
                                type="url"
                                value={data.github_url}
                                onChange={e => setData('github_url', e.target.value)}
                                placeholder="https://github.com/your-username"
                                disabled={processing}
                            />
                            <InputError message={errors.github_url} />
                        </div>

                        <div className="bg-white shadow-sm rounded-lg border border-gray-200">
                            <div className="p-6">
                                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                                    Privacy Settings
                                </h3>
                                <div className="space-y-6">
                                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                                        <Label htmlFor="profile_visibility" className="text-sm font-medium text-gray-700 mb-2 block">
                                            Profile Visibility
                                        </Label>
                                        <select
                                            id="profile_visibility"
                                            className="w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                                            value={data.privacy_settings.profile_visibility}
                                            onChange={e => setData('privacy_settings', {
                                                ...data.privacy_settings,
                                                profile_visibility: e.target.value as 'public' | 'private' | 'registered'
                                            })}
                                            disabled={processing}
                                        >
                                            <option value="public">🌍 Public - Anyone can view</option>
                                            <option value="registered">👥 Registered Users Only</option>
                                            <option value="private">🔒 Private - Only when I apply</option>
                                        </select>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <label className="relative flex items-start p-4 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-50/80 transition-colors">
                                            <div className="flex items-center h-5">
                                                <input
                                                    type="checkbox"
                                                    className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                                                    checked={data.privacy_settings.show_email}
                                                    onChange={e => setData('privacy_settings', {
                                                        ...data.privacy_settings,
                                                        show_email: e.target.checked
                                                    })}
                                                    disabled={processing}
                                                />
                                            </div>
                                            <div className="ml-3">
                                                <span className="text-sm font-medium text-gray-900">Show Email</span>
                                                <p className="text-xs text-gray-500">Display your email to potential employers</p>
                                            </div>
                                        </label>

                                        <label className="relative flex items-start p-4 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-50/80 transition-colors">
                                            <div className="flex items-center h-5">
                                                <input
                                                    type="checkbox"
                                                    className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                                                    checked={data.privacy_settings.show_phone}
                                                    onChange={e => setData('privacy_settings', {
                                                        ...data.privacy_settings,
                                                        show_phone: e.target.checked
                                                    })}
                                                    disabled={processing}
                                                />
                                            </div>
                                            <div className="ml-3">
                                                <span className="text-sm font-medium text-gray-900">Show Phone Number</span>
                                                <p className="text-xs text-gray-500">Allow employers to contact you directly</p>
                                            </div>
                                        </label>

                                        <label className="relative flex items-start p-4 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-50/80 transition-colors">
                                            <div className="flex items-center h-5">
                                                <input
                                                    type="checkbox"
                                                    className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                                                    checked={data.privacy_settings.show_education}
                                                    onChange={e => setData('privacy_settings', {
                                                        ...data.privacy_settings,
                                                        show_education: e.target.checked
                                                    })}
                                                    disabled={processing}
                                                />
                                            </div>
                                            <div className="ml-3">
                                                <span className="text-sm font-medium text-gray-900">Show Education</span>
                                                <p className="text-xs text-gray-500">Display your educational background</p>
                                            </div>
                                        </label>

                                        <label className="relative flex items-start p-4 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-50/80 transition-colors">
                                            <div className="flex items-center h-5">
                                                <input
                                                    type="checkbox"
                                                    className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                                                    checked={data.privacy_settings.show_experience}
                                                    onChange={e => setData('privacy_settings', {
                                                        ...data.privacy_settings,
                                                        show_experience: e.target.checked
                                                    })}
                                                    disabled={processing}
                                                />
                                            </div>
                                            <div className="ml-3">
                                                <span className="text-sm font-medium text-gray-900">Show Experience</span>
                                                <p className="text-xs text-gray-500">Share your work history with employers</p>
                                            </div>
                                        </label>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-500 mt-4 italic">
                                    Note: Your name and location will always be visible to employers
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 mt-6">
                        <Button
                            type="button"
                            className='btn btn-outline-secondary'
                            onClick={() => router.visit(route('jobseeker.profile.show'))}
                            disabled={processing}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing} className='btn btn-outline-success'>
                            {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                            Save Changes
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}