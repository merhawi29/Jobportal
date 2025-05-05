import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import type { EmployerVerification } from '@/types/index';
import axios from 'axios';
import { useTheme } from '@/contexts/ThemeContext';

interface Props {
    verifications: EmployerVerification[];
    error?: string;
}

export default function Verifications({ verifications, error }: Props) {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [rejectionReason, setRejectionReason] = useState('');
    const [selectedVerification, setSelectedVerification] = useState<EmployerVerification | null>(null);

    const handleVerify = async (verificationId: number) => {
        try {
            await axios.post(`/admin/verifications/${verificationId}/verify`);
            window.location.reload();
        } catch (error) {
            console.error('Failed to verify employer:', error);
        }
    };

    const handleReject = async (verificationId: number) => {
        try {
            await axios.post(`/admin/verifications/${verificationId}/reject`, {
                rejection_reason: rejectionReason
            });
            setRejectionReason('');
            setSelectedVerification(null);
            window.location.reload();
        } catch (error) {
            console.error('Failed to reject verification:', error);
        }
    };

    const handleViewDocument = (verification: EmployerVerification) => {
        window.open(`/admin/verifications/${verification.id}/document`, '_blank');
    };

    if (error) return (
        <AdminLayout>
            <div className="text-red-500 p-6">{error}</div>
        </AdminLayout>
    );

    return (
        <AdminLayout>
            <Head title="Employer Verifications" />
            <div className="p-6">
                <h1 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>Pending Employer Verifications</h1>

                <div className={`rounded-lg shadow overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className={`${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                            <tr>
                                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
                                    Company Name
                                </th>
                                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
                                    Contact Person
                                </th>
                                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
                                    Business Details
                                </th>
                                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
                                    Document
                                </th>
                                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className={`${isDark ? 'bg-gray-800' : 'bg-white'} divide-y ${isDark ? 'divide-gray-700' : 'divide-gray-200'}`}>
                            {verifications.map((verification) => (
                                <tr key={verification.id} className={isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                            {verification.company_name}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
                                            {verification.user.name}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
                                            <div>Address: {verification.company_address}</div>
                                            {verification.business_registration_number && (
                                                <div>Reg. No: {verification.business_registration_number}</div>
                                            )}
                                            {verification.tax_id && (
                                                <div>Tax ID: {verification.tax_id}</div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <button
                                            onClick={() => handleViewDocument(verification)}
                                            className={`${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-900'}`}
                                        >
                                            View Document
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button
                                            onClick={() => handleVerify(verification.id)}
                                            className={`${isDark ? 'text-green-400 hover:text-green-300' : 'text-green-600 hover:text-green-900'} mr-4`}
                                        >
                                            Verify
                                        </button>
                                        <button
                                            onClick={() => setSelectedVerification(verification)}
                                            className={`${isDark ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-900'}`}
                                        >
                                            Reject
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Rejection Modal */}
                {selectedVerification && (
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
                        <div className={`relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                            <div className="mt-3">
                                <h3 className={`text-lg font-medium mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    Reject Verification
                                </h3>
                                <div className="mt-2">
                                    <textarea
                                        value={rejectionReason}
                                        onChange={(e) => setRejectionReason(e.target.value)}
                                        className={`w-full px-3 py-2 rounded-md ${
                                            isDark 
                                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                                            : 'border text-gray-900 placeholder-gray-500'
                                        }`}
                                        rows={4}
                                        placeholder="Enter rejection reason..."
                                    />
                                </div>
                                <div className="mt-4 flex justify-end space-x-3">
                                    <button
                                        onClick={() => setSelectedVerification(null)}
                                        className={`px-4 py-2 ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-800'}`}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => handleReject(selectedVerification.id)}
                                        className={`px-4 py-2 text-white rounded-md ${
                                            isDark ? 'bg-red-700 hover:bg-red-800' : 'bg-red-600 hover:bg-red-700'
                                        }`}
                                    >
                                        Reject
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
} 