import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

type LoginForm = {
    email: string;
    password: string;
    remember: boolean;
};

export default function Login() {
    const { data, setData, post, processing, errors } = useForm<LoginForm>({
        email: '',
        password: '',
        remember: false,
    });
    const [showPassword, setShowPassword] = useState(false);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gray-100">
            <Head title="Log in" />

            <div>
                <a href="/">
                    <h1 className="text-4xl font-bold">JobPortal</h1>
                </a>
            </div>

            <div className="w-full sm:max-w-md mt-6 px-6 py-4 bg-white shadow-md overflow-hidden sm:rounded-lg">
                <form onSubmit={submit}>
                    <div className="mb-4">
                        <label className="block font-medium text-sm text-gray-700" htmlFor="email">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            value={data.email}
                            onChange={e => setData('email', e.target.value)}
                            required
                            autoFocus
                        />
                        {errors.email && <div className="text-red-600 text-sm">{errors.email}</div>}
                    </div>

                    <div className="mb-4">
                        <label className="block font-medium text-sm text-gray-700" htmlFor="password">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                value={data.password}
                                onChange={e => setData('password', e.target.value)}
                                required
                                autoComplete="current-password"
                            />
                            <button
                                id="toggle-password"
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                                aria-label="Show password as plain text. Warning: this will display your password on the screen."
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                        {errors.password && <div className="text-red-600 text-sm">{errors.password}</div>}
                    </div>

                    <div className="block mb-4">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
                                checked={data.remember}
                                onChange={e => setData('remember', e.target.checked)}
                            />
                            <span className="ml-2 text-sm text-gray-600">Remember me</span>
                        </label>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                        <div>
                            <a
                                href={route('register')}
                                className="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Need an account?
                            </a>
                            <span className="mx-2 text-gray-500">|</span>
                            <a
                                href={route('password.request')}
                                className="underline text-sm text-blue-600 hover:text-blue-800 font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Forgot your password?
                            </a>
                        </div>

                        <button
                            type="submit"
                            className="inline-flex items-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 focus:bg-gray-700 active:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                            disabled={processing}
                        >
                            Log in
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
