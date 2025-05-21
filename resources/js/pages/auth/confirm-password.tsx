// Components
import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

export default function ConfirmPassword() {
    const { data, setData, post, processing, errors, reset } = useForm({
        password: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('password.confirm'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <AuthLayout
            title="Confirm your password"
            description="This is a secure area of the application. Please confirm your password before continuing."
        >
            <Head title="Confirm password" />

            <form onSubmit={submit}>
                <div className="space-y-6">
                    <div className="grid gap-2">
                        <Label htmlFor="password" className="text-lg font-medium text-gray-800">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            name="password"
                            placeholder="Password"
                            autoComplete="current-password"
                            value={data.password}
                            autoFocus
                            onChange={(e) => setData('password', e.target.value)}
                            className="border border-gray-200 p-2 text-lg bg-gray-50"
                        />

                        <InputError message={errors.password} />
                    </div>

                    <div className="flex items-center">
                        <Button 
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 text-base"
                            variant="success"
                            disabled={processing}
                        >
                            {processing && <LoaderCircle className="h-5 w-5 animate-spin mr-2" />}
                            Confirm password
                        </Button>
                    </div>
                </div>
            </form>
        </AuthLayout>
    );
}
