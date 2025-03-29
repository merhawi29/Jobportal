import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Textarea } from '@/Components/ui/textarea';

export default function Create({ auth }) {
    const { data, setData, post, processing, errors } = useForm({
        job_title: '',
        job_type: '',
        location: '',
        salary_min: '',
        salary_max: '',
        keywords: '',
        notification_type: 'email',
        frequency: 'immediately'
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('job-alerts.store'));
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Create Job Alert" />

            <div className="py-12">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Create Job Alert</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <Label htmlFor="job_title">Job Title</Label>
                                    <Input
                                        id="job_title"
                                        type="text"
                                        value={data.job_title}
                                        onChange={e => setData('job_title', e.target.value)}
                                        placeholder="Leave blank to match any job title"
                                        error={errors.job_title}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="job_type">Job Type</Label>
                                    <Select
                                        value={data.job_type}
                                        onValueChange={value => setData('job_type', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select job type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="">Any</SelectItem>
                                            <SelectItem value="Full-time">Full-time</SelectItem>
                                            <SelectItem value="Part-time">Part-time</SelectItem>
                                            <SelectItem value="Contract">Contract</SelectItem>
                                            <SelectItem value="Freelance">Freelance</SelectItem>
                                            <SelectItem value="Internship">Internship</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label htmlFor="location">Location</Label>
                                    <Input
                                        id="location"
                                        type="text"
                                        value={data.location}
                                        onChange={e => setData('location', e.target.value)}
                                        placeholder="Leave blank to match any location"
                                        error={errors.location}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="salary_min">Minimum Salary</Label>
                                        <Input
                                            id="salary_min"
                                            type="number"
                                            value={data.salary_min}
                                            onChange={e => setData('salary_min', e.target.value)}
                                            placeholder="Optional"
                                            error={errors.salary_min}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="salary_max">Maximum Salary</Label>
                                        <Input
                                            id="salary_max"
                                            type="number"
                                            value={data.salary_max}
                                            onChange={e => setData('salary_max', e.target.value)}
                                            placeholder="Optional"
                                            error={errors.salary_max}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="keywords">Keywords</Label>
                                    <Textarea
                                        id="keywords"
                                        value={data.keywords}
                                        onChange={e => setData('keywords', e.target.value)}
                                        placeholder="Enter keywords separated by commas"
                                        error={errors.keywords}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="notification_type">Notification Type</Label>
                                    <Select
                                        value={data.notification_type}
                                        onValueChange={value => setData('notification_type', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select notification type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="email">Email</SelectItem>
                                            <SelectItem value="push">Push</SelectItem>
                                            <SelectItem value="both">Both</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label htmlFor="frequency">Alert Frequency</Label>
                                    <Select
                                        value={data.frequency}
                                        onValueChange={value => setData('frequency', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select alert frequency" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="immediately">Immediately</SelectItem>
                                            <SelectItem value="daily">Daily Digest</SelectItem>
                                            <SelectItem value="weekly">Weekly Digest</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="flex justify-end">
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                    >
                                        Create Alert
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 