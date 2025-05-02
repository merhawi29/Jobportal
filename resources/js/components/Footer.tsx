import React from 'react';
import { Link } from '@inertiajs/react';

const Footer = () => {
    return (
        <footer className="bg-dark text-light py-5">
            <div className="container">
                <div className="row">
                    {/* Company Info */}
                    <div className="col-lg-3 col-md-6 mb-4">
                        <div className="mb-4">
                            <div className="mb-4">
                                <Link href="/">
                                    <img src="/assets/img/logo/super.png" alt="logo" className="img-fluid" style={{ maxWidth: '160px' }} />
                                </Link>
                            </div>
                            <p className="text-muted mb-4">Your trusted source for finding the perfect job match. Connect with top employers and discover your next career opportunity.</p>
                            <div className="d-flex gap-3">
                                <a href="#" className="text-light fs-5 text-decoration-none">
                                    <i className="fab fa-facebook-f"></i>
                                </a>
                                <a href="#" className="text-light fs-5 text-decoration-none">
                                    <i className="fab fa-twitter"></i>
                                </a>
                                <a href="#" className="text-light fs-5 text-decoration-none">
                                    <i className="fab fa-linkedin-in"></i>
                                </a>
                                <a href="#" className="text-light fs-5 text-decoration-none">
                                    <i className="fab fa-instagram"></i>
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="col-lg-3 col-md-6 mb-4">
                        <h4 className="fw-bold mb-4">Quick Links</h4>
                        <ul className="list-unstyled">
                            <li className="mb-2">
                                <Link href="/about" className="text-muted text-decoration-none footer-link">About Us</Link>
                            </li>
                            <li className="mb-2">
                                <Link href="/jobs" className="text-muted text-decoration-none footer-link">Browse Jobs</Link>
                            </li>
                            <li className="mb-2">
                                <Link href="/contact" className="text-muted text-decoration-none footer-link">Contact Us</Link>
                            </li>
                            <li className="mb-2">
                                <Link href="/privacy" className="text-muted text-decoration-none footer-link">Privacy Policy</Link>
                            </li>
                            <li className="mb-2">
                                <Link href="/terms" className="text-muted text-decoration-none footer-link">Terms of Service</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Job Categories */}
                    <div className="col-lg-3 col-md-6 mb-4">
                        <h4 className="fw-bold mb-4">Job Categories</h4>
                        <ul className="list-unstyled">
                            <li className="mb-2">
                                <Link href="/category/technology" className="text-muted text-decoration-none footer-link">Technology</Link>
                            </li>
                            <li className="mb-2">
                                <Link href="/category/finance" className="text-muted text-decoration-none footer-link">Finance</Link>
                            </li>
                            <li className="mb-2">
                                <Link href="/category/healthcare" className="text-muted text-decoration-none footer-link">Healthcare</Link>
                            </li>
                            <li className="mb-2">
                                <Link href="/category/education" className="text-muted text-decoration-none footer-link">Education</Link>
                            </li>
                            <li className="mb-2">
                                <Link href="/category/marketing" className="text-muted text-decoration-none footer-link">Marketing</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div className="col-lg-3 col-md-6 mb-4">
                        <h4 className="fw-bold mb-4">Newsletter</h4>
                        <p className="text-muted mb-4">Subscribe to our newsletter for the latest job updates</p>
                        <form className="d-flex">
                            <input
                                type="email"
                                className="form-control me-2"
                                placeholder="Your email address"
                                style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', borderColor: 'rgba(255, 255, 255, 0.1)', color: '#fff' }}
                            />
                            <button
                                type="submit"
                                className="btn btn-primary px-3"
                                style={{ background: 'linear-gradient(135deg, #00b074 0%, #008c5d 100%)', border: 'none' }}
                            >
                                <i className="fas fa-paper-plane"></i>
                            </button>
                        </form>
                    </div>
                </div>

                {/* Copyright */}
                <div className="row mt-4">
                    <div className="col-12">
                        <div className="text-center text-muted border-top pt-4">
                            <p className="mb-0">&copy; {new Date().getFullYear()} Job Portal. All rights reserved.</p>
                        </div>
                    </div>
                </div>
            </div>

            <style>
                {`
                    .footer-link:hover {
                        color: #fff !important;
                        transition: color 0.2s ease;
                    }
                `}
            </style>
        </footer>
    );
};

export default Footer;
