import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { route as routeFn } from 'ziggy-js';
import { initializeTheme } from './hooks/use-appearance';
import AdminWrapper from './components/AdminWrapper';
import React from 'react';

declare global {
    const route: typeof routeFn;
}

const appName = import.meta.env.VITE_APP_NAME || 'Job-Portal';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);
        
        // Check if this is an admin or moderator page
        const componentPath = props.initialPage?.component?.toString() || '';
        const isAdminPage = componentPath.includes('Admin/');
        const isModeratorPage = componentPath.includes('Moderator/');
        
        if (isAdminPage || isModeratorPage) {
            root.render(
                <AdminWrapper>
                    <App {...props} />
                </AdminWrapper>
            );
        } else {
            root.render(<App {...props} />);
        }
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();
