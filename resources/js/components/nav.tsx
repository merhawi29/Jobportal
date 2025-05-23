import React, { useEffect, useState, useRef } from 'react'
import { Link, usePage } from '@inertiajs/react'
import { router } from '@inertiajs/react'
import Sidebar from './sidebar'
import { format } from 'date-fns'
import axios from 'axios'

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    profile_picture?: string | null;
}

interface Props {
    auth: {
        user: User | null;
    };
    [key: string]: any;
}

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
        employer_name?: string;
    };
    read_at: string | null;
    created_at: string;
}

<style>
    {`
    .nav  ul li link {
       color: #00b074
    }
    .nav-hover {
        transition: color 0.2s ease;
    }
    .nav-hover:hover {
        color: #00b074 !important;
    }

    .notification-dropdown {
        position: relative;
    }

    .notification-item {
        transition: background-color 0.2s ease;
        cursor: pointer;
    }

    .notification-item:hover {
        background-color: #2d2d2d;
    }

    .notification-badge span {
        width: 8px;
        height: 8px;
        display: inline-block;
    }

    .notification-icon {
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        background-color: rgba(255, 255, 255, 0.1);
    }

    .notification-content {
        max-width: calc(100% - 60px);
    }

    .notification-content p {
        margin: 0;
        line-height: 1.4;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
    }

    .dropdown-menu {
        margin-top: 0.5rem;
        animation: fadeIn 0.2s ease-out;
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .mobile-menu {
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .mobile-menu.show {
        transform: translateX(0);
    }

    .navbar-toggler {
        padding: 0.5rem;
        font-size: 1.25rem;
        line-height: 1;
        background-color: transparent;
        border: none;
        border-radius: 0.25rem;
        transition: all 0.2s ease-in-out;
    }

    .navbar-toggler:focus {
        outline: none;
        box-shadow: none;
    }

    .navbar-toggler i {
        color: #00b074;
        transition: transform 0.2s ease-in-out;
    }

    .navbar-toggler:hover i {
        transform: scale(1.1);
    }
`}
</style>
const Nav = () => {
    // Set up Axios to include the CSRF token in all requests
    axios.defaults.headers.common['X-CSRF-TOKEN'] = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
    axios.defaults.withCredentials = true;
    
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [messageCount, setMessageCount] = useState(0);
    const [alertCount, setAlertCount] = useState(0);
    const [isScrolled, setIsScrolled] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const notificationRef = useRef<HTMLDivElement>(null);
    const { auth } = usePage<Props>().props;
    const isModerator = auth?.user?.role === 'moderator';
    const isJobSeeker = auth?.user?.role === 'job_seeker';
    const isEmployer = auth?.user?.role === 'employer';
    const isAuth = auth?.user?.role === 'employer' || auth?.user?.role === 'admin' || auth?.user?.role === 'moderator';
    const [isOpen, setIsOpen] = useState(false);
    const [avatarSrc, setAvatarSrc] = useState<string>('/assets/img/logo/testimonial.png');

    useEffect(() => {
        if (auth.user) {
            fetchNotifications();
            fetchMessageCount();
            
            // Set up an interval to refresh notifications every 30 seconds
            const interval = setInterval(fetchNotifications, 30000);
            const messageInterval = setInterval(fetchMessageCount, 30000);
            
            // Clean up interval on unmount
            return () => {
                clearInterval(interval);
                clearInterval(messageInterval);
            };
        }
        
        // Close dropdown when clicking outside
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (notificationRef.current && !notificationRef.current.contains(target)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [auth.user]);

    useEffect(() => {
        if (auth.user?.profile_picture) {
            const img = new Image();
            const profilePicture = auth.user.profile_picture;
            if (typeof profilePicture === 'string') {
                img.src = profilePicture;
                
                img.onload = () => {
                    setAvatarSrc(profilePicture);
                };
                
                img.onerror = () => {
                    setAvatarSrc('/assets/img/logo/testimonial.png');
                };
            }
        }
    }, [auth.user?.profile_picture]);

    const fetchNotifications = async () => {
        if (!auth.user) return;
        
        try {
            console.log("Fetching notifications...");
            
            // Use the web route instead of API route for better session handling
            const response = await axios.get('/notifications/latest', {
                withCredentials: true,
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/json',
                }
            });
            
            console.log("Response:", response.data);
            
            if (response.data && response.data.notifications) {
                console.log("Setting notifications:", response.data.notifications);
                setNotifications(response.data.notifications);
                setAlertCount(response.data.unread_count);
            } else {
                console.log("No notifications data in response:", response.data);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    const fetchMessageCount = async () => {
        try {
            const response = await axios.get('/api/messages/unread-count');
            setMessageCount(response.data.count);
        } catch (error) {
            console.error('Error fetching message count:', error);
        }
    };

    const formatDate = (dateString: string) => {
        return format(new Date(dateString), 'MMM d, yyyy h:mm a');
    };

    const markAsRead = async (id: string) => {
        try {
            // Use web route instead of API route
            await axios.post(`/notifications/${id}/mark-as-read`, {}, {
                withCredentials: true,
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/json',
                }
            });
            
            setNotifications(notifications.map(notification => 
                notification.id === id 
                    ? { ...notification, read_at: new Date().toISOString() }
                    : notification
            ));
            setAlertCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    useEffect(() => {
        document.body.style.paddingTop = '80px';

        const handleScroll = () => {
            const scrolled = window.scrollY > 10;
            setIsScrolled(scrolled);
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Call it initially

        return () => {
            document.body.style.paddingTop = '0';
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
        // Add or remove body class to prevent scrolling when menu is open
        if (!isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    };

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            const mobileMenu = document.getElementById('mobileMenu');
            const toggleButton = document.querySelector('.navbar-toggler');
            
            if (mobileMenu && 
                !mobileMenu.contains(target) && 
                toggleButton && 
                !toggleButton.contains(target) && 
                isMenuOpen) {
                setIsMenuOpen(false);
                document.body.style.overflow = 'auto';
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
            document.body.style.overflow = 'auto';
        };
    }, [isMenuOpen]);

    const renderNotificationDropdown = () => (
        <div className="notification-dropdown position-relative me-5" ref={notificationRef}>
            <button 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="btn btn-link position-relative text-primary"
                aria-expanded={dropdownOpen}
            >
                <i className="fas fa-bell fa-lg"></i>
                {alertCount > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                        {alertCount}
                    </span>
                )}
            </button>
            
            {dropdownOpen && (
                <div className="dropdown-menu dropdown-menu-end p-0 shadow-lg border-0 show" style={{width: '320px', maxHeight: '400px', overflowY: 'auto'}}>
                    <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
                        <h6 className="m-0 fw-bold">Notifications</h6>
                        {alertCount > 0 && (
                            <button 
                                onClick={async () => {
                                    try {
                                        await axios.post('/notifications/mark-all-read', {}, {
                                            withCredentials: true,
                                            headers: {
                                                'X-Requested-With': 'XMLHttpRequest',
                                                'Accept': 'application/json',
                                            }
                                        });
                                        setNotifications(notifications.map(notification => ({
                                            ...notification,
                                            read_at: new Date().toISOString()
                                        })));
                                        setAlertCount(0);
                                    } catch (error) {
                                        console.error('Error marking all as read:', error);
                                    }
                                }}
                                className="btn btn-link btn-sm p-0 text-decoration-none"
                            >
                                Mark all as read
                            </button>
                        )}
                    </div>
                    
                    {notifications.length > 0 ? (
                        <>
                            {notifications.map(notification => (
                                <div 
                                    key={notification.id} 
                                    className={`notification-item d-flex align-items-start p-3 border-bottom ${!notification.read_at ? 'bg-light' : ''}`}
                                    onClick={() => markAsRead(notification.id)}
                                >
                                    <div className="notification-icon me-3 bg-primary text-white">
                                        <i className={getNotificationIcon(notification.type)}></i>
                                    </div>
                                    <div className="notification-content">
                                        <p className="small text-dark mb-1">
                                            {notification.data.message}
                                            {notification.data.job_title && (
                                                <span className="fw-bold"> {notification.data.job_title}</span>
                                            )}
                                        </p>
                                        {notification.data.employer_name && (
                                            <p className="small text-muted mb-1">
                                                From: {notification.data.employer_name}
                                            </p>
                                        )}
                                        <span className="text-muted small">
                                            {formatDate(notification.created_at)}
                                        </span>
                                    </div>
                                    {!notification.read_at && (
                                        <span className="notification-badge ms-2">
                                            <span className="bg-primary rounded-circle"></span>
                                        </span>
                                    )}
                                </div>
                            ))}
                            <div className="p-2 text-center">
                                <Link href={route('notifications.index')} className="btn btn-link btn-sm text-decoration-none" onClick={() => setDropdownOpen(false)}>
                                    View all notifications
                                </Link>
                            </div>
                        </>
                    ) : (
                        <div className="p-4 text-center text-muted">
                            <i className="fas fa-bell-slash fa-2x mb-2"></i>
                            <p>No notifications</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );

    const getNotificationIcon = (type: string) => {
        if (type.includes('WelcomeMessage')) {
            return 'fas fa-user-plus';
        } else if (type.includes('InterviewNotification')) {
            return 'fas fa-calendar-check';
        } else if (type.includes('JobApplication')) {
            return 'fas fa-file-alt';
        } else {
            return 'fas fa-bell';
        }
    };

    return (
        <>
            <header className={`fixed-top bg-white ${isScrolled ? 'shadow-sm' : ''}`}>
                <div className="container">
                    <div className="row align-items-center py-3">
                        <div className="col-lg-3 col-md-2">
                            <div className="navbar-brand">
                                <Link href="/"><img src="/assets/img/logo/super.png" alt="" style={{ maxWidth: '100px' }} /></Link>
                            </div>
                        </div>

                        {/* Toggle Button - Always visible on small screens */}
                        <div className="d-lg-none col-2 text-end">
                            <button
                                className="navbar-toggler border-0"
                                type="button"
                                onClick={toggleMenu}
                                aria-label="Toggle navigation"
                            >
                                <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
                            </button>
                        </div>

                        {/* Desktop Navigation - Hidden on small screens */}
                        <div className="col-lg-9 col-md-10 d-none d-lg-block">
                            <div className="d-flex align-items-center justify-content-between">
                                <nav className="navbar navbar-expand-lg flex-grow-1">
                                    <div className="navbar-collapse">
                                        <ul className="navbar-nav me-auto">
                                            <li className="nav-item">
                                                <Link className="nav-link px-3 text-primary fw-medium nav-hover" href="/">Home</Link>
                                            </li>
                                            <li className="nav-item">
                                                <Link className="nav-link px-3 text-primary fw-medium nav-hover" href="/jobs">Find a Jobs</Link>
                                            </li>
                                            {
                                                isAuth && (
                                                    <li className="nav-item">
                                                    <Link className="nav-link px-3 text-primary fw-medium nav-hover" href="/create">Post a Job</Link>
                                                </li>
                                                )
                                            }
                                            <li className="nav-item">
                                                <Link className="nav-link px-3 text-primary fw-medium nav-hover" href="/about">About</Link>
                                            </li>
                                            {/* <li className="nav-item">
                                                <Link className="nav-link px-3 text-primary fw-medium nav-hover" href="/contact">Contact</Link>
                                            </li> */}
                                            <li className="nav-item dropdown">
                                                <Link className="nav-link dropdown-toggle px-3 text-primary fw-medium nav-hover" href="#" role="button" data-bs-toggle="dropdown">
                                                    Resources
                                                </Link>
                                                <ul className="dropdown-menu">
                                                    <li><Link className="dropdown-item" href="/blog">Blog Posts</Link></li>
                                                    <li><Link className="dropdown-item" href="/career-resources">Career Resources</Link></li>
                                                    <li><Link className="dropdown-item" href="/faq">FAQs</Link></li>
                                                </ul>
                                            </li>
                                            {isJobSeeker && (
                                            <li className="nav-item dropdown">
                                                    <Link className="nav-link dropdown-toggle px-3 text-primary fw-medium nav-hover" href="#" role="button" data-bs-toggle="dropdown">
                                                    Job Seeker
                                                    </Link>
                                                <ul className="dropdown-menu">
                                                    <li><Link className="dropdown-item" href="/applications">Applications</Link></li>
                                                    <li><Link className="dropdown-item" href="/jobseeker/saved-jobs">Saved Jobs</Link></li>
                                                    </ul>
                                                </li>
                                            )}
                                            {isEmployer && (
                                                <li className="nav-item dropdown">
                                                    <Link className="nav-link dropdown-toggle px-3 text-primary fw-medium nav-hover" href="#" role="button" data-bs-toggle="dropdown">
                                                        Employer
                                                    </Link>
                                                <ul className="dropdown-menu">
                                                    <li><Link className="dropdown-item" href={route('employer.my-jobs.index')} onClick={() => setIsMenuOpen(false)}>My Jobs</Link></li>
                                                    <li><Link className="dropdown-item" href="/employer/applications" onClick={() => setIsMenuOpen(false)}>Applications</Link></li>
                                                </ul>
                                                        </li>
                                            )}
                                            {auth?.user?.role === 'admin' && (
                                            <li className="nav-item dropdown">
                                                    <Link className="nav-link dropdown-toggle px-3 text-primary fw-medium nav-hover" href="#" role="button" data-bs-toggle="dropdown">
                                                    Admin
                                                </Link>
                                                <ul className="dropdown-menu">
                                                    <li><Link className="dropdown-item" href="/admin/dashboard">Dashboard</Link></li>
                                                    <li><hr className="dropdown-divider" /></li>
                                                    <li><Link className="dropdown-item" href="/admin/content/blog_post/create">Create Blog Post</Link></li>
                                                    <li><Link className="dropdown-item" href="/admin/content/career_resource/create">Create Career Resource</Link></li>
                                                    <li><Link className="dropdown-item" href="/admin/content/faq/create">Create FAQ</Link></li>
                                                    <li><hr className="dropdown-divider" /></li>
                                                    <li><Link className="dropdown-item" href="/admin/reports/download">Reports</Link></li>
                                                </ul>
                                            </li>
                                            )}
                                            {isModerator && (
                                                <li className="nav-item dropdown">
                                                    <Link className="nav-link dropdown-toggle text-primary fw-medium nav-hover" href="#" role="button" data-bs-toggle="dropdown">
                                                        <i className="fas fa-shield-alt me-1"></i>
                                                        Moderator
                                                    </Link>
                                                    <ul className="dropdown-menu">
                                                        <li>
                                                            <Link className="dropdown-item nav-hover" href="/moderator/dashboard">
                                                                <i className="fas fa-tachometer-alt me-2"></i>
                                                                Dashboard
                                                            </Link>
                                                        </li>
                                                        <li>
                                                            <Link className="dropdown-item nav-hover" href="/moderator/jobs">
                                                                <i className="fas fa-briefcase me-2"></i>
                                                                Manage Jobs
                                                            </Link>
                                                        </li>
                                                        <li>
                                                            <Link className="dropdown-item nav-hover" href="/moderator/users">
                                                                <i className="fas fa-users me-2"></i>
                                                                Manage Users
                                                            </Link>
                                                        </li>
                                                        <li>
                                                            <Link className="dropdown-item nav-hover" href="/moderator/reports">
                                                                <i className="fas fa-flag me-2"></i>
                                                                Reports
                                                            </Link>
                                                        </li>
                                                        <li>
                                                            <Link className="dropdown-item nav-hover" href={route('moderator.activity-logs.index')}>
                                                                <i className="fas fa-history me-2"></i>
                                                                Activity Logs
                                                            </Link>
                                                        </li>
                                                        <li>
                                                            <Link className="dropdown-item nav-hover" href="/moderator/analytics">
                                                                <i className="fas fa-chart-bar me-2"></i>
                                                                Analytics
                                                            </Link>
                                                        </li>
                                                        <li><hr className="dropdown-divider" /></li>
                                                    </ul>
                                                </li>
                                            )}
                                        </ul>
                                    </div>
                                </nav>
                                <div className="d-flex align-items-center me-5">
                                    {auth.user ? (
                                        <>
                                            <Link href="/messages" className="btn btn-link position-relative me-2 text-primary">
                                                <i className="fas fa-envelope fa-lg"></i>
                                                {messageCount > 0 && (
                                                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                                        {messageCount}
                                                    </span>
                                                )}
                                            </Link> 
                                            {renderNotificationDropdown()}
                                            
                                            <div className="dropdown">
                                            {/* <Link 
                                                    href={route('job-alerts.index')} 
                                                    className={`nav-link ${route().current('job-alerts.*') ? 'active' : ''}`}
                                                    >
                                                    <i className="fas fa-bell me-2"></i>
                                                    Job Alerts
                                                    </Link> */}
                                                <Link
                                                    className="d-flex align-items-center text-dark text-decoration-none dropdown-toggle"
                                                    href="#"
                                                    role="button"
                                                    data-bs-toggle="dropdown"
                                                >
                                                    <img
                                                        src={auth.user?.profile_picture || '/assets/img/logo/testimonial.png'}
                                                        alt={`${auth.user?.name}'s avatar`}
                                                        className="rounded-circle me-2"
                                                        style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                                                        onError={(e) => {
                                                            const target = e.target as HTMLImageElement;
                                                            target.onerror = null;
                                                            target.src = '/assets/img/logo/testimonial.png';
                                                        }}
                                                    />
                                                </Link>
                                                <ul className="dropdown-menu dropdown-menu-end">
                                                    <li>
                                                       {isJobSeeker ? (
                                                           <Link
                                                               className="dropdown-item"
                                                               href={route('jobseeker.profile.show')}
                                                           >
                                                               Profile
                                                           </Link>
                                                       ) : isEmployer ? (
                                        <Link
                                                               className="dropdown-item"
                                                               href={route('employee.profile.show')}
                                        >
                                                               Profile
                                        </Link>
                                                       ) : (
                                        <Link
                                                               className="dropdown-item"
                                                               href="/profile"
                                        >
                                                               Profile
                                        </Link>
                            )}
                                                    </li>
                                                    <li><Link className="dropdown-item" href="/settings">Settings</Link></li>
                                                    <li><hr className="dropdown-divider" /></li>
                                                    <li>
                                                        <Link
                                                            className="dropdown-item text-danger"
                                                            href="/logout"
                                                            method="post"
                                                            as="button"
                                                        >
                                                            Logout
                                                        </Link>
                                                    </li>
                                                </ul>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <Link href="/register" className="btn btn-primary me-2">Register</Link>
                                            <Link href="/login" className="btn btn-success">Login</Link>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Mobile Menu - Only visible when toggled */}
                        <div className={`mobile-menu d-lg-none ${isMenuOpen ? 'show' : ''}`}
                                style={{
                                    position: 'fixed',
                                    top: '80px',
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    backgroundColor: 'white',
                                    zIndex: 1000,
                                    overflowY: 'auto',
                                    transition: 'transform 0.3s ease-in-out',
                                transform: isMenuOpen ? 'translateX(0)' : 'translateX(-100%)',
                                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                            }}>
                            <div className="container py-3">
                                {/* Close button */}
                                <div className="d-flex justify-content-end mb-3">
                                    <button
                                        className="btn btn-link text-dark p-0"
                                        onClick={() => setIsMenuOpen(false)}
                                        aria-label="Close menu"
                                    >
                                        <i className="fas fa-times fa-lg"></i>
                                    </button>
                                </div>
                                    <ul className="navbar-nav">
                                        <li className="nav-item">
                                            <Link className="nav-link px-3 text-primary fw-medium nav-hover" href="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="nav-link px-3 text-primary fw-medium nav-hover" href={route('employer.my-jobs.index')} onClick={() => setIsMenuOpen(false)}>Find a Jobs</Link>
                                        </li>
                                        {isAuth && (
                                            <li className="nav-item">
                                                <Link className="nav-link px-3 text-primary fw-medium nav-hover" href="/create" onClick={() => setIsMenuOpen(false)}>Post a Job</Link>
                                            </li>
                                        )}
                                        <li className="nav-item">
                                            <Link className="nav-link px-3 text-primary fw-medium nav-hover" href="/about" onClick={() => setIsMenuOpen(false)}>About</Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="nav-link px-3 text-primary fw-medium nav-hover" href="/contact" onClick={() => setIsMenuOpen(false)}>Contact</Link>
                                        </li>
                                        <li className="nav-item dropdown">
                                            <Link className="nav-link dropdown-toggle px-3 text-primary fw-medium nav-hover" href="#" role="button" data-bs-toggle="dropdown">
                                                Resources
                                            </Link>
                                            <ul className="dropdown-menu">
                                                <li><Link className="dropdown-item" href="/blog" onClick={() => setIsMenuOpen(false)}>Blog Posts</Link></li>
                                                <li><Link className="dropdown-item" href="/career-resources" onClick={() => setIsMenuOpen(false)}>Career Resources</Link></li>
                                                <li><Link className="dropdown-item" href="/faq" onClick={() => setIsMenuOpen(false)}>FAQs</Link></li>
                                            </ul>
                                        </li>
                                        {isJobSeeker && (
                                            <li className="nav-item dropdown">
                                                <Link className="nav-link dropdown-toggle px-3 text-primary fw-medium nav-hover" href="#" role="button" data-bs-toggle="dropdown">
                                                    Job Seeker
                                                </Link>
                                                <ul className="dropdown-menu">
                                                    <li><Link className="dropdown-item" href="/applications" onClick={() => setIsMenuOpen(false)}>Applications</Link></li>
                                                    <li><Link className="dropdown-item" href="/jobseeker/saved-jobs" onClick={() => setIsMenuOpen(false)}>Saved Jobs</Link></li>
                                                </ul>
                                            </li>
                                        )}
                                        {isEmployer && (
                                            <li className="nav-item dropdown">
                                                <Link className="nav-link dropdown-toggle px-3 text-primary fw-medium nav-hover" href="#" role="button" data-bs-toggle="dropdown">
                                                    Employer
                                                </Link>
                                                <ul className="dropdown-menu">
                                                    <li><Link className="dropdown-item" href={route('employer.my-jobs.index')} onClick={() => setIsMenuOpen(false)}>My Jobs</Link></li>
                                                    <li><Link className="dropdown-item" href="/employer/applications" onClick={() => setIsMenuOpen(false)}>Applications</Link></li>
                                                </ul>
                                            </li>
                                        )}
                                        {auth?.user?.role === 'admin' && (
                                            <li className="nav-item dropdown">
                                                <Link className="nav-link dropdown-toggle px-3 text-primary fw-medium nav-hover" href="#" role="button" data-bs-toggle="dropdown">
                                                    Admin
                                                </Link>
                                                <ul className="dropdown-menu">
                                                    <li><Link className="dropdown-item" href="/admin/dashboard" onClick={() => setIsMenuOpen(false)}>Dashboard</Link></li>
                                                    <li><hr className="dropdown-divider" /></li>
                                                    <li><Link className="dropdown-item" href="/admin/content/blog_post/create" onClick={() => setIsMenuOpen(false)}>Create Blog Post</Link></li>
                                                    <li><Link className="dropdown-item" href="/admin/content/career_resource/create" onClick={() => setIsMenuOpen(false)}>Create Career Resource</Link></li>
                                                    <li><Link className="dropdown-item" href="/admin/content/faq/create" onClick={() => setIsMenuOpen(false)}>Create FAQ</Link></li>
                                                    <li><hr className="dropdown-divider" /></li>
                                                    <li><Link className="dropdown-item" href="/admin/reports/download" onClick={() => setIsMenuOpen(false)}>Reports</Link></li>
                                                </ul>
                                            </li>
                                        )}
                                        {isModerator && (
                                            <li className="nav-item dropdown">
                                                <Link className="nav-link dropdown-toggle px-3 text-primary fw-medium nav-hover" href="#" role="button" data-bs-toggle="dropdown">
                                                    <i className="fas fa-shield-alt me-1"></i>
                                                    Moderator
                                                </Link>
                                                <ul className="dropdown-menu">
                                                    <li><Link className="dropdown-item" href="/moderator/dashboard" onClick={() => setIsMenuOpen(false)}>Dashboard</Link></li>
                                                    <li><Link className="dropdown-item" href="/moderator/jobs" onClick={() => setIsMenuOpen(false)}>Manage Jobs</Link></li>
                                                    <li><Link className="dropdown-item" href="/moderator/users" onClick={() => setIsMenuOpen(false)}>Manage Users</Link></li>
                                                    <li><Link className="dropdown-item" href="/moderator/reports" onClick={() => setIsMenuOpen(false)}>Reports</Link></li>
                                                    <li><Link className="dropdown-item" href={route('moderator.activity-logs.index')} onClick={() => setIsMenuOpen(false)}>Activity Logs</Link></li>
                                                    <li><Link className="dropdown-item" href="/moderator/analytics" onClick={() => setIsMenuOpen(false)}>Analytics</Link></li>
                                                </ul>
                                            </li>
                                        )}
                                    </ul>
                                    <div className="mt-3">
                                        {auth.user ? (
                                            <div className="d-flex flex-column">
                                                {/* <Link href="/messages" className="btn btn-link text-primary mb-2" onClick={() => setIsMenuOpen(false)}>
                                                    <i className="fas fa-envelope me-2"></i>
                                                    Messages
                                                    {messageCount > 0 && (
                                                        <span className="badge bg-danger ms-2">{messageCount}</span>
                                                    )}
                                                </Link> */}
                                                <Link href={route('notifications.index')} className="btn btn-link text-primary mb-2" onClick={() => setIsMenuOpen(false)}>
                                                    <i className="fas fa-bell me-2"></i>
                                                    Notifications
                                                    {alertCount > 0 && (
                                                        <span className="badge bg-danger ms-2">{alertCount}</span>
                                                    )}
                                                </Link>
                                                <Link href="/profile" className="btn btn-link text-primary mb-2" onClick={() => setIsMenuOpen(false)}>
                                                    <i className="fas fa-user me-2"></i>
                                                    Profile
                                                </Link>
                                                <Link href="/settings" className="btn btn-link text-primary mb-2" onClick={() => setIsMenuOpen(false)}>
                                                    <i className="fas fa-cog me-2"></i>
                                                    Settings
                                                </Link>
                                                <Link href="/logout" method="post" as="button" className="btn btn-link text-danger" onClick={() => setIsMenuOpen(false)}>
                                                    <i className="fas fa-sign-out-alt me-2"></i>
                                                    Logout
                                                </Link>
                                            </div>
                                        ) : (
                                            <div className="d-flex flex-column">
                                                <Link href="/register" className="btn btn-primary mb-2" onClick={() => setIsMenuOpen(false)}>Register</Link>
                                                <Link href="/login" className="btn btn-success" onClick={() => setIsMenuOpen(false)}>Login</Link>
                                            </div>
                                        )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            <Sidebar auth={auth} />
        </>
    )
}

export default Nav
