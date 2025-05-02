import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { PageProps } from '@/types';

interface FAQ {
    id: number;
    question: string;
    answer: string;
    category: string;
    created_at: string;
}

interface Props extends PageProps {
    auth: PageProps['auth'];
    faq: FAQ;
}

export default function Show({ auth, faq }: Props) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">FAQ</h2>}
        >
            <Head title={faq.question} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="mb-4">
                                <div className="flex items-center text-gray-600 mb-2">
                                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                        {faq.category}
                                    </span>
                                    <span className="ml-4">{new Date(faq.created_at).toLocaleDateString()}</span>
                                </div>
                                <h1 className="text-2xl font-bold mb-4">{faq.question}</h1>
                            </div>
                            <div className="prose max-w-none">
                                <p>{faq.answer}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 