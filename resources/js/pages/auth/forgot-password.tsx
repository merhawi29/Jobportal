// Components
import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

export default function ForgotPassword({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };

    return (
        <AuthLayout title="Forgot password" description="Enter your email to receive a password reset link">
            <Head title="Forgot password" />

            {status && <div className="mb-4 text-center text-sm font-medium text-green-600">{status}</div>}

            <div className="space-y-6">
                <form onSubmit={submit}>
                    <div className="grid gap-2">
                        <Label htmlFor="email" className="text-lg font-medium text-gray-800">Email address</Label>
                        <Input
                            id="email"
                            type="email"
                            name="email"
                            autoComplete="off"
                            value={data.email}
                            autoFocus
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="email@example.com"
                            className="border border-gray-200 p-2 text-lg bg-gray-50"
                        />

                        <InputError message={errors.email} />
                    </div>

                    <div className="my-6 flex items-center justify-start">
                        <Button 
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 text-base"
                            variant="success"
                            disabled={processing}
                        >
                            {processing && <LoaderCircle className="h-5 w-5 animate-spin" />}
                            Email password reset link
                        </Button>
                    </div>
                </form>

                <div className="text-center text-base">
                    <span className="text-gray-800">Or, return to</span>
                    <TextLink href={route('login')} className="ml-2 text-blue-600 hover:text-blue-800 font-semibold">log in</TextLink>
                </div>
            </div>
        </AuthLayout>
    );
}
