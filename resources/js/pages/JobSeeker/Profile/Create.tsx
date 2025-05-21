import React from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import  Textarea  from '@/components/TextArea';

interface JobSeekerProfileForm {
    [key: string]: any;
    name: string;
    email: string;
    phone: string;
    profile_picture: File | null;
    location: string;
    education: Array<{ institution: string; degree: string }>;
    experience_level: string;
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

export default function Create() {
    const { data, setData, post, processing, errors, progress } = useForm<JobSeekerProfileForm>({
        name: '',
        email: '',
        phone: '',
        profile_picture: null,
        location: '',
        education: [],
        experience_level: '',
        skills: [],
        about: '',
        linkedin_url: '',
        github_url: '',
        resume: null,
        privacy_settings: {
            profile_visibility: 'public',
            show_email: false,
            show_phone: false,
            show_education: true,
            show_experience: true
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('jobseeker.profile.store'), {
            onSuccess: () => {
                router.visit(route('jobseeker.profile.show'));
            }
        });
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            setData('profile_picture', e.target.files[0]);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <Head title="Complete Profile" />

            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div className="bg-white overflow-hidden shadow-sm rounded-lg">
                    <div className="p-8">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-gray-900">Welcome!</h2>
                            <p className="text-xl text-gray-600 mt-2">Complete Your Profile</p>
                            <p className="text-gray-500 mt-1">This information will help employers find you and understand your qualifications</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div>
                                        <Label htmlFor="profile_picture">Profile Photo</Label>
                                        <div className="mt-2">
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
                                        <Label htmlFor="name">Full Name</Label>
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
                                        <Label htmlFor="email">Email Address</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            onChange={e => setData('email', e.target.value)}
                                            disabled={processing}
                                            required
                                            placeholder="your.email@example.com"
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
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <Label htmlFor="about">About Me</Label>
                                        <Textarea
                                            id="about"
                                            value={data.about}
                                            onChange={e => setData('about', e.target.value)}
                                            disabled={processing}
                                            required
                                            placeholder="Write a brief introduction about yourself"
                                            className="h-32"
                                        />
                                        <InputError message={errors.about} />
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
                            </div>

                            <div className="space-y-6">
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
                                <Label htmlFor="experience_level">Experience Level</Label>
                                <select
                                    id="experience_level"
                                    value={data.experience_level}
                                    onChange={e => setData('experience_level', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                    disabled={processing}
                                    required
                                >
                                    <option value="">Select Experience Level</option>
                                    <option value="entry">Entry Level (0-2 years)</option>
                                    <option value="mid">Mid Level (3-5 years)</option>
                                    <option value="senior">Senior Level (6-10 years)</option>
                                    <option value="expert">Expert (10+ years)</option>
                                </select>
                                <InputError message={errors.experience_level} />
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
                                                    const newSkills = data.skills.filter((_, i) => i !== index);
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
                            </div>

                            <div>
                                <Label>Privacy Settings</Label>
                                <div className="space-y-4 mt-2">
                                    <div>
                                        <Label htmlFor="profile_visibility">Profile Visibility</Label>
                                        <select
                                            id="profile_visibility"
                                            value={data.privacy_settings.profile_visibility}
                                            onChange={e => setData('privacy_settings', {
                                                ...data.privacy_settings,
                                                profile_visibility: e.target.value as 'public' | 'private' | 'registered'
                                            })}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                            disabled={processing}
                                        >
                                            <option value="public">Public</option>
                                            <option value="private">Private</option>
                                            <option value="registered">Registered Users Only</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                id="show_email"
                                                checked={data.privacy_settings.show_email}
                                                onChange={e => setData('privacy_settings', {
                                                    ...data.privacy_settings,
                                                    show_email: e.target.checked
                                                })}
                                                className="rounded border-gray-300 text-green-600 shadow-sm focus:border-green-500 focus:ring-green-500"
                                                disabled={processing}
                                            />
                                            <Label htmlFor="show_email" className="ml-2">Show Email</Label>
                                        </div>
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                id="show_phone"
                                                checked={data.privacy_settings.show_phone}
                                                onChange={e => setData('privacy_settings', {
                                                    ...data.privacy_settings,
                                                    show_phone: e.target.checked
                                                })}
                                                className="rounded border-gray-300 text-green-600 shadow-sm focus:border-green-500 focus:ring-green-500"
                                                disabled={processing}
                                            />
                                            <Label htmlFor="show_phone" className="ml-2">Show Phone</Label>
                                        </div>
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                id="show_education"
                                                checked={data.privacy_settings.show_education}
                                                onChange={e => setData('privacy_settings', {
                                                    ...data.privacy_settings,
                                                    show_education: e.target.checked
                                                })}
                                                className="rounded border-gray-300 text-green-600 shadow-sm focus:border-green-500 focus:ring-green-500"
                                                disabled={processing}
                                            />
                                            <Label htmlFor="show_education" className="ml-2">Show Education</Label>
                                        </div>
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                id="show_experience"
                                                checked={data.privacy_settings.show_experience}
                                                onChange={e => setData('privacy_settings', {
                                                    ...data.privacy_settings,
                                                    show_experience: e.target.checked
                                                })}
                                                className="rounded border-gray-300 text-green-600 shadow-sm focus:border-green-500 focus:ring-green-500"
                                                disabled={processing}
                                            />
                                            <Label htmlFor="show_experience" className="ml-2">Show Experience</Label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-4">
                                <Button type="submit" disabled={processing} className='btn btn-outline-success'>
                                    {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                                    Save Profile
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
} 