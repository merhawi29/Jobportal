import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    url: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    role: string;
}

export interface Activity {
    id: number;
    log_name: string;
    description: string;
    subject_type: string | null;
    subject_id: number | null;
    causer_type: string | null;
    causer_id: number | null;
    properties: Record<string, any> | null;
    event: string | null;
    batch_uuid: string | null;
    created_at: string;
    updated_at: string;
    causer?: {
        id: number;
        name: string;
    } | null;
    subject?: {
        id: number;
        [key: string]: any;
    } | null;
}

export interface Job {
    id: number;
    title: string;
    description: string;
    company: string;
    location: string;
    salary_range: string;
    type: string;
    requirements: string;
    benefits: string;
    deadline: string;
    status: 'pending' | 'approved' | 'rejected';
    created_at: string;
    updated_at: string;
    applications_count?: number;
    user_id: number;
    user?: {
        name: string;
    };
}

export interface JobApplication {
    id: number;
    job_id: number;
    user_id: number;
    status: 'pending' | 'accepted' | 'rejected';
    created_at: string;
    updated_at: string;
    job: Job;
    user: User;
}

export interface Pagination<T> {
    current_page: number;
    data: T[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
}
