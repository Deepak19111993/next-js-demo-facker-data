// In ClearFilterButton.tsx
'use client';

import { Button } from "@/components/ui/button";
import { useSearchParams, usePathname } from 'next/navigation';
import { type Gender } from '@/lib/shopData';
import { useTransitionContext } from '@/app/context/TransitionContext';

export function ClearFiltersButton({
    className,
    selectedSizes = [],
    selectedCategories = [],
    selectedMaterials = [],
    buttonText = 'Clear All',
    showOnlyWithActiveFilters = false
}: {
    className?: string;
    selectedSizes?: string[];
    selectedCategories?: string[];
    selectedMaterials?: string[];
    buttonText?: string;
    showOnlyWithActiveFilters?: boolean;
}) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { isPending, startTransition, router } = useTransitionContext();

    const categoryParam = searchParams?.get('category');
    const selectedCategory = (Array.isArray(categoryParam) ? categoryParam[0] : categoryParam) as Gender;

    // Check if there are any active filters (excluding category)
    const hasActiveFilters = () => {
        // Create new URLSearchParams with all current params
        const params = new URLSearchParams(searchParams?.toString() || '');

        // Remove filter params
        params.delete('sizes');
        params.delete('categories');
        params.delete('subcategory');
        params.delete('material');
        params.delete('materials');
        params.delete('type');
        params.delete('types');

        // If no params left after removing filters, remove the '?' from the URL
        const queryString = params.toString();
        const newUrl = queryString ? `${pathname}?${queryString}` : pathname;

        return newUrl !== `${pathname}${selectedCategory ? `?category=${selectedCategory}` : ''}`;
    };

    const handleClearFilters = () => {
        const newParams = new URLSearchParams();
        // Keep only the category if it exists
        if (selectedCategory) {
            newParams.set('category', selectedCategory);
        }

        startTransition(() => {
            // Navigate to the same page with only the category parameter
            router.push(`${pathname}${selectedCategory ? `?${newParams.toString()}` : ''}`);
        })
    };

    // If showOnlyWithActiveFilters is true and there are no active filters, don't render the button
    if (showOnlyWithActiveFilters && !hasActiveFilters()) {
        return null;
    }

    return (
        <Button
            variant="outline"
            className={`bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium px-4 py-2 rounded-md transition-colors ${className}`}
            onClick={handleClearFilters}
            disabled={isPending}
        >
            {buttonText}
        </Button>
    );
}