export interface Auth {
    user: {
        id: number;
        name: string;
        email: string;
        role: string;
        profile_picture?: string | null;
    } | null;
}

export interface PageProps {
    auth: Auth;
    errors: Record<string, string>;
} 