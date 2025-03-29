import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import type { EmployerVerification } from '@/types/index';
import axios from 'axios';

interface Props {
    verifications: EmployerVerification[];
    error?: string;
}

export default function Verifications({ verifications, error }: Props) {
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

    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <AdminLayout>
            <Head title="Employer Verifications" />
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-6">Pending Employer Verifications</h1>

                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Company Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Contact Person
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Business Details
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Document
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {verifications.map((verification) => (
                                <tr key={verification.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">
                                            {verification.company_name}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-500">
                                            {verification.user.name}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-500">
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
                                            className="text-blue-600 hover:text-blue-900"
                                        >
                                            View Document
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button
                                            onClick={() => handleVerify(verification.id)}
                                            className="text-green-600 hover:text-green-900 mr-4"
                                        >
                                            Verify
                                        </button>
                                        <button
                                            onClick={() => setSelectedVerification(verification)}
                                            className="text-red-600 hover:text-red-900"
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
                        <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                            <div className="mt-3">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">
                                    Reject Verification
                                </h3>
                                <div className="mt-2">
                                    <textarea
                                        value={rejectionReason}
                                        onChange={(e) => setRejectionReason(e.target.value)}
                                        className="w-full px-3 py-2 border rounded-md"
                                        rows={4}
                                        placeholder="Enter rejection reason..."
                                    />
                                </div>
                                <div className="mt-4 flex justify-end space-x-3">
                                    <button
                                        onClick={() => setSelectedVerification(null)}
                                        className="px-4 py-2 text-gray-600 hover:text-gray-800"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => handleReject(selectedVerification.id)}
                                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
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