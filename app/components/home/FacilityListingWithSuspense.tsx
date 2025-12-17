'use client';

import { useEffect, useState } from 'react';
import { ProductSkeletonCard } from '../ProductSkeletonCard';
import { ProductCard } from '../ProductCard';
import { ClearFiltersButton } from '../filter/ClearFilterButton';
import { useSearchParams } from 'next/navigation';

export default function FacilityListingWithSuspense({
    filteredProducts,
    selectedSizes,
    selectedCategories,
    selectedMaterials,
}: {
    filteredProducts: any[];
    selectedSizes: string[];
    selectedCategories: string[];
    selectedMaterials: string[];
}) {
    const searchParams = useSearchParams();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, [searchParams?.toString()]); // Re-run when search params change

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[...Array(filteredProducts?.length ?? 4)].map((_, i) => (
                    <ProductSkeletonCard key={i} />
                ))}
            </div>
        );
    }

    return (
        filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredProducts?.map((product: any) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        ) : (
            <div className="text-center py-12">
                <p className="text-lg text-gray-600 mb-4">No products found matching your search.</p>
                <ClearFiltersButton
                    selectedSizes={selectedSizes}
                    selectedCategories={selectedCategories}
                    selectedMaterials={selectedMaterials}
                    showOnlyWithActiveFilters={true}
                    className='cursor-pointer'
                    buttonText={'Clear Filters'} />
            </div>
        )
    );
}