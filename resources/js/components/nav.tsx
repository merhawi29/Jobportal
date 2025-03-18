import React, { useEffect, useState } from 'react'
import { Link, usePage } from '@inertiajs/react'
import { router } from '@inertiajs/react'
import Sidebar from './sidebar'

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
}

interface Props {
    auth: {
        user: User | null;
    };
    [key: string]: any;
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
`}
</style>
const Nav = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [messageCount, setMessageCount] = useState(3);
    const [alertCount, setAlertCount] = useState(2);
    const [isScrolled, setIsScrolled] = useState(false);
    const { auth } = usePage<Props>().props;
    const isModerator = auth?.user?.role === 'moderator';
    const isJobSeeker = auth?.user?.role === 'job_seeker';
    const isEmployer = auth?.user?.role === 'employer';
    const isAuth = auth?.user?.role === 'employer' || auth?.user?.role === 'admin' || auth?.user?.role === 'moderator';
    const [isOpen, setIsOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(true);

    useEffect(() => {
        document.body.style.paddingTop = '80px';

        const handleScroll = () => {
            const scrolled = window.scrollY > 10;
            setIsScrolled(scrolled);
        };

        window.addEventListener('scroll', handleScroll);

        // Add Bootstrap CDN link
        const linkElements = [
            { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css' },
            { rel: 'stylesheet', href: '/assets/css/fontawesome-all.min.css' }
        ];

        linkElements.forEach(({ rel, href }) => {
            if (!document.querySelector(`link[href="${href}"]`)) {
                const link = document.createElement('link');
                link.rel = rel;
                link.href = href;
                document.head.appendChild(link);
            }
        });

        // Add Bootstrap JS
        if (!document.querySelector('script[src*="bootstrap.bundle.min.js"]')) {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js';
            document.body.appendChild(script);
        }

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
                                <Link href="/"><img src="/assets/img/logo/logo.png" alt="" style={{ maxWidth: '160px' }} /></Link>
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
                                            <Link href="/notifications" className="btn btn-link position-relative me-4 text-primary">
                                                <i className="fas fa-bell fa-lg"></i>
                                                {alertCount > 0 && (
                                                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                                        {alertCount}
                                                    </span>
                                                )}
                                            </Link>
                                            <div className="dropdown">
                                                <button className="btn btn-link text-primary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                                                    <img src="/assets/img/avatar/avatar-1.jpg" alt="" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
                                                </button>
                                                <ul className="dropdown-menu">
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
                                            <Link href="/notifications" className="btn btn-link position-relative me-4 text-primary">
                                                <i className="fas fa-bell fa-lg"></i>
                                                {alertCount > 0 && (
                                                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                                        {alertCount}
                                                    </span>
                                                )}
                                            </Link>
                                            <div className="dropdown">
                                                <button className="btn btn-link text-primary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                                                    <img src="/assets/img/avatar/avatar-1.jpg" alt="" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
                                                </button>
                                                <ul className="dropdown-menu">
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
