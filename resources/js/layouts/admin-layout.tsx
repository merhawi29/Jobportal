import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import {
    LayoutDashboard,
    Users,
    Briefcase,
    FileText,
    Building2,
    CheckCircle2,
    Settings,
    Home,
    LogOut,
    Menu,
    X,
    FilePlus,
    ClipboardList,
} from 'lucide-react';

interface AdminLayoutProps {
    children: React.ReactNode;
}

const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { 
        name: 'Users', 
        href: '/admin/users', 
        icon: Users,
        subItems: [
            { name: 'Job Seekers', href: '/admin/users/job-seekers', icon: Users },
            { name: 'Employers', href: '/admin/users/employers', icon: Building2 },
        ]
    },
    { name: 'Jobs', href: '/admin/jobs', icon: Briefcase },
    { name: 'Applications', href: '/admin/applications', icon: ClipboardList },
    { name: 'Verifications', href: '/admin/verifications', icon: CheckCircle2 },
    { 
        name: 'Content', 
        href: '/admin/content', 
        icon: FileText,
        subItems: [
            { name: 'Create Blog Post', href: '/admin/content/blog_post/create', icon: FilePlus },
            { name: 'Create Career Resource', href: '/admin/content/career_resource/create', icon: FilePlus },
            { name: 'Create FAQ', href: '/admin/content/faq/create', icon: FilePlus },
        ]
    },
    { name: 'Reports', href: '/admin/reports/download', icon: FileText },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

    const toggleSubItems = (name: string) => {
        setExpandedItems(prev => ({
            ...prev,
            [name]: !prev[name]
        }));
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <div className="bg-white shadow">
                <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="flex-shrink-0 flex items-center">
                                {/* Mobile menu button */}
                                <button
                                    type="button"
                                    className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 mr-2"
                                    onClick={() => setSidebarOpen(!sidebarOpen)}
                                >
                                    <span className="sr-only">Open sidebar</span>
                                    {sidebarOpen ? (
                                        <X className="block h-6 w-6" aria-hidden="true" />
                                    ) : (
                                        <Menu className="block h-6 w-6" aria-hidden="true" />
                                    )}
                                </button>
                                <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Link
                                href="/"
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                            >
                                <Home className="w-4 h-4 mr-2" />
                                Back to Home
                            </Link>
                            <Link
                                href="/logout"
                                method="post"
                                as="button"
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                                <LogOut className="w-4 h-4 mr-2" />
                                Logout
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex">
                {/* Mobile sidebar backdrop */}
                {sidebarOpen && (
                    <div 
                        className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 md:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                {/* Sidebar */}
                <div className={`
                    fixed inset-y-0 left-0 z-50 w-64 bg-white transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0
                    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                    md:flex md:flex-col
                `}>
                    <div className="flex min-h-0 flex-1 flex-col border-r border-gray-200 bg-white">
                        <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
                            <nav className="mt-5 flex-1 space-y-1 bg-white px-2">
                                {navigation.map((item) => {
                                    const isActive = window.location.pathname === item.href;
                                    return (
                                        <div key={item.name}>
                                            <Link
                                                href={item.href}
                                                onClick={() => {
                                                    setSidebarOpen(false);
                                                    if (item.subItems) {
                                                        toggleSubItems(item.name);
                                                    }
                                                }}
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
                                                {item.subItems && (
                                                    <span className="ml-auto">
                                                        {expandedItems[item.name] ? '▼' : '▶'}
                                                    </span>
                                                )}
                                            </Link>
                                            {item.subItems && expandedItems[item.name] && (
                                                <div className="ml-4 space-y-1">
                                                    {item.subItems.map((subItem) => (
                                                        <Link
                                                            key={subItem.name}
                                                            href={subItem.href}
                                                            onClick={() => setSidebarOpen(false)}
                                                            className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                                        >
                                                            <subItem.icon
                                                                className="mr-3 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                                                                aria-hidden="true"
                                                            />
                                                            {subItem.name}
                                                        </Link>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
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