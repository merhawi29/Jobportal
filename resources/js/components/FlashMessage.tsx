import React, { useEffect, useState } from 'react';
import { usePage } from '@inertiajs/react';

interface PageProps {
    flash: {
        success?: string;
        error?: string;
    };
}

export default function FlashMessage() {
    const [visible, setVisible] = useState(true);
    const { flash } = usePage().props as unknown as PageProps;
    
    useEffect(() => {
        if (flash?.success || flash?.error) {
            setVisible(true);
            const timer = setTimeout(() => {
                setVisible(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    if (!visible || (!flash?.success && !flash?.error)) {
        return null;
    }

    const getAlertClass = () => {
        if (flash?.success) return 'alert-success';
        if (flash?.error) return 'alert-danger';
        return 'alert-info';
    };

    return (
        <div 
            className={`alert ${getAlertClass()} alert-dismissible fade show position-fixed top-0 end-0 m-4`}
            style={{ zIndex: 1050 }}
            role="alert"
        >
            {flash?.success || flash?.error}
            <button 
                type="button" 
                className="btn-close" 
                onClick={() => setVisible(false)}
                aria-label="Close"
            ></button>
        </div>
    );
} 