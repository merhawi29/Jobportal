import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import axios from 'axios';

interface Props {
    type: 'career_resource' | 'blog_post' | 'faq';
}

export default function Create({ type }: Props) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await axios.post('/admin/content', {
                title,
                content,
                type,
                status: 'draft'
            });

            window.location.href = '/admin/content';
        } catch (error) {
            setError('Failed to create content. Please try again.');
            setLoading(false);
        }
    };

    const getTypeLabel = () => {
        switch (type) {
            case 'career_resource':
                return 'Career Resource';
            case 'blog_post':
                return 'Blog Post';
            case 'faq':
                return 'FAQ';
            default:
                return type;
        }
    };

    return (
        <AdminLayout>
            <Head title={`Create ${getTypeLabel()}`} />
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Create {getTypeLabel()}</h1>
                    <button
                        onClick={() => window.location.href = '/admin/content'}
                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                    >
                        Back to Content
                    </button>
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
                    <div className="mb-4">
                        <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">
                            Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="content" className="block text-gray-700 text-sm font-bold mb-2">
                            Content
                        </label>
                        <textarea
                            id="content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            rows={15}
                            required
                        />
                        <p className="text-sm text-gray-500 mt-1">
                            You can use Markdown formatting in the content.
                        </p>
                    </div>

                    <div className="flex items-center justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ${
                                loading ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        >
                            {loading ? 'Creating...' : 'Create'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
} 