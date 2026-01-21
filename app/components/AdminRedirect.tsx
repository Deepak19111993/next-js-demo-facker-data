'use client';

import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminRedirect() {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && user?.email === 'superadmin@gmail.com') {
            router.push('/admin');
        }
    }, [user, isLoading, router]);

    return null;
}
