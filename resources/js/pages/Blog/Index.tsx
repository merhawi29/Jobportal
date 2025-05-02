import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { PageProps } from '@/types';

interface BlogPost {
    id: number;
    title: string;
    content: string;
    created_at: string;
    author: {
        name: string;
    };
}

interface Props extends PageProps {
    blogPosts: BlogPost[];
}

export default function Index({ auth, blogPosts }: Props) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Blog Posts</h2>}
        >
            <Head title="Blog Posts" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="mb-6">
                                <a href="/" className="text-blue-600 hover:text-blue-800 flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                                    </svg>
                                    Back to Home
                                </a>
                            </div>
                            <h1 className="text-3xl font-bold mb-8">Latest Blog Posts</h1>
                            
                            {blogPosts.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {blogPosts.map((post) => (
                                        <div key={post.id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                            <div className="p-6">
                                                <h2 className="text-xl font-semibold mb-2">
                                                    <a href={`/blog/${post.id}`} className="text-blue-600 hover:text-blue-800">
                                                        {post.title}
                                                    </a>
                                                </h2>
                                                <p className="text-gray-600 mb-4">
                                                    By {post.author?.name || 'Unknown Author'} • {new Date(post.created_at).toLocaleDateString()}
                                                </p>
                                                <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: post.content.substring(0, 200) + '...' }} />
                                                <a href={`/blog/${post.id}`} className="text-blue-600 hover:text-blue-800 mt-4 inline-block">
                                                    Read more →
                                                </a>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-gray-600">No blog posts available yet.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 