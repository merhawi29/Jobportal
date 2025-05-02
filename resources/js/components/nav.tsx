import React, { useEffect, useState } from 'react'
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
`}
</style>
const Nav = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [messageCount, setMessageCount] = useState(0);
    const [alertCount, setAlertCount] = useState(0);
    const [isScrolled, setIsScrolled] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const { auth } = usePage<Props>().props;
    const isModerator = auth?.user?.role === 'moderator';
    const isJobSeeker = auth?.user?.role === 'job_seeker';
    const isEmployer = auth?.user?.role === 'employer';
    const isAuth = auth?.user?.role === 'employer' || auth?.user?.role === 'admin' || auth?.user?.role === 'moderator';
    const [isOpen, setIsOpen] = useState(false);
    const [avatarSrc, setAvatarSrc] = useState<string>('/assets/img/logo/testimonial.png');

    useEffect(() => {
        fetchNotifications();
        
        // Close dropdown when clicking outside
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (!target.closest('.notification-dropdown')) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

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
        try {
            const response = await axios.get(route('notifications.index'));
            if (response.data.alerts && response.data.alerts.data) {
                setNotifications(response.data.alerts.data);
                setAlertCount(response.data.alerts.data.filter((n: Notification) => !n.read_at).length);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    const formatDate = (dateString: string) => {
        return format(new Date(dateString), 'MMM d, yyyy h:mm a');
    };

    const markAsRead = async (id: string) => {
        try {
            await axios.post(route('jobseeker.notifications.mark-as-read', { id }));
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

                        <div className="col-lg-9 col-md-9">
                            <div className="d-flex align-items-center justify-content-between">

                                <nav className="navbar navbar-expand-lg flex-grow-1">
                                    <div className=" navbar-collapse">

                                        <ul className="navbar-nav me-auto">
                                            <li className="nav-item">

                                                <Link className="nav-link px-3 text-primary fw-medium nav-hover " href="/">Home</Link>
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

                                            <li className="nav-item">
                                                <Link className="nav-link px-3 text-primary fw-medium nav-hover" href="/contact">Contact</Link>
                                            </li>

                                            <li className="nav-item dropdown">
                                                <Link className="nav-link dropdown-toggle px-3 text-primary fw-medium nav-hover" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
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
                                                <Link className="nav-link dropdown-toggle px-3 text-primary fw-medium nav-hover" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
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
                                                <Link className="nav-link dropdown-toggle px-3 text-primary fw-medium nav-hover" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                        Employer
                                                    </Link>
                                                <ul className="dropdown-menu">
                                                    
                                                    <li><Link className="dropdown-item" href="/employer/jobs">Jobs</Link></li>
                                                    <li><Link className="dropdown-item" href="/employer/applications">Applications</Link></li>
                                                </ul>
                                                        </li>
                                            )}
                                            {auth?.user?.role === 'admin' && (
                                            <li className="nav-item dropdown">
                                                <Link className="nav-link dropdown-toggle px-3 text-primary fw-medium nav-hover" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                    Admin
                                                </Link>
                                                <ul className="dropdown-menu">
                                                    <li><Link className="dropdown-item" href="/admin/dashboard">Dashboard</Link></li>
                                                    {/* <li><Link className="dropdown-item" href="/admin/users/job-seekers">Job Seekers</Link></li>
                                                    <li><Link className="dropdown-item" href="/admin/users/employers">Employers</Link></li>
                                                    <li><Link className="dropdown-item" href="/admin/jobs">Jobs</Link></li>
                                                    <li><Link className="dropdown-item" href="/admin/applications">Applications</Link></li>
                                                    <li><Link className="dropdown-item" href="/admin/verifications">Verifications</Link></li> */}
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
                                <div className="d-none d-lg-flex align-items-center">
                                    {auth.user ? (
                                        <>
                                            <Link href="/messages" className="btn btn-link position-relative me-3 text-primary">
                                                <i className="fas fa-envelope fa-lg"></i>
                                                {messageCount > 0 && (
                                                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                                        {messageCount}
                                                    </span>
                                                )}
                                            </Link> 
                                            <Link 
                                                href={route('notifications.index')} 
                                                className="btn btn-link position-relative me-4 text-success"
                                            >
                                                <i className="fas fa-bell fa-lg"></i>
                                                {alertCount > 0 && (
                                                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                                        {alertCount}
                                                    </span>
                                                )}
                                            </Link>
                                            
                                            {/* Notification Dropdown */}
                                            {/* {dropdownOpen && (
                                                <div className="dropdown-menu dropdown-menu-end show" style={{
                                                    position: 'absolute',
                                                    top: '100%',
                                                    right: 0,
                                                    width: '400px',
                                                    maxHeight: '500px',
                                                    overflowY: 'auto',
                                                    backgroundColor: '#1e1e1e',
                                                    border: '1px solid #333',
                                                    borderRadius: '8px',
                                                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                                    zIndex: 1000,
                                                    padding: '0'
                                                }}>
                                                    <div className="p-3 border-bottom border-secondary">
                                                        <h6 className="mb-0 text-white">Notifications</h6>
                                                    </div>
                                                    <div className="notification-items">
                                                        {notifications && notifications.length > 0 ? (
                                                            notifications.map((notification, index) => (
                                                                <div key={index} className="notification-item p-3 border-bottom border-secondary">
                                                                    <div className="d-flex align-items-start">
                                                                        {notification.type.includes('Interview') ? (
                                                                            <div className="notification-icon me-3">
                                                                                <i className="fas fa-calendar text-primary fa-lg"></i>
                                                                            </div>
                                                                        ) : notification.type.includes('JobAlert') ? (
                                                                            <div className="notification-icon me-3">
                                                                                <i className="fas fa-briefcase text-success fa-lg"></i>
                                                                            </div>
                                                                        ) : (
                                                                            <div className="notification-icon me-3">
                                                                                <i className="fas fa-bell text-warning fa-lg"></i>
                                                                            </div>
                                                                        )}
                                                                        <div className="notification-content flex-grow-1">
                                                                            <p className="mb-1 text-white">{notification.data.message}</p>
                                                                            <small className="text-muted">
                                                                                {formatDate(notification.created_at)}
                                                                            </small>
                                                                        </div>
                                                                        {!notification.read_at && (
                                                                            <div className="notification-badge">
                                                                                <span className="badge bg-primary rounded-circle"></span>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <div className="p-4 text-center text-muted">
                                                                <i className="fas fa-bell-slash fa-2x mb-3"></i>
                                                                <p>No notifications yet</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="p-3 text-center border-top border-secondary">
                                                        <Link href={route('notifications.index')} className="text-primary text-decoration-none">
                                                            See all notifications
                                                        </Link>
                                                    </div>
                                                </div>
                                            )}
                                             */}
                                            {/* Test link */}
                                           
                                            <div className="dropdown">
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
                        {/* Mobile Menu */}
                        <div className="col-12 d-lg-none">
                            <button
                                className={`navbar-toggler border-0 ${isMenuOpen ? 'collapsed' : ''}`}
                                type="button"
                                onClick={toggleMenu}
                            >
                                <span className="navbar-toggler-icon"></span>
                            </button>
                            <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`}>
                            <ul className="navbar-nav me-auto">
                                            <li className="nav-item">

                                                <Link className="nav-link px-3 text-primary fw-medium nav-hover " href="/">Home</Link>
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

                                            <li className="nav-item">
                                                <Link className="nav-link px-3 text-primary fw-medium nav-hover" href="/contact">Contact</Link>
                                            </li>

                                            <li className="nav-item dropdown">
                                                <Link className="nav-link dropdown-toggle px-3 text-primary fw-medium nav-hover" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
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
                                        <Link className="nav-link dropdown-toggle text-primary fw-medium nav-hover" href="#" role="button" data-bs-toggle="dropdown">
                                                        <i className="fas fa-shield-alt me-1"></i>
                                                        JobSeeker
                                                    </Link>

                                            <ul className="dropdown-menu dropdown-menu-end">

                                                        <ul>
                                                            <li>
                                                                <Link
                                                                    href={route('applications.index')}
                                                                    className="dropdown-item"
                                                                >
                                                                    <i className="fas fa-file-alt me-2"></i>
                                                                    My Applications
                                                                </Link>
                                                            </li>
                                                            <li>
                                                                <Link
                                                                    href={route('saved-jobs.index')}
                                                                    className="dropdown-item"
                                                                >
                                                                    <i className="fas fa-heart me-2"></i>
                                                                    Saved Jobs
                                        </Link>
                                                            </li>
                                                            <li>
                                                                <Link
                                                                    href={route('notifications.index')}
                                                                    className="dropdown-item"
                                                                >
                                                                    <i className="fas fa-bell me-2"></i>
                                                                    Notifications
                                                                </Link>
                                                            </li>
                                                            <li><hr className="dropdown-divider" /></li>
                                                        </ul>

                                        </ul>
                                    </li>
                                            )}
                                    {isEmployer && (
                                        <li className="nav-item dropdown">
                                            <Link className="nav-link dropdown-toggle text-primary fw-medium nav-hover" href="#" role="button" data-bs-toggle="dropdown">
                                                <i className="fas fa-building me-1"></i>
                                                Employer
                                            </Link>
                                            <ul className="dropdown-menu dropdown-menu-end">
                                                <li>
                                                    <Link
                                                        href={route('employer.jobs.index')}
                                                            className="dropdown-item"
                                                    >
                                                        <i className="fas fa-list-alt me-2"></i>
                                                        My Job Posts
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link
                                                        href={route('employer.applications.index')}
                                                            className="dropdown-item"
                                                    >
                                                        <i className="fas fa-users me-2"></i>
                                                        Received Applications
                                                    </Link>
                                                </li>
                                                <li><hr className="dropdown-divider" /></li>
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
                                                <li>
                                                    <Link className="dropdown-item nav-hover" href="/moderator/settings">
                                                        <i className="fas fa-cog me-2"></i>
                                                        Settings
                                                    </Link>
                                                </li>
                                            </ul>
                                        </li>
                                    )}
                                        </ul>
                                    </div>
                                    <div className="d-none d-lg-flex align-items-center">
                                    {auth.user ? (
                                        <>
                                            <Link href="/messages" className="btn btn-link position-relative me-3 text-primary">
                                                <i className="fas fa-envelope fa-lg"></i>
                                                {messageCount > 0 && (
                                                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                                        {messageCount}
                                                    </span>
                                                )}
                                            </Link>
                                            {/* <Link 
                                                href={route('jobseeker.notifications.index')} 
                                                className="btn btn-link position-relative me-4 text-success"
                                            >
                                                <i className="fas fa-bell fa-lg"></i>
                                                {alertCount > 0 && (
                                                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                                        {alertCount}
                                                    </span>
                                                )}
                                            </Link>
                                             */}
                                            {/* Notification Dropdown */}
                                            {/* {dropdownOpen && (
                                                <div className="dropdown-menu dropdown-menu-end show" style={{
                                                    position: 'absolute',
                                                    top: '100%',
                                                    right: 0,
                                                    width: '400px',
                                                    maxHeight: '500px',
                                                    overflowY: 'auto',
                                                    backgroundColor: '#1e1e1e',
                                                    border: '1px solid #333',
                                                    borderRadius: '8px',
                                                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                                    zIndex: 1000,
                                                    padding: '0'
                                                }}>
                                                    <div className="p-3 border-bottom border-secondary">
                                                        <h6 className="mb-0 text-white">Notifications</h6>
                                                    </div>
                                                    <div className="notification-items">
                                                        {notifications && notifications.length > 0 ? (
                                                            notifications.map((notification, index) => (
                                                                <div key={index} className="notification-item p-3 border-bottom border-secondary">
                                                                    <div className="d-flex align-items-start">
                                                                        {notification.type.includes('Interview') ? (
                                                                            <div className="notification-icon me-3">
                                                                                <i className="fas fa-calendar text-primary fa-lg"></i>
                                                                            </div>
                                                                        ) : notification.type.includes('JobAlert') ? (
                                                                            <div className="notification-icon me-3">
                                                                                <i className="fas fa-briefcase text-success fa-lg"></i>
                                                                            </div>
                                                                        ) : (
                                                                            <div className="notification-icon me-3">
                                                                                <i className="fas fa-bell text-warning fa-lg"></i>
                                                                            </div>
                                                                        )}
                                                                        <div className="notification-content flex-grow-1">
                                                                            <p className="mb-1 text-white">{notification.data.message}</p>
                                                                            <small className="text-muted">
                                                                                {formatDate(notification.created_at)}
                                                                            </small>
                                                                        </div>
                                                                        {!notification.read_at && (
                                                                            <div className="notification-badge">
                                                                                <span className="badge bg-primary rounded-circle"></span>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <div className="p-4 text-center text-muted">
                                                                <i className="fas fa-bell-slash fa-2x mb-3"></i>
                                                                <p>No notifications yet</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="p-3 text-center border-top border-secondary">
                                                        <Link href={route('notifications.index')} className="text-primary text-decoration-none">
                                                            See all notifications
                                                        </Link>
                                                    </div>
                                                </div>
                                            )} */}
                                            
                                            {/* Test link */}
                                            {/* <Link 
                                                href={route('test-job-alerts')} 
                                                className="btn btn-link position-relative me-4 text-warning"
                                            >
                                                <i className="fas fa-bug fa-lg"></i>
                                                Test Alerts
                                            </Link> */}
                                            <div className="dropdown">
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
                                                    <span className="d-none d-sm-inline">{auth.user?.name}</span>
                                                </Link>
                                                <ul className="dropdown-menu dropdown-menu-end">
                                                   <li>
                                                       {auth.user?.role === 'job_seeker' ? (
                                                           <Link
                                                               className="dropdown-item"
                                                               href={route('jobseeker.profile.edit')}
                                                           >
                                                               Profile
                                                           </Link>
                                                       ) : auth.user?.role === 'employer' ? (
                                                           <Link
                                                               className="dropdown-item"
                                                               href={route('employee.profile.edit')}
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
                        </div>


            </header>
            <Sidebar auth={{
                user: null
            }} />


        </>
    )
}

export default Nav
