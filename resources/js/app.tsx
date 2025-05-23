import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { route as routeFn } from 'ziggy-js';
import { initializeTheme } from './hooks/use-appearance';
import AdminWrapper from './components/AdminWrapper';
import { ThemeProvider } from './contexts/ThemeContext';
import React, { useEffect } from 'react';
import axios from 'axios';

declare global {
    const route: typeof routeFn;
}

// Set CSRF token for all Axios requests to prevent 419 errors
const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;

// Track session activity to refresh tokens
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes in milliseconds
const LAST_ACTIVITY_KEY = 'last_user_activity';

// Function to refresh CSRF token
const refreshCSRFToken = async () => {
    try {
        const response = await axios.get('/csrf-token');
        const token = response.data.csrfToken;
        
        // Update token in Axios headers
        axios.defaults.headers.common['X-CSRF-TOKEN'] = token;
        
        // Update meta tag
        const metaTag = document.querySelector('meta[name="csrf-token"]');
        if (metaTag) {
            metaTag.setAttribute('content', token);
        }
        
        return token;
    } catch (error) {
        console.error('Failed to refresh CSRF token:', error);
        return null;
    }
};

// Check and refresh token if session may have expired
const checkAndRefreshToken = async () => {
    const lastActivity = sessionStorage.getItem(LAST_ACTIVITY_KEY);
    const now = Date.now();
    
    if (!lastActivity || (now - parseInt(lastActivity, 10)) > SESSION_TIMEOUT) {
        await refreshCSRFToken();
    }
    
    // Update last activity time
    sessionStorage.setItem(LAST_ACTIVITY_KEY, now.toString());
};

// Call this on app initialization
checkAndRefreshToken();

// Set event listeners to track user activity
document.addEventListener('click', () => {
    sessionStorage.setItem(LAST_ACTIVITY_KEY, Date.now().toString());
});

// Add interceptor to handle 419 CSRF token errors
axios.interceptors.response.use(
    response => response,
    error => {
        const status = error.response?.status;
        const originalRequest = error.config;
        
        // If we receive a 419 (CSRF token mismatch) and haven't retried yet
        if (status === 419 && !originalRequest._retry) {
            // Mark as retried to prevent infinite loops
            originalRequest._retry = true;
            
            return axios.get('/csrf-token')
                .then(response => {
                    // Update CSRF token in our headers and meta tag
                    const newToken = response.data.csrfToken;
                    axios.defaults.headers.common['X-CSRF-TOKEN'] = newToken;
                    
                    // Update meta tag
                    const metaToken = document.querySelector('meta[name="csrf-token"]');
                    if (metaToken) {
                        metaToken.setAttribute('content', newToken);
                    }
                    
                    // Retry the original request with the new token
                    return axios(originalRequest);
                })
                .catch(refreshError => {
                    console.error('Failed to refresh CSRF token:', refreshError);
                    // If we fail to refresh the token, reload the page as a fallback
                    window.location.reload();
                    return Promise.reject(error);
                });
        }
        
        // If CSRF error persists after retry, reload the page
        if (status === 419 && originalRequest._retry) {
            console.error('Persistent CSRF token issue - reloading page');
            window.location.reload();
        }
        
        return Promise.reject(error);
    }
);

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
        
        // Wrapper component to handle CSRF token refresh
        const AppWithTokenRefresh = () => {
            useEffect(() => {
                // Refresh token when component mounts if needed
                checkAndRefreshToken();
                
                // Set up interval to periodically check token
                const intervalId = setInterval(checkAndRefreshToken, 5 * 60 * 1000); // Every 5 minutes
                
                return () => clearInterval(intervalId);
            }, []);
            
            return <App {...props} />;
        };
        
        if (isAdminPage || isModeratorPage) {
            root.render(
                <AdminWrapper>
                    <AppWithTokenRefresh />
                </AdminWrapper>
            );
        } else {
            root.render(
                <ThemeProvider>
                    <AppWithTokenRefresh />
                </ThemeProvider>
            );
        }
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();
