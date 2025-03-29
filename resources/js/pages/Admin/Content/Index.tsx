import React from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import axios from 'axios';

interface Content {
    id: number;
    title: string;
    type: string;
    content: string;
    status: string;
    created_at: string;
    updated_at: string;
}

interface Props {
    contents: Content[];
    error?: string;
}

export default function ContentIndex({ contents, error }: Props) {
    const handleStatusUpdate = async (contentId: number, newStatus: string) => {
        try {
            await axios.patch(`/admin/content/${contentId}/status`, { status: newStatus });
            window.location.reload();
        } catch (error) {
            console.error('Failed to update content status:', error);
        }
    };

    const handleDelete = async (contentId: number) => {
        if (!confirm('Are you sure you want to delete this content? This action cannot be undone.')) {
            return;
        }

        try {
            await axios.delete(`/admin/content/${contentId}`);
            window.location.reload();
        } catch (error) {
            console.error('Failed to delete content:', error);
        }
    };

    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <AdminLayout>
            <Head title="Content Management" />
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Content Management</h1>
                    <div className="space-x-4">
                        <button
                            onClick={() => window.location.href = '/admin/content/career_resource/create'}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            Add Career Resource
                        </button>
                        <button
                            onClick={() => window.location.href = '/admin/content/blog_post/create'}
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                        >
                            Add Blog Post
                        </button>
                        <button
                            onClick={() => window.location.href = '/admin/content/faq/create'}
                            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
                        >
                            Add FAQ
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Title
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Type
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Created At
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {contents.map((content) => (
                                <tr key={content.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">
                                            {content.title}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-500">
                                            {content.type}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            content.status === 'published'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {content.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-500">
                                            {new Date(content.created_at).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-4">
                                        <button
                                            onClick={() => window.location.href = `/admin/content/${content.id}/edit`}
                                            className="text-indigo-600 hover:text-indigo-900"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleStatusUpdate(content.id, content.status === 'published' ? 'draft' : 'published')}
                                            className={`${
                                                content.status === 'published'
                                                    ? 'text-yellow-600 hover:text-yellow-900'
                                                    : 'text-green-600 hover:text-green-900'
                                            }`}
                                        >
                                            {content.status === 'published' ? 'Unpublish' : 'Publish'}
                                        </button>
                                        <button
                                            onClick={() => handleDelete(content.id)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
} 