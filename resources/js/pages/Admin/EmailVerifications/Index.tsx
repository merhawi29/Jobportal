import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { useTheme, ThemeProvider } from '@/contexts/ThemeContext';
import axios from 'axios';
import { 
    Check, 
    X, 
    Mail, 
    Search, 
    ChevronUp, 
    ChevronDown, 
    AlertTriangle,
    CheckCircle,
    Trash2
} from 'lucide-react';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    status: string;
    verified: boolean;
    verification_date: string | null;
    created_at: string;
}

function EmailVerificationsPage() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [sortField, setSortField] = useState<keyof User>('verified');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [filterVerified, setFilterVerified] = useState<string>('all');
    const [filterRole, setFilterRole] = useState<string>('all');
    const [loadingUser, setLoadingUser] = useState<Record<number, string>>({});

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/admin/email-verifications/users');
            setUsers(response.data);
            setError(null);
        } catch (err) {
            console.error('Failed to fetch users:', err);
            setError('Failed to load users. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (userId: number) => {
        setLoadingUser(prev => ({ ...prev, [userId]: 'verify' }));
        try {
            await axios.post(`/admin/email-verifications/${userId}/verify`);
            fetchUsers();
        } catch (err) {
            console.error('Failed to verify user:', err);
            setError('Failed to verify user. Please try again.');
        } finally {
            setLoadingUser(prev => {
                const newState = { ...prev };
                delete newState[userId];
                return newState;
            });
        }
    };

    const handleUnverify = async (userId: number) => {
        setLoadingUser(prev => ({ ...prev, [userId]: 'unverify' }));
        try {
            await axios.post(`/admin/email-verifications/${userId}/unverify`);
            fetchUsers();
        } catch (err) {
            console.error('Failed to unverify user:', err);
            setError('Failed to unverify user. Please try again.');
        } finally {
            setLoadingUser(prev => {
                const newState = { ...prev };
                delete newState[userId];
                return newState;
            });
        }
    };

    const handleResendVerification = async (userId: number) => {
        setLoadingUser(prev => ({ ...prev, [userId]: 'resend' }));
        try {
            await axios.post(`/admin/email-verifications/${userId}/resend`);
            alert('Verification email sent successfully');
        } catch (err) {
            console.error('Failed to resend verification email:', err);
            setError('Failed to resend verification email. Please try again.');
        } finally {
            setLoadingUser(prev => {
                const newState = { ...prev };
                delete newState[userId];
                return newState;
            });
        }
    };

    const handleDeleteUser = async (userId: number) => {
        if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            return;
        }
        
        setLoadingUser(prev => ({ ...prev, [userId]: 'delete' }));
        try {
            await axios.delete(`/admin/email-verifications/${userId}`);
            setUsers(prev => prev.filter(user => user.id !== userId));
            setError(null);
        } catch (err) {
            console.error('Failed to delete user:', err);
            setError('Failed to delete user. Please try again.');
        } finally {
            setLoadingUser(prev => {
                const newState = { ...prev };
                delete newState[userId];
                return newState;
            });
        }
    };

    const handleSort = (field: keyof User) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const getSortedUsers = () => {
        // First filter users
        let filteredUsers = users.filter(user => {
            // Filter by search term
            const matchesSearch = 
                user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase());
            
            // Filter by verification status
            const matchesVerification = 
                filterVerified === 'all' ||
                (filterVerified === 'verified' && user.verified) ||
                (filterVerified === 'unverified' && !user.verified);
            
            // Filter by role
            const matchesRole = 
                filterRole === 'all' ||
                user.role === filterRole;
            
            return matchesSearch && matchesVerification && matchesRole;
        });
        
        // Then sort the filtered users
        return filteredUsers.sort((a, b) => {
            if (sortField === 'verified') {
                if (sortDirection === 'asc') {
                    return a.verified === b.verified ? 0 : a.verified ? 1 : -1;
                } else {
                    return a.verified === b.verified ? 0 : a.verified ? -1 : 1;
                }
            }
            
            // For other fields
            const aValue = a[sortField];
            const bValue = b[sortField];
            
            if (aValue === bValue) return 0;
            if (aValue === null) return sortDirection === 'asc' ? -1 : 1;
            if (bValue === null) return sortDirection === 'asc' ? 1 : -1;
            
            return sortDirection === 'asc'
                ? aValue < bValue ? -1 : 1
                : aValue < bValue ? 1 : -1;
        });
    };

    const getRoleLabel = (role: string) => {
        switch (role) {
            case 'admin': return 'Admin';
            case 'employer': return 'Employer';
            case 'job_seeker': return 'Job Seeker';
            default: return role;
        }
    };

    const getSortIcon = (field: keyof User) => {
        if (sortField !== field) return null;
        return sortDirection === 'asc' ? <ChevronUp className="inline h-4 w-4" /> : <ChevronDown className="inline h-4 w-4" />;
    };

    return (
        <AdminLayout>
            <Head title="Email Verifications" />
            <div className={`p-6 ${isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
                <h1 className="text-2xl font-bold mb-6">User Email Verification Management</h1>
                
                {error && (
                    <div className={`mb-4 p-4 rounded-md bg-red-100 text-red-700 ${isDark ? 'bg-red-900 text-red-200' : ''}`}>
                        <AlertTriangle className="inline h-5 w-5 mr-2" />
                        {error}
                    </div>
                )}

                {/* Filters and Search */}
                <div className="mb-6 flex flex-col md:flex-row gap-4 justify-between">
                    <div className="flex flex-col sm:flex-row gap-2">
                        <select 
                            value={filterVerified}
                            onChange={(e) => setFilterVerified(e.target.value)}
                            className={`p-2 rounded-md border ${
                                isDark 
                                    ? 'bg-gray-800 border-gray-700 text-white' 
                                    : 'bg-white border-gray-300 text-gray-700'
                            }`}
                        >
                            <option value="all">All Verification Status</option>
                            <option value="verified">Verified</option>
                            <option value="unverified">Unverified</option>
                        </select>
                        
                        <select 
                            value={filterRole}
                            onChange={(e) => setFilterRole(e.target.value)}
                            className={`p-2 rounded-md border ${
                                isDark 
                                    ? 'bg-gray-800 border-gray-700 text-white' 
                                    : 'bg-white border-gray-300 text-gray-700'
                            }`}
                        >
                            <option value="all">All Roles</option>
                            <option value="admin">Admin</option>
                            <option value="employer">Employer</option>
                            <option value="job_seeker">Job Seeker</option>
                        </select>
                    </div>

                    <div className={`relative ${isDark ? 'text-white' : 'text-gray-600'}`}>
                        <input 
                            type="text"
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={`p-2 pl-10 rounded-md border w-full ${
                                isDark 
                                    ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' 
                                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                            }`}
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <Search className="h-5 w-5" />
                        </div>
                    </div>
                </div>

                {/* Users Table */}
                <div className={`rounded-lg shadow overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className={isDark ? 'bg-gray-700' : 'bg-gray-50'}>
                                <tr>
                                    <th 
                                        className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer ${isDark ? 'text-gray-300' : 'text-gray-500'}`}
                                        onClick={() => handleSort('name')}
                                    >
                                        Name {getSortIcon('name')}
                                    </th>
                                    <th 
                                        className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer ${isDark ? 'text-gray-300' : 'text-gray-500'}`}
                                        onClick={() => handleSort('email')}
                                    >
                                        Email {getSortIcon('email')}
                                    </th>
                                    <th 
                                        className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer ${isDark ? 'text-gray-300' : 'text-gray-500'}`}
                                        onClick={() => handleSort('role')}
                                    >
                                        Role {getSortIcon('role')}
                                    </th>
                                    <th 
                                        className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer ${isDark ? 'text-gray-300' : 'text-gray-500'}`}
                                        onClick={() => handleSort('verified')}
                                    >
                                        Verification Status {getSortIcon('verified')}
                                    </th>
                                    <th 
                                        className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer ${isDark ? 'text-gray-300' : 'text-gray-500'}`}
                                        onClick={() => handleSort('verification_date')}
                                    >
                                        Verification Date {getSortIcon('verification_date')}
                                    </th>
                                    <th 
                                        className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-500'}`}
                                    >
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className={`${isDark ? 'bg-gray-800' : 'bg-white'} divide-y ${isDark ? 'divide-gray-700' : 'divide-gray-200'}`}>
                                {loading ? (
                                    <tr>
                                        <td colSpan={6} className={`px-6 py-4 text-center ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
                                            Loading users...
                                        </td>
                                    </tr>
                                ) : getSortedUsers().length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className={`px-6 py-4 text-center ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
                                            No users found matching the criteria.
                                        </td>
                                    </tr>
                                ) : (
                                    getSortedUsers().map((user) => (
                                        <tr 
                                            key={user.id} 
                                            className={isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}
                                        >
                                            <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                {user.name}
                                            </td>
                                            <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
                                                {user.email}
                                            </td>
                                            <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
                                                {getRoleLabel(user.role)}
                                            </td>
                                            <td className={`px-6 py-4 whitespace-nowrap text-sm`}>
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                    user.verified 
                                                        ? isDark ? 'bg-green-200 text-green-800' : 'bg-green-100 text-green-800'
                                                        : isDark ? 'bg-red-200 text-red-800' : 'bg-red-100 text-red-800'
                                                }`}>
                                                    {user.verified ? (
                                                        <>
                                                            <CheckCircle className="mr-1 h-3 w-3" />
                                                            Verified
                                                        </>
                                                    ) : (
                                                        <>
                                                            <X className="mr-1 h-3 w-3" />
                                                            Unverified
                                                        </>
                                                    )}
                                                </span>
                                            </td>
                                            <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
                                                {user.verification_date || 'Not verified'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                                {user.verified ? (
                                                    <button
                                                        onClick={() => handleUnverify(user.id)}
                                                        disabled={loadingUser[user.id] === 'unverify'}
                                                        className={`inline-flex items-center text-yellow-600 hover:text-yellow-900 ${isDark ? 'text-yellow-500 hover:text-yellow-300' : ''}`}
                                                    >
                                                        {loadingUser[user.id] === 'unverify' ? (
                                                            <span>Processing...</span>
                                                        ) : (
                                                            <>
                                                                <X className="mr-1 h-4 w-4" />
                                                                Unverify
                                                            </>
                                                        )}
                                                    </button>
                                                ) : (
                                                    <>
                                                        <button
                                                            onClick={() => handleVerify(user.id)}
                                                            disabled={loadingUser[user.id] === 'verify'}
                                                            className={`inline-flex items-center text-green-600 hover:text-green-900 ${isDark ? 'text-green-500 hover:text-green-300' : ''}`}
                                                        >
                                                            {loadingUser[user.id] === 'verify' ? (
                                                                <span>Processing...</span>
                                                            ) : (
                                                                <>
                                                                    <Check className="mr-1 h-4 w-4" />
                                                                    Verify
                                                                </>
                                                            )}
                                                        </button>
                                                        <button
                                                            onClick={() => handleResendVerification(user.id)}
                                                            disabled={loadingUser[user.id] === 'resend'}
                                                            className={`inline-flex items-center text-blue-600 hover:text-blue-900 ${isDark ? 'text-blue-500 hover:text-blue-300' : ''}`}
                                                        >
                                                            {loadingUser[user.id] === 'resend' ? (
                                                                <span>Sending...</span>
                                                            ) : (
                                                                <>
                                                                    <Mail className="mr-1 h-4 w-4" />
                                                                    Resend Email
                                                                </>
                                                            )}
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteUser(user.id)}
                                                            disabled={loadingUser[user.id] === 'delete'}
                                                            className={`inline-flex items-center text-red-600 hover:text-red-900 ${isDark ? 'text-red-500 hover:text-red-300' : ''}`}
                                                        >
                                                            {loadingUser[user.id] === 'delete' ? (
                                                                <span>Deleting...</span>
                                                            ) : (
                                                                <>
                                                                    <Trash2 className="mr-1 h-4 w-4" />
                                                                    Delete
                                                                </>
                                                            )}
                                                        </button>
                                                    </>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

// Wrap with ThemeProvider to avoid the context error
export default function EmailVerifications() {
    return (
        <ThemeProvider>
            <EmailVerificationsPage />
        </ThemeProvider>
    );
} 