import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, Lock } from 'lucide-react';

interface ProfileData {
    name: string;
    email: string;
    phone: string | null;
    profile_picture: string | null;
    location: string;
    education: Array<{ institution: string; degree: string }>;
    experience: Array<{ company: string; position: string }>;
    experience_level?: string;
    experience_years?: number;
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
}

interface Props {
    profile: ProfileData;
    isOwnProfile: boolean;
    flash?: {
        success?: string;
        error?: string;
    };
    error?: string;
}

export default function Show({ profile, isOwnProfile, flash, error }: Props) {
    const [imageError, setImageError] = useState(false);
    const [imageSrc, setImageSrc] = useState(profile.profile_picture || '/assets/img/logo/testimonial.png');
    
    useEffect(() => {
        if (!profile.profile_picture) {
            setImageSrc('/assets/img/logo/testimonial.png');
            return;
        }

        const img = new Image();
        img.src = profile.profile_picture;
        
        img.onload = () => {
            setImageError(false);
            setImageSrc(profile.profile_picture || '/assets/img/logo/testimonial.png');
        };
        
        img.onerror = () => {
            setImageError(true);
            setImageSrc('/assets/img/logo/testimonial.png');
        };
        
        return () => {
            img.onload = null;
            img.onerror = null;
        };
    }, [profile.profile_picture]);
    
    const PrivacyIndicator = ({ isVisible }: { isVisible: boolean }) => (
        <span className="inline-flex items-center text-sm text-gray-500 ml-2">
            {isVisible ? (
                <Eye className="w-4 h-4 mr-1" />
            ) : (
                <EyeOff className="w-4 h-4 mr-1" />
            )}
            {isVisible ? 'Visible' : 'Hidden'}
        </span>
    );

    // Function to get a formatted display of experience
    const getExperienceDisplay = () => {
        // If we have the new experience level and years, show them prominently
        if (profile.experience_level) {
            return (
                <div className="border-b last:border-0 pb-4 last:pb-0">
                    <h4 className="font-semibold">{getExperienceLevelName(profile.experience_level)}</h4>
                    <p className="text-gray-600">{profile.experience_years} years of experience</p>
                </div>
            );
        }
        
        // Otherwise, fall back to the array of experience items
        if (Array.isArray(profile.experience) && profile.experience.length > 0) {
            return profile.experience.map((exp, index) => (
                <div key={index} className="border-b last:border-0 pb-4 last:pb-0">
                    <h4 className="font-semibold">{exp.company}</h4>
                    <p className="text-gray-600">{exp.position}</p>
                </div>
            ));
        }
        
        return <p className="text-gray-500">No experience listed</p>;
    };

    // Function to convert experience_level code to display name
    const getExperienceLevelName = (level: string): string => {
        switch (level) {
            case 'entry':
                return 'Entry Level';
            case 'mid':
                return 'Mid Level';
            case 'senior':
                return 'Senior Level';
            case 'expert':
                return 'Expert Level';
            default:
                return level;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <Head title="Profile" />

            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                {flash?.success && (
                    <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
                        {flash?.success}
                    </div>
                )}
                {(flash?.error || error) && (
                    <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                        {flash?.error || error}
                    </div>
                )}

                <div className="mb-6 flex justify-between items-center">
                    <Link href={'/'} className="btn btn-outline-secondary">
                        <i className="fas fa-home me-2"></i>
                        Back to Home
                    </Link>

                    {isOwnProfile && (
                        <Link
                            href={route('jobseeker.profile.edit')}
                            className="inline-flex items-center px-4 py-2 btn btn-outline-success text-black rounded-md "
                        >
                            Edit Profile
                        </Link>
                    )}
                </div>

                <div className="bg-gradient-to-br from-green-50 to-white overflow-hidden shadow-sm rounded-lg">
                    <div className="p-8">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h2 className="text-3xl font-bold text-gray-900">Profile</h2>
                                <div className="flex items-center mt-2">
                                    <span className="text-sm text-gray-500 flex items-center">
                                        <Lock className="w-4 h-4 mr-1" />
                                        Visibility: {profile.privacy_settings.profile_visibility}
                                    </span>
                                </div>
                            </div>
                            {/* {isOwnProfile && (
                                <Button asChild>
                                    <Link href={route('jobseeker.profile.edit')}>Edit Profile</Link>
                                </Button>
                            )} */}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Personal Information</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="mb-4">
                                            <img
                                                src={imageSrc}
                                                alt={`${profile.name}'s avatar`}
                                                className="w-32 h-32 rounded-full object-cover border-4 border-green-100 mx-auto"
                                            />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold">Name</h4>
                                            <p>{profile.name}</p>
                                        </div>
                                        {(isOwnProfile || profile.privacy_settings.show_email) && (
                                            <div>
                                                <h4 className="font-semibold flex items-center">
                                                    Email
                                                    {isOwnProfile && <PrivacyIndicator isVisible={profile.privacy_settings.show_email} />}
                                                </h4>
                                                <p>{profile.email}</p>
                                            </div>
                                        )}
                                        {(isOwnProfile || profile.privacy_settings.show_phone) && profile.phone && (
                                            <div>
                                                <h4 className="font-semibold flex items-center">
                                                    Phone
                                                    {isOwnProfile && <PrivacyIndicator isVisible={profile.privacy_settings.show_phone} />}
                                                </h4>
                                                <p>{profile.phone}</p>
                                            </div>
                                        )}
                                        <div>
                                            <h4 className="font-semibold">Location</h4>
                                            <p>{profile.location}</p>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Links</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {profile.linkedin_url && (
                                            <a
                                                href={profile.linkedin_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:underline block"
                                            >
                                                LinkedIn Profile
                                            </a>
                                        )}
                                        {profile.github_url && (
                                            <a
                                                href={profile.github_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:underline block"
                                            >
                                                GitHub Profile
                                            </a>
                                        )}
                                        {profile.resume && (
                                            <a
                                                href={profile.resume}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:underline block"
                                            >
                                                View Resume
                                            </a>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>About Me</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="whitespace-pre-wrap">{profile.about}</p>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Skills</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex flex-wrap gap-2">
                                            {profile.skills && profile.skills.length > 0 ? (
                                                profile.skills.map((skill, index) => (
                                                    <span
                                                        key={index}
                                                        className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                                                    >
                                                        {skill}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-gray-500">No skills listed</span>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="space-y-6">
                                {(isOwnProfile || profile.privacy_settings.show_education) && (
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center">
                                                Education
                                                {isOwnProfile && <PrivacyIndicator isVisible={profile.privacy_settings.show_education} />}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-4">
                                                {profile.education && profile.education.length > 0 ? (
                                                    profile.education.map((edu, index) => (
                                                        <div key={index} className="border-b last:border-0 pb-4 last:pb-0">
                                                            <h4 className="font-semibold">{edu.institution}</h4>
                                                            <p className="text-gray-600">{edu.degree}</p>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <span className="text-gray-500">No education history listed</span>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}

                                {(isOwnProfile || profile.privacy_settings.show_experience) && (
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center">
                                                Experience
                                                {isOwnProfile && <PrivacyIndicator isVisible={profile.privacy_settings.show_experience} />}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-4">
                                                {getExperienceDisplay()}
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 