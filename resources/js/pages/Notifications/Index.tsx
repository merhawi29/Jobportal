import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { PageProps } from '@/types';
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

interface Props extends PageProps {
  notifications: {
    data: Notification[];
    current_page: number;
    last_page: number;
    total: number;
  };
}

export default function Index({ notifications, auth }: Props) {
  const markAsRead = async (id: string) => {
    try {
      await axios.post(route('notifications.mark-as-read', id));
      
      // Refresh the page to update notification status
      window.location.reload();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }).format(date);
  };

  const getNotificationIcon = (type?: string) => {
    switch (type) {
      case 'profile_completed':
        return <i className="fas fa-check-circle text-success"></i>;
      case 'job_application':
        return <i className="fas fa-briefcase text-primary"></i>;
      default:
        return <i className="fas fa-bell text-info"></i>;
    }
  };

  return (
    <AppLayout>
      <Head title="Notifications" />

      <div className="container py-5">
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h1 className="card-title mb-0">Notifications</h1>
                <div>
                  <button 
                    className="btn btn-sm btn-outline-primary"
                    onClick={async () => {
                      await axios.post(route('notifications.mark-all-read'));
                      window.location.reload();
                    }}
                  >
                    Mark all as read
                  </button>
                </div>
              </div>
              <div className="card-body">
                {notifications.data.length === 0 ? (
                  <div className="text-center p-5">
                    <i className="fas fa-bell fa-3x text-muted mb-3"></i>
                    <h5>No notifications</h5>
                    <p className="text-muted">You don't have any notifications yet.</p>
                  </div>
                ) : (
                  <div className="list-group">
                    {notifications.data.map(notification => (
                      <div 
                        key={notification.id} 
                        className={`list-group-item list-group-item-action ${!notification.read_at ? 'bg-light' : ''}`}
                      >
                        <div className="d-flex w-100 justify-content-between align-items-center">
                          <div className="d-flex align-items-center">
                            <div className="me-3">
                              {getNotificationIcon(notification.data.type)}
                            </div>
                            <div>
                              <p className="mb-1">{notification.data.message}</p>
                              <small className="text-muted">
                                {formatDate(notification.created_at)}
                              </small>
                            </div>
                          </div>
                          {!notification.read_at && (
                            <button 
                              className="btn btn-sm btn-outline-secondary"
                              onClick={() => markAsRead(notification.id)}
                            >
                              Mark as read
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {notifications.last_page > 1 && (
                <div className="card-footer">
                  <nav>
                    <ul className="pagination justify-content-center mb-0">
                      {Array.from({ length: notifications.last_page }, (_, i) => i + 1).map(page => (
                        <li 
                          key={page} 
                          className={`page-item ${page === notifications.current_page ? 'active' : ''}`}
                        >
                          <Link 
                            href={route('notifications.index', { page })} 
                            className="page-link"
                          >
                            {page}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </nav>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
} 