import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Link } from '@inertiajs/react';

interface FAQ {
    id: number;
    question: string;
    answer: string;
    category: string;
    created_at: string;
}

interface Props extends PageProps {
    auth: PageProps['auth'];
    faqs: FAQ[];
}

export default function FAQIndex({ auth, faqs }: Props) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Frequently Asked Questions</h2>}
        >
            <Head title="FAQ" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="space-y-6">
                                {faqs.map((faq) => (
                                    <div key={faq.id} className="border-b border-gray-200 pb-4">
                                        <Link 
                                            href={route('faqs.show', faq.id)}
                                            className="block hover:bg-gray-50 p-4 rounded-lg transition-colors"
                                        >
                                            <div className="flex items-center text-gray-600 mb-2">
                                                <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                                    {faq.category}
                                                </span>
                                                <span className="ml-4">{new Date(faq.created_at).toLocaleDateString()}</span>
                                            </div>
                                            <h3 className="text-lg font-semibold text-gray-900">{faq.question}</h3>
                                            <p className="mt-2 text-sm text-gray-600 line-clamp-2">{faq.answer}</p>
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