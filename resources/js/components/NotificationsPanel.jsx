import React, { useState, useEffect } from 'react';
import { Transition } from '@headlessui/react';
import { BellIcon, CheckCircleIcon, XIcon } from '@heroicons/react/outline';
import axios from 'axios';
import moment from 'moment';

const NotificationsPanel = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000); // Refresh every 30 seconds
        return () => clearInterval(interval);
    }, []);

    const fetchNotifications = async () => {
        try {
            const [notificationsRes, countRes] = await Promise.all([
                axios.get('/notifications/latest'),
                axios.get('/notifications/unread-count')
            ]);
            setNotifications(notificationsRes.data.notifications);
            setUnreadCount(countRes.data.count);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    const markAsRead = async (id) => {
        try {
            await axios.post(`/notifications/${id}/mark-as-read`);
            fetchNotifications();
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await axios.post('/notifications/mark-all-read');
            fetchNotifications();
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
        }
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'App\\Notifications\\WelcomeNotification':
                return '👋';
            case 'App\\Notifications\\JobApplicationNotification':
                return '📝';
            case 'App\\Notifications\\InterviewInvitationNotification':
                return '📅';
            case 'App\\Notifications\\ProfileCompletedNotification':
                return '✅';
            default:
                return '🔔';
        }
    };

    const getNotificationColor = (type) => {
        switch (type) {
            case 'App\\Notifications\\WelcomeNotification':
                return 'bg-blue-50 border-blue-100';
            case 'App\\Notifications\\JobApplicationNotification':
                return 'bg-green-50 border-green-100';
            case 'App\\Notifications\\InterviewInvitationNotification':
                return 'bg-purple-50 border-purple-100';
            case 'App\\Notifications\\ProfileCompletedNotification':
                return 'bg-yellow-50 border-yellow-100';
            default:
                return 'bg-gray-50 border-gray-100';
        }
    };

    return (
        <div className="fixed left-0 top-1/2 -translate-y-1/2 z-50 flex">
            {/* Bell Icon with Badge */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-3 text-gray-600 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 bg-white rounded-r-lg shadow-lg hover:bg-gray-50 transition-colors duration-150"
            >
                <BellIcon className="h-6 w-6" />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                        {unreadCount}
                    </span>
                )}
            </button>

            {/* Notifications Panel */}
            <Transition
                show={isOpen}
                enter="transition ease-out duration-200"
                enterFrom="transform opacity-0 -translate-x-full"
                enterTo="transform opacity-100 translate-x-0"
                leave="transition ease-in duration-150"
                leaveFrom="transform opacity-100 translate-x-0"
                leaveTo="transform opacity-0 -translate-x-full"
            >
                <div className="w-80 bg-white shadow-xl border-r border-gray-200 h-[80vh] overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                        <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllAsRead}
                                className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                            >
                                Mark all as read
                            </button>
                        )}
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-4 text-center text-gray-500 flex flex-col items-center space-y-2">
                                <BellIcon className="h-8 w-8 text-gray-400" />
                                <p>No notifications</p>
                            </div>
                        ) : (
                            notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`p-4 border-b ${getNotificationColor(notification.type)} hover:bg-opacity-75 transition-colors duration-150`}
                                >
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 mr-3">
                                            <span className="text-2xl">
                                                {getNotificationIcon(notification.type)}
                                            </span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900">
                                                {notification.data.title || 'Notification'}
                                            </p>
                                            <p className="text-sm text-gray-600 line-clamp-2">
                                                {notification.data.message}
                                            </p>
                                            <p className="mt-1 text-xs text-gray-500">
                                                {moment(notification.created_at).fromNow()}
                                            </p>
                                        </div>
                                        {!notification.read_at && (
                                            <button
                                                onClick={() => markAsRead(notification.id)}
                                                className="ml-2 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 p-1 rounded-full transition-colors duration-150"
                                                title="Mark as read"
                                            >
                                                <CheckCircleIcon className="h-5 w-5" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="p-2 border-t border-gray-200 bg-gray-50">
                        <button
                            onClick={() => setIsOpen(false)}
                            className="w-full px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </Transition>
        </div>
    );
};

export default NotificationsPanel; 