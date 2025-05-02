import { Head } from '@inertiajs/react';
import { useState } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { PageProps } from '@/types/index';
import { router } from '@inertiajs/react';

interface Notification {
    id: string;
    type: string;
    data: {
        message: string;
        job_title?: string;
        company?: string;
        location?: string;
        type?: string;
        scheduled_at?: string;
    };
    read_at: string | null;
    created_at: string;
}

interface Props extends PageProps {
    alerts: {
        data: Notification[];
        current_page: number;
        last_page: number;
        total: number;
    };
}

export default function Notifications({ auth, alerts }: Props) {
    const [notifications, setNotifications] = useState<Notification[]>(alerts.data);
    const [currentPage, setCurrentPage] = useState(alerts.current_page);
    const [lastPage, setLastPage] = useState(alerts.last_page);

    const markAsRead = async (id: string) => {
        try {
            await axios.post(route('notifications.mark-as-read', { id }));
            setNotifications(notifications.map(notification => 
                notification.id === id 
                    ? { ...notification, read_at: new Date().toISOString() }
                    : notification
            ));
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const formatDate = (dateString: string) => {
        return format(new Date(dateString), 'MMM d, yyyy h:mm a');
    };

    const handlePageChange = (page: number) => {
        router.get(route('notifications.index'), { page }, {
            preserveState: true,
            onSuccess: (page) => {
                const typedPage = page as unknown as { props: Props };
                setNotifications(typedPage.props.alerts.data);
                setCurrentPage(typedPage.props.alerts.current_page);
                setLastPage(typedPage.props.alerts.last_page);
            }
        });
    };

    const Pagination = () => {
        const pages = [];
        const maxPagesToShow = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
        let endPage = Math.min(lastPage, startPage + maxPagesToShow - 1);

        if (endPage - startPage + 1 < maxPagesToShow) {
            startPage = Math.max(1, endPage - maxPagesToShow + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={`px-3 py-1 rounded-md ${
                        currentPage === i
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                >
                    {i}
                </button>
            );
        }

        return (
            <div className="flex justify-center items-center space-x-2 mt-4">
                <button
                    onClick={() => handlePageChange(1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 rounded-md bg-gray-200 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    First
                </button>
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 rounded-md bg-gray-200 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Previous
                </button>
                {startPage > 1 && (
                    <>
                        <button
                            onClick={() => handlePageChange(1)}
                            className="px-3 py-1 rounded-md bg-gray-200 text-gray-700"
                        >
                            1
                        </button>
                        {startPage > 2 && <span className="px-2">...</span>}
                    </>
                )}
                {pages}
                {endPage < lastPage && (
                    <>
                        {endPage < lastPage - 1 && <span className="px-2">...</span>}
                        <button
                            onClick={() => handlePageChange(lastPage)}
                            className="px-3 py-1 rounded-md bg-gray-200 text-gray-700"
                        >
                            {lastPage}
                        </button>
                    </>
                )}
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === lastPage}
                    className="px-3 py-1 rounded-md bg-gray-200 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Next
                </button>
                <button
                    onClick={() => handlePageChange(lastPage)}
                    disabled={currentPage === lastPage}
                    className="px-3 py-1 rounded-md bg-gray-200 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Last
                </button>
            </div>
        );
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Notifications</h2>}
        >
            <Head title="Notifications" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {notifications.length === 0 ? (
                                <p className="text-gray-500">No notifications yet</p>
                            ) : (
                                <>
                                    <div className="space-y-4">
                                        {notifications.map((notification) => (
                                            <div
                                                key={notification.id}
                                                className={`p-4 rounded-lg ${
                                                    notification.read_at ? 'bg-gray-50' : 'bg-blue-50'
                                                }`}
                                            >
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <p className="font-medium">
                                                            {notification.data.message}
                                                        </p>
                                                        {notification.data.job_title && (
                                                            <p className="text-sm text-gray-600">
                                                                Job: {notification.data.job_title}
                                                            </p>
                                                        )}
                                                        {notification.data.company && (
                                                            <p className="text-sm text-gray-600">
                                                                Company: {notification.data.company}
                                                            </p>
                                                        )}
                                                        {notification.data.scheduled_at && (
                                                            <p className="text-sm text-gray-600">
                                                                Scheduled: {formatDate(notification.data.scheduled_at)}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <span className="text-sm text-gray-500">
                                                            {formatDate(notification.created_at)}
                                                        </span>
                                                        {!notification.read_at && (
                                                            <button
                                                                onClick={() => markAsRead(notification.id)}
                                                                className="text-sm text-blue-600 hover:text-blue-800"
                                                            >
                                                                Mark as read
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <Pagination />
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 