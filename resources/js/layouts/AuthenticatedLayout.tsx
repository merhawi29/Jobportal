import React from 'react';

interface Props {
    user: any;
    header: React.ReactNode;
    children: React.ReactNode;
}

export default function AuthenticatedLayout({ user, header, children }: Props) {
    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white border-b border-gray-100">
                {/* Add your navigation here */}
            </nav>

            {header && (
                <header className="bg-white shadow">
                    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main>{children}</main>
        </div>
    );
} 