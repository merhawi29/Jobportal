import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import axios from 'axios';

export default function CreateJobSeeker() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        phone: '',
    });
    
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);

    // Reset animation class when success message changes
    useEffect(() => {
        if (successMessage) {
            setShowSuccessAnimation(true);
        } else {
            setShowSuccessAnimation(false);
        }
    }, [successMessage]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrors({});
        setSuccessMessage('');
        setShowSuccessAnimation(false);

        try {
            const response = await axios.post('/admin/api/users/job-seekers', formData);
            setSuccessMessage('Job seeker created successfully!');
            setFormData({
                name: '',
                email: '',
                password: '',
                password_confirmation: '',
                phone: '',
            });
            
            // Show success animation
            setShowSuccessAnimation(true);
            
            setTimeout(() => {
                window.location.href = '/admin/users/job-seekers';
            }, 2000);
        } catch (error: any) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else {
                setErrors({ general: 'An error occurred while creating the job seeker.' });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AdminLayout>
            <Head title="Add Job Seeker" />
            <style>
                {`
                @keyframes successFadeIn {
                    0% { opacity: 0; transform: translateY(-20px); }
                    100% { opacity: 1; transform: translateY(0); }
                }
                @keyframes successPulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                    100% { transform: scale(1); }
                }
                .success-anim-enter {
                    animation: successFadeIn 0.5s ease forwards, successPulse 1s ease 0.5s;
                }
                @keyframes buttonSuccess {
                    0% { background-color: rgb(22, 163, 74); transform: scale(1); }
                    50% { background-color: rgb(22, 163, 74); transform: scale(1.05); }
                    100% { background-color: rgb(22, 163, 74); transform: scale(1); }
                }
                .button-success {
                    animation: buttonSuccess 0.6s ease forwards;
                }
                `}
            </style>
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Add Job Seeker</h1>
                    <button 
                        onClick={() => window.location.href = '/admin/users/job-seekers'}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    >
                        Back to List
                    </button>
                </div>

                {successMessage && (
                    <div className={`bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 flex items-center ${showSuccessAnimation ? 'success-anim-enter' : ''}`}>
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="font-medium">{successMessage}</span>
                    </div>
                )}

                {errors.general && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {errors.general}
                    </div>
                )}

                <div className="bg-white rounded-lg shadow p-6">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border rounded-md ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                                required
                            />
                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                        </div>

                        <div className="mb-4">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border rounded-md ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                                required
                            />
                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                        </div>

                        <div className="mb-4">
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                                Phone
                            </label>
                            <input
                                type="text"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border rounded-md ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                        </div>

                        <div className="mb-4">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Password <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border rounded-md ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                                required
                            />
                            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                        </div>

                        <div className="mb-6">
                            <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 mb-1">
                                Confirm Password <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="password"
                                id="password_confirmation"
                                name="password_confirmation"
                                value={formData.password_confirmation}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border rounded-md ${errors.password_confirmation ? 'border-red-500' : 'border-gray-300'}`}
                                required
                            />
                            {errors.password_confirmation && <p className="text-red-500 text-xs mt-1">{errors.password_confirmation}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting || !!successMessage}
                            className={`w-full text-white py-2 px-4 rounded-md font-medium transition-all duration-200 
                                ${isSubmitting ? 'opacity-70 cursor-not-allowed bg-green-600' : ''}
                                ${successMessage ? 'bg-green-600 button-success' : 'bg-green-600 hover:bg-green-700'}`}
                        >
                            {isSubmitting ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Creating...
                                </span>
                            ) : successMessage ? (
                                <span className="flex items-center justify-center">
                                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    Created Successfully!
                                </span>
                            ) : 'Create Job Seeker'}
                        </button>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
} 