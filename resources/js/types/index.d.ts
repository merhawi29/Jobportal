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

export interface PageProps {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
            role: string;
            profile_picture?: string | null;
        } | null;
    };
    errors: Record<string, string>;
} 