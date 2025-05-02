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
    blogPost: BlogPost;
}

export default function Show({ auth, blogPost }: Props) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">{blogPost.title}</h2>}
        >
            <Head title={blogPost.title} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="mb-4">
                                <h1 className="text-3xl font-bold mb-2">{blogPost.title}</h1>
                                <p className="text-gray-600">By {blogPost.author.name} • {new Date(blogPost.created_at).toLocaleDateString()}</p>
                            </div>
                            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: blogPost.content }} />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 