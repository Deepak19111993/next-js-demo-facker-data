'use client';

import { useTransitionContext } from '@/app/context/TransitionContext';
import { ProductSkeletonCard } from '../ProductSkeletonCard';
import React from 'react';

export function ProductGridSkeletonWrapper({ children }: { children: React.ReactNode }) {
    const { isPending } = useTransitionContext();

    if (isPending) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                    <ProductSkeletonCard key={i} />
                ))}
            </div>
        );
    }

    return children;
}
