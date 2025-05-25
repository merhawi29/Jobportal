import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';
import Nav from '../components/nav';

const Contact = () => {
    const auth = usePage().props.auth as { user: any };
    const { data, setData, post, processing, errors, reset } = useForm({
        name: auth.user ? auth.user.name : '',
        email: auth.user ? auth.user.email : '',
        subject: '',
        message: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/contact', {
            preserveScroll: true,
            onSuccess: () => {
                reset();
            },
        });
    };

    return (
        <>
            <Head>
                <title>Contact Us - JobPortal</title>
                <meta name="description" content="Get in touch with JobPortal team" />
            </Head>

            <Nav />

            <div className="py-5">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-md-8">
                            <div className="card shadow-sm">
                                <div className="card-body p-4">
                                    <h2 className="text-center text-success mb-4">Contact Us</h2>
                                    <p className="text-center text-muted mb-4">
                                        Have questions? We'd love to hear from you. Send us a message
                                        and we'll respond as soon as possible.
                                    </p>

                                    <form onSubmit={handleSubmit}>
                                        <div className="mb-3">
                                            <label htmlFor="name" className="form-label">Name</label>
                                            <input
                                                type="text"
                                                className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                                id="name"
                                                placeholder="Enter your name"
                                                onChange={e => setData('name', e.target.value)}
                                                required
                                            />
                                            {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                                        </div>

                                        <div className="mb-3">
                                            <label htmlFor="email" className="form-label">Email</label>
                                            <input
                                                type="email"
                                                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                                id="email"
                                                placeholder="Enter your email"
                                                onChange={e => setData('email', e.target.value)}
                                                required
                                            />
                                            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                                        </div>

                                        <div className="mb-3">
                                            <label htmlFor="subject" className="form-label">Subject</label>
                                            <input
                                                type="text"
                                                className={`form-control ${errors.subject ? 'is-invalid' : ''}`}
                                                id="subject"
                                                placeholder="Enter subject"
                                                onChange={e => setData('subject', e.target.value)}
                                                required
                                            />
                                            {errors.subject && <div className="invalid-feedback">{errors.subject}</div>}
                                        </div>

                                        <div className="mb-4">
                                            <label htmlFor="message" className="form-label">Message</label>
                                            <textarea
                                                className={`form-control ${errors.message ? 'is-invalid' : ''}`}
                                                id="message"
                                                rows={5}
                                                placeholder="Type your message here..."
                                                onChange={e => setData('message', e.target.value)}
                                                required
                                            ></textarea>
                                            {errors.message && <div className="invalid-feedback">{errors.message}</div>}
                                        </div>

                                        <div className="d-grid">
                                            <button 
                                                type="submit" 
                                                className="btn btn-success btn-lg"
                                                disabled={processing}
                                            >
                                                {processing ? 'Sending...' : 'Send Message'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Contact; 