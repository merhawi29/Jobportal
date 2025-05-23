import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import axios from 'axios';

interface Notification {
  id: string;
  type: string;
  data: {
    message: string;
    title?: string;
    type?: string;
    created_at?: string;
  };
  read_at: string | null;
  created_at: string;
}

export default function NotificationDropdown() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch notifications on component mount
  useEffect(() => {
    fetchNotifications();
    
    // Set up polling to check for new notifications
    const intervalId = setInterval(fetchUnreadCount, 60000); // Every minute
    
    return () => clearInterval(intervalId);
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await axios.get(route('notifications.latest'));
      setNotifications(response.data.notifications);
      setUnreadCount(response.data.unread_count);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const response = await axios.get(route('notifications.unread-count'));
      setUnreadCount(response.data.count);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.post(route('notifications.mark-all-read'));
      setNotifications(notifications.map(notification => ({
        ...notification,
        read_at: notification.read_at || new Date().toISOString()
      })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking notifications as read:', error);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await axios.post(route('notifications.mark-as-read', id));
      setNotifications(notifications.map(notification => 
        notification.id === id 
          ? { ...notification, read_at: new Date().toISOString() } 
          : notification
      ));
      setUnreadCount(Math.max(0, unreadCount - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-9 w-9">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[350px]" align="end">
        <div className="flex items-center justify-between px-4 py-2">
          <h5 className="font-medium">Notifications</h5>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-xs">
              Mark all as read
            </Button>
          )}
        </div>
        
        <div className="max-h-[300px] overflow-y-auto">
          {loading ? (
            <div className="flex justify-center p-4">
              <span>Loading...</span>
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No notifications
            </div>
          ) : (
            notifications.map(notification => (
              <DropdownMenuItem 
                key={notification.id}
                onClick={() => markAsRead(notification.id)}
                className={`cursor-pointer border-b p-3 ${!notification.read_at ? 'bg-gray-50' : ''}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full ${getNotificationIconBg(notification.data.type)}`}>
                    {getNotificationIcon(notification.data.type)}
                  </div>
                  <div className="flex-1">
                    <p className="mb-1 text-sm">
                      {notification.data.message}
                    </p>
                    <span className="text-xs text-gray-500">
                      {formatDate(notification.created_at)}
                    </span>
                  </div>
                </div>
              </DropdownMenuItem>
            ))
          )}
        </div>
        
        <div className="border-t p-2 text-center">
          <Link href={route('notifications.index')} className="text-sm text-blue-600 hover:text-blue-800">
            View all notifications
          </Link>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Helper functions for notification styling
function getNotificationIconBg(type?: string): string {
  switch (type) {
    case 'profile_completed':
      return 'bg-green-500 text-white';
    case 'job_application':
      return 'bg-blue-500 text-white';
    default:
      return 'bg-gray-500 text-white';
  }
}

function getNotificationIcon(type?: string) {
  switch (type) {
    case 'profile_completed':
      return <i className="fas fa-check-circle"></i>;
    case 'job_application':
      return <i className="fas fa-briefcase"></i>;
    default:
      return <i className="fas fa-bell"></i>;
  }
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  
  // Time difference in milliseconds
  const diff = now.getTime() - date.getTime();
  
  // Convert to minutes, hours, days
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (minutes < 1) {
    return 'Just now';
  } else if (minutes < 60) {
    return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
  } else if (hours < 24) {
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  } else if (days < 7) {
    return `${days} ${days === 1 ? 'day' : 'days'} ago`;
  } else {
    return date.toLocaleDateString();
  }
} 