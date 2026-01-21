'use client';

import { useTransitionContext } from '@/app/context/TransitionContext';
import { Loader2 } from 'lucide-react';

interface FacilityListingHeaderProps {
    title: string;
    count: number;
    categoryFilters?: boolean;
    isLoading?: boolean;
}

export function FacilityListingHeader({ title, count, categoryFilters, isLoading }: FacilityListingHeaderProps) {
    const { isPending } = useTransitionContext();

    return (
        <h2 className={`text-xl font-semibold my-4 flex items-center ${!categoryFilters ? 'mb-6' : ''}`}>
            {title}
            <span className="text-gray-500 ml-2">
                {isPending || isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : `(${count} items)`}
            </span>
        </h2>
    );
}
