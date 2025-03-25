import React from 'react';
import { Head, router } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';

interface Props {
    applications: {
        data: Array<{
            id: number;
            status: string;
            user: {
                name: string;
                email: string;
            };
            job: {
                title: string;
                company: string;
            };
            interviews: Array<{
                scheduled_at: string;
                type: string;
                status: string;
            }>;
        }>;
    };
    statuses: Record<string, string>;
}

export default function Applications({ applications, statuses }: Props) {
    const { data, setData, post, processing } = useForm({
        scheduled_at: '',
        location: '',
        type: 'video',
        notes: ''
    });

    const handleStatusChange = (applicationId: number, status: string) => {
        router.patch(route('applications.update-status', applicationId), {
            status
        });
    };

    const handleInterviewSubmit = (applicationId: number) => {
        post(route('interviews.store', applicationId));
    };

    return (
        <>
            <Head title="Manage Applications" />
            <div className="container mx-auto py-6">
                <h1 className="text-2xl font-bold mb-6">Manage Applications</h1>
                
                <div className="space-y-6">
                    {applications.data.map(application => (
                        <div key={application.id} className="bg-white rounded-lg shadow p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h2 className="text-xl font-semibold">{application.job.title}</h2>
                                    <p className="text-gray-600">{application.job.company}</p>
                                </div>
                                
                                <select
                                    value={application.status}
                                    onChange={(e) => handleStatusChange(application.id, e.target.value)}
                                    className="rounded border-gray-300"
                                >
                                    {Object.entries(statuses).map(([value, label]) => (
                                        <option key={value} value={value}>{label}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-4">
                                <h3 className="font-semibold mb-2">Applicant Information</h3>
                                <p>{application.user.name}</p>
                                <p>{application.user.email}</p>
                            </div>

                            {/* Interview Scheduling Form */}
                            <div className="border-t pt-4">
                                <h3 className="font-semibold mb-2">Schedule Interview</h3>
                                <form onSubmit={(e) => {
                                    e.preventDefault();
                                    handleInterviewSubmit(application.id);
                                }}>
                                    <div className="grid grid-cols-2 gap-4">
                                        <input
                                            type="datetime-local"
                                            value={data.scheduled_at}
                                            onChange={e => setData('scheduled_at', e.target.value)}
                                            className="rounded border-gray-300"
                                            required
                                        />
                                        
                                        <select
                                            value={data.type}
                                            onChange={e => setData('type', e.target.value)}
                                            className="rounded border-gray-300"
                                        >
                                            <option value="video">Video Call</option>
                                            <option value="phone">Phone Call</option>
                                            <option value="in_person">In Person</option>
                                        </select>
                                        
                                        <input
                                            type="text"
                                            placeholder="Location or Meeting Link"
                                            value={data.location}
                                            onChange={e => setData('location', e.target.value)}
                                            className="rounded border-gray-300"
                                            required
                                        />
                                        
                                        <textarea
                                            placeholder="Additional Notes"
                                            value={data.notes}
                                            onChange={e => setData('notes', e.target.value)}
                                            className="rounded border-gray-300"
                                        />
                                    </div>
                                    
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                    >
                                        Send Interview Invitation
                                    </button>
                                </form>
                            </div>

                            {/* Existing Interviews */}
                            {application.interviews.length > 0 && (
                                <div className="border-t mt-4 pt-4">
                                    <h3 className="font-semibold mb-2">Scheduled Interviews</h3>
                                    <div className="space-y-2">
                                        {application.interviews.map((interview, index) => (
                                            <div key={index} className="flex justify-between items-center">
                                                <div>
                                                    <p className="font-medium">
                                                        {new Date(interview.scheduled_at).toLocaleString()}
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        {interview.type} - {interview.status}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
} 