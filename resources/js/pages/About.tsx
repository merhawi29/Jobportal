import React from 'react';
import { Head, usePage } from '@inertiajs/react';
import { AboutStyles } from '@/Styles/AboutStyles';
import Nav from '../components/nav';


const About: React.FC = () => {
    const flash = usePage().props.flash as { success: string | null };

    return (
        <>
            <Head>
                <title>About Us - JobPortal</title>
                <meta name="description" content="Learn more about JobPortal - Your trusted partner in connecting talented professionals with outstanding career opportunities." />
            </Head>

            {flash.success && (
                <div className="alert alert-success alert-dismissible fade show m-4" role="alert">
                    {flash.success}
                    <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            )}

            <style>{AboutStyles.styles}</style>
      <Nav />

            {/* Hero Section */}
            <section className="bg-success text-white py-5">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-6">
                            <h1 className="display-4 fw-bold mb-4">Connecting Talent with Opportunity</h1>
                            <p className="lead mb-4">At JobPortal, we're dedicated to transforming the way people find their dream careers and how companies discover exceptional talent.</p>
                        </div>
                        <div className="col-lg-6">
                            <img 
                                src="/assets/img/about/advert.jpg" 
                                alt="About JobPortal" 
                                className="img-fluid hover-lift hero-image" 
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission & Vision Section */}
            <section className="py-5">
                <div className="container">
                    <div className="row g-4">
                        <div className="col-md-6">
                            <div className="card h-100 border-0 shadow-sm hover-lift">
                                <div className="card-body p-4">
                                    <div className="d-flex align-items-center mb-3">
                                        <div className="bg-success p-3 rounded-circle me-3 icon-hover">
                                            <i className="fas fa-bullseye text-white fa-2x"></i>
                                        </div>
                                        <h2 className="h3 mb-0">Our Mission</h2>
                                    </div>
                                    <p className="text-muted">To empower individuals in their career journey and help organizations build strong teams by providing a transparent, efficient, and user-friendly job marketplace.</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="card h-100 border-0 shadow-sm hover-lift">
                                <div className="card-body p-4">
                                    <div className="d-flex align-items-center mb-3">
                                        <div className="bg-success p-3 rounded-circle me-3 icon-hover">
                                            <i className="fas fa-eye text-white fa-2x"></i>
                                        </div>
                                        <h2 className="h3 mb-0">Our Vision</h2>
                                    </div>
                                    <p className="text-muted">To become the world's most trusted and innovative platform for career development and talent acquisition, making meaningful employment accessible to everyone.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Choose Us Section */}
            <section className="py-5" style={{ backgroundColor: '#f8fdf9' }}>
                <div className="container">
                    <h2 className="text-center mb-5 text-success">Why Choose JobPortal</h2>
                    <div className="row g-4">
                        <div className="col-lg-3 col-md-6">
                            <div className="text-center hover-lift">
                                <div className="bg-white p-4 rounded-circle shadow-sm d-inline-block mb-3 icon-hover">
                                    <i className="fas fa-users fa-2x text-success"></i>
                                </div>
                                <h3 className="h5 mb-3">Large Network</h3>
                                <p className="text-muted">Connect with thousands of employers and job seekers across various industries.</p>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                            <div className="text-center hover-lift">
                                <div className="bg-white p-4 rounded-circle shadow-sm d-inline-block mb-3 icon-hover">
                                    <i className="fas fa-shield-alt fa-2x text-success"></i>
                                </div>
                                <h3 className="h5 mb-3">Verified Listings</h3>
                                <p className="text-muted">All job listings are verified to ensure legitimacy and quality.</p>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                            <div className="text-center hover-lift">
                                <div className="bg-white p-4 rounded-circle shadow-sm d-inline-block mb-3 icon-hover">
                                    <i className="fas fa-tools fa-2x text-success"></i>
                                </div>
                                <h3 className="h5 mb-3">Smart Tools</h3>
                                <p className="text-muted">Advanced search and matching algorithms to find the perfect fit.</p>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                            <div className="text-center hover-lift">
                                <div className="bg-white p-4 rounded-circle shadow-sm d-inline-block mb-3 icon-hover">
                                    <i className="fas fa-headset fa-2x text-success"></i>
                                </div>
                                <h3 className="h5 mb-3">24/7 Support</h3>
                                <p className="text-muted">Dedicated support team to assist you throughout your journey.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-5">
                <div className="container">
                    <div className="row g-4 text-center">
                        <div className="col-lg-3 col-md-6">
                            <div className="stat-card p-3">
                                <h2 className="display-4 fw-bold text-success mb-2">500K+</h2>
                                <p className="text-muted mb-0">Active Users</p>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                            <div className="stat-card p-3">
                                <h2 className="display-4 fw-bold text-success mb-2">50K+</h2>
                                <p className="text-muted mb-0">Companies</p>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                            <div className="stat-card p-3">
                                <h2 className="display-4 fw-bold text-success mb-2">100K+</h2>
                                <p className="text-muted mb-0">Jobs Posted</p>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                            <div className="stat-card p-3">
                                <h2 className="display-4 fw-bold text-success mb-2">200K+</h2>
                                <p className="text-muted mb-0">Successful Placements</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Team Members Section */}
            <section className="py-5" style={{ backgroundColor: '#f8fdf9' }}>
                <div className="container">
                    <h2 className="text-center mb-2 text-success">Our Team</h2>
                    <p className="text-center text-muted mb-5">Meet the talented individuals behind our success</p>
                    
                    <div className="row g-4">
                        <div className="col-lg-4 col-md-6">
                            <div className="member-card shadow-sm">
                                <div className="member-image-container">
                                    <img 
                                        src="/assets/img/about/Huriya.jpg" 
                                        alt="Huriya" 
                                        className="member-image"
                                    />
                                </div>
                                <div className="member-info">
                                    <h3 className="h4 mb-1">Huriya Mohammed</h3>
                                    <div className="member-role">Business Analyst</div>
                                    <p className="member-bio">
                                        Expert in business analysis and process optimization. 
                                        Skilled at identifying market trends and developing strategic solutions for job market needs.
                                    </p>
                                    <div className="expertise-tags">
                                        <span className="expertise-tag">Data Analysis</span>
                                        <span className="expertise-tag">Market Research</span>
                                        <span className="expertise-tag">Strategy</span>
                                    </div>
                                    <div className="member-social">
                                        <a href="#" className="social-icon"><i className="fab fa-github"></i></a>
                                        <a href="#" className="social-icon"><i className="fab fa-linkedin"></i></a>
                                        <a href="#" className="social-icon"><i className="fab fa-twitter"></i></a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-4 col-md-6">
                            <div className="member-card shadow-sm">
                                <div className="member-image-container">
                                    <img 
                                        src="/assets/img/about/merhawi.jpg" 
                                        alt="Merhawi" 
                                        className="member-image"
                                    />
                                </div>
                                <div className="member-info">
                                    <h3 className="h4 mb-1">Merhawi Tekle</h3>
                                    <div className="member-role">Programmer</div>
                                    <p className="member-bio">
                                        Skilled software developer with expertise in multiple programming languages. 
                                        Focused on developing efficient and innovative solutions for our platform.
                                    </p>
                                    <div className="expertise-tags">
                                        <span className="expertise-tag">Software Development</span>
                                        <span className="expertise-tag">Problem Solving</span>
                                        <span className="expertise-tag">Code Optimization</span>
                                    </div>
                                    <div className="member-social">
                                        <a href="#" className="social-icon"><i className="fab fa-github"></i></a>
                                        <a href="#" className="social-icon"><i className="fab fa-linkedin"></i></a>
                                        <a href="#" className="social-icon"><i className="fab fa-twitter"></i></a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-4 col-md-6">
                            <div className="member-card shadow-sm">
                                <div className="member-image-container">
                                    <img 
                                        src="/assets/img/about/all.jpg" 
                                        alt="All" 
                                        className="member-image"
                                    />
                                </div>
                                <div className="member-info">
                                    <h3 className="h4 mb-1">All Abdurehman</h3>
                                    <div className="member-role">Project Manager</div>
                                    <p className="member-bio">
                                        Experienced project manager leading team initiatives and ensuring successful delivery. 
                                        Expert in coordinating resources and maintaining project timelines.
                                    </p>
                                    <div className="expertise-tags">
                                        <span className="expertise-tag">Project Management</span>
                                        <span className="expertise-tag">Team Leadership</span>
                                        <span className="expertise-tag">Agile</span>
                                    </div>
                                    <div className="member-social">
                                        <a href="#" className="social-icon"><i className="fab fa-github"></i></a>
                                        <a href="#" className="social-icon"><i className="fab fa-linkedin"></i></a>
                                        <a href="#" className="social-icon"><i className="fab fa-twitter"></i></a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-5 bg-success text-white">
                <div className="container text-center">
                    <h2 className="mb-4">Ready to Start Your Journey?</h2>
                    <p className="lead mb-4">Join thousands of professionals who trust JobPortal for their career growth</p>
                    <div className="d-flex justify-content-center gap-3">
                        <a href="/register" className="btn btn-light btn-lg px-4 cta-button">Get Started</a>
                        <a href="/contact" className="btn btn-outline-light btn-lg px-4 cta-button">Contact Us</a>
                    </div>
                </div>
            </section>
        </>
    );
};

export default About; 