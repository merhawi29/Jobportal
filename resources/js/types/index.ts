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
    company: string;
    location: string;
    type: string;
    salary_range: string;
    description: string;
    requirements: string;
    benefits: string;
    deadline: string;
    created_at: string;
    updated_at: string;
    user: {
        name: string;
        verified: boolean;
    };
}

export interface JobApplication {
    id: number;
    joblists_id: number;
    user_id: number;
    status: 'pending' | 'under_review' | 'shortlisted' | 'interview_scheduled' | 'interviewed' | 'hired' | 'rejected';
    interview_date?: string;
    interview_notes?: string;
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

export interface JobAlert {
    id: number;
    user_id: number;
    job_title?: string;
    job_type?: string;
    location?: string;
    salary_min?: number;
    salary_max?: number;
    keywords?: string[];
    notification_type: 'email' | 'push' | 'both';
    frequency: 'immediately' | 'daily' | 'weekly';
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export type PageProps<T extends Record<string, any> = Record<string, any>> = {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
            role: string;
        };
    };
    errors: Record<string, string>;
} & T;
