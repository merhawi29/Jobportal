// Components
import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import AuthLayout from '@/layouts/auth-layout';

export default function VerifyEmail({ status }: { status?: string }) {
    const { post, processing } = useForm({});

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('verification.send'));
    };

    return (
        <AuthLayout title="Verify email" description="Please verify your email address by clicking on the link we just emailed to you.">
            <Head title="Email verification" />

            {status === 'verification-link-sent' && (
                <div className="mb-4 text-center text-sm font-medium text-green-600">
                    A new verification link has been sent to the email address you provided during registration.
                </div>
            )}

            <form onSubmit={submit} className="space-y-6 text-center">
                <Button 
                    disabled={processing} 
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 text-base w-full"
                    variant="success"
                >
                    {processing && <LoaderCircle className="h-5 w-5 animate-spin mr-2" />}
                    Resend verification email
                </Button>

                <div className="text-center text-base mt-4">
                    <TextLink 
                        href={route('logout')} 
                        method="post" 
                        className="mx-auto block text-blue-600 hover:text-blue-800 font-semibold"
                    >
                        Log out
                    </TextLink>
                </div>
            </form>
        </AuthLayout>
    );
}
