import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Switch } from '@/Components/ui/switch';
import { useForm } from '@inertiajs/react';

export default function Index({ auth, alerts }) {
    const { delete: destroy, put } = useForm();

    const handleToggle = (alert) => {
        put(route('job-alerts.toggle', alert.id));
    };

    const handleDelete = (alert) => {
        if (confirm('Are you sure you want to delete this job alert?')) {
            destroy(route('job-alerts.destroy', alert.id));
        }
    };

    const formatSalary = (min, max) => {
        if (!min && !max) return 'Any';
        if (min && max) return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
        if (min) return `From $${min.toLocaleString()}`;
        return `Up to $${max.toLocaleString()}`;
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Job Alerts" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-semibold">Job Alerts</h2>
                        <Link href={route('job-alerts.create')}>
                            <Button>Create New Alert</Button>
                        </Link>
                    </div>

                    {alerts.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500 mb-4">You haven't set up any job alerts yet.</p>
                            <Link href={route('job-alerts.create')}>
                                <Button>Create Your First Alert</Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2">
                            {alerts.map((alert) => (
                                <Card key={alert.id}>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-lg font-medium">
                                            {alert.job_title || 'Any Job Title'}
                                        </CardTitle>
                                        <div className="flex items-center space-x-2">
                                            <Switch
                                                checked={alert.is_active}
                                                onCheckedChange={() => handleToggle(alert)}
                                            />
                                            <button
                                                onClick={() => handleDelete(alert)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-2">
                                            <div className="flex flex-wrap gap-2">
                                                {alert.job_type && (
                                                    <Badge variant="secondary">{alert.job_type}</Badge>
                                                )}
                                                {alert.location && (
                                                    <Badge variant="secondary">{alert.location}</Badge>
                                                )}
                                                <Badge variant="outline">
                                                    {formatSalary(alert.salary_min, alert.salary_max)}
                                                </Badge>
                                            </div>
                                            {alert.keywords && alert.keywords.length > 0 && (
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    {alert.keywords.map((keyword, index) => (
                                                        <Badge key={index} variant="outline">
                                                            {keyword}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            )}
                                            <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
                                                <span>
                                                    Notifications: {alert.notification_type}
                                                </span>
                                                <span>
                                                    Frequency: {alert.frequency}
                                                </span>
                                            </div>
                                            <div className="flex justify-end mt-4">
                                                <Link href={route('job-alerts.edit', alert.id)}>
                                                    <Button variant="outline" size="sm">
                                                        Edit Alert
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 