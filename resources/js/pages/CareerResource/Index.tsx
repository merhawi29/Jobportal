import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Link } from '@inertiajs/react';

interface CareerResource {
    id: number;
    title: string;
    content: string;
    created_at: string;
    category: string;
}

interface Props extends PageProps {
    auth: PageProps['auth'];
    careerResources: CareerResource[];
}

export default function CareerResourceIndex({ auth, careerResources }: Props) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Career Resources</h2>}
        >
            <Head title="Career Resources" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="space-y-6">
                                {careerResources.map((resource) => (
                                    <div key={resource.id} className="border-b border-gray-200 pb-4">
                                        <Link 
                                            href={route('career-resources.show', resource.id)}
                                            className="block hover:bg-gray-50 p-4 rounded-lg transition-colors"
                                        >
                                            <div className="flex items-center text-gray-600 mb-2">
                                                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                                    {resource.category}
                                                </span>
                                                <span className="ml-4">{new Date(resource.created_at).toLocaleDateString()}</span>
                                            </div>
                                            <h3 className="text-lg font-semibold text-gray-900">{resource.title}</h3>
                                            <div className="mt-2 text-sm text-gray-600 line-clamp-2" dangerouslySetInnerHTML={{ __html: resource.content }} />
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 