import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

import AuthLayout from '../../layouts/auth-layout';

interface LoginForm {
    email: string;
    password: string;
    remember: boolean;
    [key: string]: string | boolean;
}

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const { data, setData, post, processing, errors, reset } = useForm<LoginForm>({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <AuthLayout title="Log in to your account" description="Enter your email and password below to log in">
            <Head title="Log in" />

            <form onSubmit={submit}>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input
                        type="email"
                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                        id="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autoFocus
                    />
                    {errors.email && (
                        <div className="invalid-feedback">{errors.email}</div>
                    )}
                </div>

                <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center">
                        <label htmlFor="password" className="form-label">Password</label>
                        {canResetPassword && (
                            <a href={route('password.request')} className="text-primary text-decoration-none">
                                Forgot password?
                            </a>
                        )}
                    </div>
                    <input
                        type="password"
                        className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                        id="password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        required
                    />
                    {errors.password && (
                        <div className="invalid-feedback">{errors.password}</div>
                    )}
                </div>

                <div className="mb-3 form-check">
                    <input
                        type="checkbox"
                        className="form-check-input"
                        id="remember"
                        checked={data.remember}
                        onChange={(e) => setData('remember', e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="remember">Remember me</label>
                </div>

                <button
                    type="submit"
                    className="btn btn-primary w-100"
                    disabled={processing}
                >
                    {processing ? (
                        <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Logging in...
                        </>
                    ) : (
                        'Log in'
                    )}
                </button>

                <div className="text-center mt-3">
                    Don't have an account?{' '}
                    <a href={route('register')} className="text-primary text-decoration-none">
                        Sign up
                    </a>
                </div>
            </form>

            {status && (
                <div className="alert alert-success mt-3" role="alert">
                    {status}
                </div>
            )}
        </AuthLayout>
    );
}
