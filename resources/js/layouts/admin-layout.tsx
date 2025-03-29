import React from 'react';
import { Link } from '@inertiajs/react';
import {
    LayoutDashboard,
    Users,
    Briefcase,
    FileText,
    Building2,
    CheckCircle2,
    Settings,
} from 'lucide-react';

interface AdminLayoutProps {
    children: React.ReactNode;
}

const navigation = [
    { name: 'Dashboard', href: '/admin/', icon: LayoutDashboard },
    { name: 'Job Seekers', href: '/admin/users/job-seekers', icon: Users },
    { name: 'Employers', href: '/admin/users/employers', icon: Building2 },
    { name: 'Verifications', href: '/admin/verifications', icon: CheckCircle2 },
    { name: 'Jobs', href: '/admin/jobs', icon: Briefcase },
    { name: 'Content', href: '/admin/content', icon: FileText },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
    return (
        <div className="min-h-screen bg-gray-100">
            <div className="flex">
                {/* Sidebar */}
                <div className="hidden md:flex md:w-64 md:flex-col">
                    <div className="flex min-h-0 flex-1 flex-col border-r border-gray-200 bg-white">
                        <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
                            <div className="flex flex-shrink-0 items-center px-4">
                                <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
                            </div>
                            <nav className="mt-5 flex-1 space-y-1 bg-white px-2">
                                {navigation.map((item) => {
                                    const isActive = window.location.pathname === item.href;
                                    return (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                                                isActive
                                                    ? 'bg-gray-100 text-gray-900'
                                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                            }`}
                                        >
                                            <item.icon
                                                className={`mr-3 h-6 w-6 flex-shrink-0 ${
                                                    isActive
                                                        ? 'text-gray-500'
                                                        : 'text-gray-400 group-hover:text-gray-500'
                                                }`}
                                                aria-hidden="true"
                                            />
                                            {item.name}
                                        </Link>
                                    );
                                })}
                            </nav>
                        </div>
                    </div>
                </div>

                {/* Main content */}
                <div className="flex flex-1 flex-col">
                    <main className="flex-1">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
} 