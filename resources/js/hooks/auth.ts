import { useState } from 'react';
import axios from 'axios';

interface User {
    id: number;
    name: string;
    email: string;
}

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);

    const getUser = async () => {
        try {
            const response = await axios.get('/api/user');
            setUser(response.data);
        } catch (error) {
            setUser(null);
        }
    };

    return {
        user,
        getUser
    };
}
