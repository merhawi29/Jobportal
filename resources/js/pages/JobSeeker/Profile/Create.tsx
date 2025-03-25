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
    photo: File | null;
    location: string;
    education: Array<{ institution: string; degree: string }>;
    experience: Array<{ company: string; position: string }>;
    skills: string[];
    about: string;
    linkedin_url: string;
    github_url: string;
    resume: File | null;
}

export default function Create() {
    const { data, setData, post, processing, errors, progress } = useForm<JobSeekerProfileForm>({
        name: '',
        email: '',
        phone: '',
        photo: null,
        location: '',
        education: [],
        experience: [],
        skills: [],
        about: '',
        linkedin_url: '',
        github_url: '',
        resume: null
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('jobseeker.profile.store'), {
            onSuccess: () => {
                router.visit(route('home'));
            }
        });
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            setData('photo', e.target.files[0]);
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
                                        <Label htmlFor="photo">Profile Photo</Label>
                                        <div className="mt-2">
                                            <Input
                                                id="photo"
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
                                            <InputError message={errors.photo} />
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