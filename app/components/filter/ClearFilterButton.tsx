'use client';

import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { type Gender } from '@/lib/shopData';

export function ClearFiltersButton({
    className,
    selectedSizes,
    selectedCategories,
    buttonText = 'Clear All'
}: {
    className?: string;
    selectedSizes?: string[];
    selectedCategories?: string[];
    buttonText?: string;
}) {

    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const categoryParam = searchParams?.get('category');
    const selectedCategory = (Array.isArray(categoryParam) ? categoryParam[0] : categoryParam) as Gender;
    
    const handleClearFilters = () => {
        const newParams = new URLSearchParams();
        // Keep only the category if it exists
        if (selectedCategory) {
            newParams.set('category', selectedCategory);
        }
        
        // Remove all other filter parameters
        const paramsToRemove = ['q', 'sizes', 'categories', 'page'];
        const currentParams = new URLSearchParams(searchParams.toString());
        
        // Add any parameters that aren't in our remove list
        for (const [key, value] of currentParams.entries()) {
            if (!paramsToRemove.includes(key)) {
                newParams.set(key, value);
            }
        }
        
        // Navigate to the same page with cleared filters
        router.push(`${pathname}?${newParams.toString()}`);
    };
    return (
        <Button
            variant="outline"
            className={className}
            onClick={handleClearFilters}
            disabled={selectedSizes?.length === 0 && selectedCategories?.length === 0}
        >
            {buttonText}
        </Button>
    )
}