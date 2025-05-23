    import { Head, useForm } from '@inertiajs/react';
    import { FormEventHandler } from 'react';

    type RegisterForm = {
        name: string;
        email: string;
        password: string;
        password_confirmation: string;
        role: 'employer' | 'job_seeker';
    };

    export default function Register() {
        const { data, setData, post, processing, errors, reset } = useForm<RegisterForm>({
            name: '',
            email: '',
            password: '',
            password_confirmation: '',
            role: 'job_seeker',
        });

        const submit: FormEventHandler = (e) => {
            e.preventDefault();
            
            // Get the current CSRF token from meta tag
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            
            post(route('register'), {
                headers: {
                    'X-CSRF-TOKEN': csrfToken || '',
                },
                onFinish: () => reset('password', 'password_confirmation'),
                onError: (errors) => {
                    // Handle CSRF token errors
                    if (errors.hasOwnProperty('_token')) {
                        // CSRF token mismatch - refresh the page to get a new token
                        window.location.reload();
                    }
                },
            });
        };

        return (
            <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gray-100">
                <Head title="Register" />
                
                <div className="mb-8">
                    <a href="/">
                        <h1 className="text-4xl font-bold">JobPortal</h1>
                    </a>
                </div>

                <div className="w-full max-w-3xl px-6">
                    <h2 className="text-3xl font-semibold text-center mb-2">Join as a client or freelancer</h2>
                    
                    {/* Role Selection Cards */}
                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                        <button
                            type="button"
                            onClick={() => setData('role', 'employer')}
                            className={`p-6 border-2 rounded-lg flex flex-col items-center gap-4 transition-all hover:border-green-500 ${
                                data.role === 'employer' ? 'border-green-500 bg-green-50' : 'border-gray-200'
                            }`}
                        >
                            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gray-100">
                                <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                                </svg>
                            </div>
                            <div className="text-center">
                                <h3 className="text-xl font-semibold mb-1">I'm a client,</h3>
                                <p className="text-gray-600">hiring for a project</p>
                            </div>
                        </button>

                        <button
                            type="button"
                            onClick={() => setData('role', 'job_seeker')}
                            className={`p-6 border-2 rounded-lg flex flex-col items-center gap-4 transition-all hover:border-green-500 ${
                                data.role === 'job_seeker' ? 'border-green-500 bg-green-50' : 'border-gray-200'
                            }`}
                        >
                            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gray-100">
                                <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                </svg>
                            </div>
                            <div className="text-center">
                                <h3 className="text-xl font-semibold mb-1">I'm a freelancer,</h3>
                                <p className="text-gray-600">looking for work</p>
                            </div>
                        </button>
                    </div>

                    {/* Registration Form */}
                    <div className="bg-white shadow-md rounded-lg p-6">
                        <form onSubmit={submit}>
                            <div className="mb-4">
                                <label className="block font-medium text-sm text-gray-700" htmlFor="name">
                                    Name
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    required
                                    autoFocus
                                />
                                {errors.name && <div className="text-red-600 text-sm mt-1">{errors.name}</div>}
                            </div>

                            <div className="mb-4">
                                <label className="block font-medium text-sm text-gray-700" htmlFor="email">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                                    value={data.email}
                                    onChange={e => setData('email', e.target.value)}
                                    required
                                />
                                {errors.email && <div className="text-red-600 text-sm mt-1">{errors.email}</div>}
                            </div>

                            <div className="mb-4">
                                <label className="block font-medium text-sm text-gray-700" htmlFor="password">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                                    value={data.password}
                                    onChange={e => setData('password', e.target.value)}
                                    required
                                    autoComplete="new-password"
                                />
                                {errors.password && <div className="text-red-600 text-sm mt-1">{errors.password}</div>}
                            </div>

                            <div className="mb-4">
                                <label className="block font-medium text-sm text-gray-700" htmlFor="password_confirmation">
                                    Confirm Password
                                </label>
                                <input
                                    id="password_confirmation"
                                    type="password"
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                                    value={data.password_confirmation}
                                    onChange={e => setData('password_confirmation', e.target.value)}
                                    required
                                    autoComplete="new-password"
                                />
                            </div>

                            <div className="flex items-center justify-between mt-6">
                                <a
                                    href={route('login')}
                                    className="text-sm text-gray-600 hover:text-gray-900"
                                >
                                    Already registered?
                                </a>

                                <button
                                    type="submit"
                                    className="px-6 py-3 bg-green-600 text-white rounded-md font-semibold text-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                                    disabled={processing}
                                >
                                    Apply as {data.role === 'employer' ? 'Client' : 'Freelancer'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
