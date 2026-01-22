'use client';

import { UserAuthForm } from '@/components/auth/UserAuthForm';
import Link from 'next/link';

export default function LoginPage() {
    return (
        <div className="flex min-h-[calc(100vh-200px)] items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                        Sign in
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Enter your email and password
                    </p>
                </div>

                <UserAuthForm type="login" />

                <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600" data-no-view-cursor="true">
                        Don't have an account?{' '}
                        <Link href="/signup" className="text-blue-600 hover:text-blue-500 hover:underline font-medium">
                            Create a new account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
