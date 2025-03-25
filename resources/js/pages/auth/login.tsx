import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

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
                        <input
                            id="password"
                            type="password"
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            value={data.password}
                            onChange={e => setData('password', e.target.value)}
                            required
                            autoComplete="current-password"
                        />
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

                    <div className="flex items-center justify-end mt-4">
                        <a
                            href={route('register')}
                            className="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Need an account?
                        </a>

                        <button
                            type="submit"
                            className="ml-4 inline-flex items-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 focus:bg-gray-700 active:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
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
