'use client';

import { useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function AdminLoginPage() {
    const { loginAdmin } = useAuth();
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        if (email !== 'superadmin@gmail.com') {
            setError('This portal is for Admins only.');
            setIsSubmitting(false);
            return;
        }

        const success = await loginAdmin(email, password);

        if (success) {
            router.push('/admin');
        } else {
            setError('Invalid admin credentials');
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex min-h-[calc(100vh-200px)] items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
            <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-lg shadow-md border border-gray-200">
                <div className="text-center">
                    <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-100">
                        <ShieldCheck className="h-8 w-8 text-blue-600" />
                    </div>
                    <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-900">
                        Admin Portal
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Sign in to manage orders
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="-space-y-px rounded-md shadow-sm">
                        <div className="mb-4">
                            <Input
                                type="email"
                                required
                                placeholder="Admin Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>
                        <div className="relative">
                            <Input
                                type={showPassword ? "text" : "password"}
                                required
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                            >
                                {showPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm text-center font-medium">{error}</div>
                    )}

                    <div>
                        <Button
                            type="submit"
                            className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-900 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-900"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Verifying...' : 'Access Dashboard'}
                        </Button>
                    </div>

                    <div className="text-center mt-4">
                        <Link href="/login" className="text-sm text-gray-500 hover:text-gray-900">
                            Back to Customer Login
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
