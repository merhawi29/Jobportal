import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { PageProps } from '@/types';

interface CareerResource {
    id: number;
    title: string;
    content: string;
    created_at: string;
    category: string;
}

interface Props extends PageProps {
    careerResource: CareerResource;
}

export default function Show({ auth, careerResource }: Props) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">{careerResource.title}</h2>}
        >
            <Head title={careerResource.title} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="mb-4">
                                <h1 className="text-3xl font-bold mb-2">{careerResource.title}</h1>
                                <div className="flex items-center text-gray-600">
                                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                        {careerResource.category}
                                    </span>
                                    <span className="ml-4">{new Date(careerResource.created_at).toLocaleDateString()}</span>
                                </div>
                            </div>
                            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: careerResource.content }} />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 