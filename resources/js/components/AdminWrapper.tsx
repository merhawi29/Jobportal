import React, { ReactNode } from 'react';
import { ThemeProvider } from '@/contexts/ThemeContext';

interface AdminWrapperProps {
    children: ReactNode;
}

export default function AdminWrapper({ children }: AdminWrapperProps) {
    return (
        <ThemeProvider>
            {children}
        </ThemeProvider>
    );
} 