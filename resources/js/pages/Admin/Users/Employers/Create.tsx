import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import axios from 'axios';
import { useTheme } from '@/contexts/ThemeContext';

export default function CreateEmployer() {
    const { theme } = useTheme();
    const isDarkMode = theme === 'dark';
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        phone: '',
        company_name: '',
        company_website: '',
        industry: '',
        company_size: '1-10',
        company_description: '',
        location: '',
        country: '',
    });
    
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);

    // Reset animation class when success message changes
    React.useEffect(() => {
        if (successMessage) {
            setShowSuccessAnimation(true);
        } else {
            setShowSuccessAnimation(false);
        }
    }, [successMessage]);

    const companySizes = [
        '1-10',
        '11-50',
        '51-200',
        '201-500',
        '501-1000',
        '1001-5000',
        '5001-10000',
        '10000+'
    ];

    const industries = [
        'Technology',
        'Healthcare',
        'Finance',
        'Education',
        'Manufacturing',
        'Retail',
        'Hospitality',
        'Construction',
        'Agriculture',
        'Transportation',
        'Media',
        'Entertainment',
        'Government',
        'Nonprofit',
        'Other'
    ];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
            const response = await axios.post('/admin/api/users/employers', formData);
            setSuccessMessage('Employer created successfully!');
            setFormData({
                name: '',
                email: '',
                password: '',
                password_confirmation: '',
                phone: '',
                company_name: '',
                company_website: '',
                industry: '',
                company_size: '1-10',
                company_description: '',
                location: '',
                country: '',
            });
            
            // Show success animation
            setShowSuccessAnimation(true);
            
            setTimeout(() => {
                window.location.href = '/admin/users/employers';
            }, 2000);
        } catch (error: any) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else {
                setErrors({ general: 'An error occurred while creating the employer.' });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AdminLayout>
            <Head title="Add Employer" />
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
            <div className={`p-6 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Add Employer</h1>
                    <button 
                        onClick={() => window.location.href = '/admin/users/employers'}
                        className={`px-4 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 ${
                            isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-500 hover:bg-gray-600 text-white'
                        }`}
                    >
                        Back to List
                    </button>
                </div>

                {successMessage && (
                    <div className={`${isDarkMode ? 'bg-green-900 border-green-700 text-green-100' : 'bg-green-100 border-green-400 text-green-700'} border px-4 py-3 rounded mb-4 flex items-center ${showSuccessAnimation ? 'success-anim-enter' : ''}`}>
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="font-medium">{successMessage}</span>
                    </div>
                )}

                {errors.general && (
                    <div className={`${isDarkMode ? 'bg-red-900 border-red-700 text-red-100' : 'bg-red-100 border-red-400 text-red-700'} border px-4 py-3 rounded mb-4`}>
                        {errors.general}
                    </div>
                )}

                <div className={`rounded-lg shadow p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h2 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Account Information</h2>
                                
                                <div className="mb-4">
                                    <label htmlFor="name" className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Full Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className={`w-full px-3 py-2 border rounded-md ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} ${errors.name ? 'border-red-500' : ''}`}
                                        required
                                    />
                                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="email" className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Email <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className={`w-full px-3 py-2 border rounded-md ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} ${errors.email ? 'border-red-500' : ''}`}
                                        required
                                    />
                                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="phone" className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Phone
                                    </label>
                                    <input
                                        type="text"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className={`w-full px-3 py-2 border rounded-md ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} ${errors.phone ? 'border-red-500' : ''}`}
                                    />
                                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="password" className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Password <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className={`w-full px-3 py-2 border rounded-md ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} ${errors.password ? 'border-red-500' : ''}`}
                                        required
                                    />
                                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="password_confirmation" className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Confirm Password <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="password"
                                        id="password_confirmation"
                                        name="password_confirmation"
                                        value={formData.password_confirmation}
                                        onChange={handleChange}
                                        className={`w-full px-3 py-2 border rounded-md ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} ${errors.password_confirmation ? 'border-red-500' : ''}`}
                                        required
                                    />
                                    {errors.password_confirmation && <p className="text-red-500 text-xs mt-1">{errors.password_confirmation}</p>}
                                </div>
                            </div>

                            <div>
                                <h2 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Company Information</h2>
                                
                                <div className="mb-4">
                                    <label htmlFor="company_name" className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Company Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="company_name"
                                        name="company_name"
                                        value={formData.company_name}
                                        onChange={handleChange}
                                        className={`w-full px-3 py-2 border rounded-md ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} ${errors.company_name ? 'border-red-500' : ''}`}
                                        required
                                    />
                                    {errors.company_name && <p className="text-red-500 text-xs mt-1">{errors.company_name}</p>}
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="company_website" className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Company Website
                                    </label>
                                    <input
                                        type="url"
                                        id="company_website"
                                        name="company_website"
                                        value={formData.company_website}
                                        onChange={handleChange}
                                        className={`w-full px-3 py-2 border rounded-md ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} ${errors.company_website ? 'border-red-500' : ''}`}
                                        placeholder="https://example.com"
                                    />
                                    {errors.company_website && <p className="text-red-500 text-xs mt-1">{errors.company_website}</p>}
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="industry" className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Industry <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        id="industry"
                                        name="industry"
                                        value={formData.industry}
                                        onChange={handleChange}
                                        className={`w-full px-3 py-2 border rounded-md ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} ${errors.industry ? 'border-red-500' : ''}`}
                                        required
                                    >
                                        <option value="">Select an industry</option>
                                        {industries.map(industry => (
                                            <option key={industry} value={industry}>{industry}</option>
                                        ))}
                                    </select>
                                    {errors.industry && <p className="text-red-500 text-xs mt-1">{errors.industry}</p>}
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="company_size" className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Company Size <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        id="company_size"
                                        name="company_size"
                                        value={formData.company_size}
                                        onChange={handleChange}
                                        className={`w-full px-3 py-2 border rounded-md ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} ${errors.company_size ? 'border-red-500' : ''}`}
                                        required
                                    >
                                        {companySizes.map(size => (
                                            <option key={size} value={size}>{size} employees</option>
                                        ))}
                                    </select>
                                    {errors.company_size && <p className="text-red-500 text-xs mt-1">{errors.company_size}</p>}
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="location" className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Location
                                    </label>
                                    <input
                                        type="text"
                                        id="location"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        className={`w-full px-3 py-2 border rounded-md ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} ${errors.location ? 'border-red-500' : ''}`}
                                        placeholder="City, State"
                                    />
                                    {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="country" className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Country
                                    </label>
                                    <input
                                        type="text"
                                        id="country"
                                        name="country"
                                        value={formData.country}
                                        onChange={handleChange}
                                        className={`w-full px-3 py-2 border rounded-md ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} ${errors.country ? 'border-red-500' : ''}`}
                                    />
                                    {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country}</p>}
                                </div>
                            </div>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="company_description" className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                Company Description <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                id="company_description"
                                name="company_description"
                                value={formData.company_description}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border rounded-md ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} ${errors.company_description ? 'border-red-500' : ''}`}
                                rows={4}
                                required
                            />
                            {errors.company_description && <p className="text-red-500 text-xs mt-1">{errors.company_description}</p>}
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
                            ) : 'Create Employer'}
                        </button>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
} 