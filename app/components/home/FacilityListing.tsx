
// import FacilityCard from "../FacilityCard";
import { type Product, type ProductCategory, type Gender, generateConsistentData } from '@/lib/shopData';
import { CategoryButtons } from './CategoryButtons';
import { ClearSearch } from '../filter/ClearSearch';
import { FilterDrawer } from "../filter/FilterDrawer";
import { ClearFiltersButton } from '../filter/ClearFilterButton';
import { ProductCard } from "../ProductCard";
import { ProductSkeletonCard } from "../ProductSkeletonCard";
import { Suspense, use } from 'react';
import { TransitionProvider } from '@/app/context/TransitionContext';
import { ProductGridSkeletonWrapper } from './ProductGridSkeletonWrapper';
import { FacilityListingHeader } from './FacilityListingHeader';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ProductGrid } from './ProductGrid';

interface FacilityListingProps {
    listingPromise: ReturnType<typeof generateConsistentData>;
    categoryFilters?: boolean;
    suspenseKey?: string;
    category: Gender;
}

async function FacilityListingInner({
    listingPromise,
    categoryFilters,
}: {
    listingPromise: ReturnType<typeof generateConsistentData>;
    categoryFilters: boolean;
}) {
    const listing = await listingPromise;

    const selectedCategory = listing.selectedCategory as Gender;
    const selectedSubcategory = listing.selectedSubcategory as string | undefined;
    const searchQuery = listing.searchQuery;
    const selectedSizes = listing.selectedSizes;
    const selectedCategories = listing.selectedCategories as ProductCategory[];
    const selectedMaterials = listing.selectedMaterials;
    const selectedTypes = listing.selectedTypes as string[];
    const filteredProducts = listing.filteredProducts as Product[];

    return (
        <div className="container">
            <div className="flex flex-wrap items-center mb-5">
                {categoryFilters && <CategoryButtons selectedCategory={selectedCategory} />}
                <div className={`ml-auto ${!categoryFilters ? 'mb-[-65px]' : ''}`}>
                    <FilterDrawer
                        selectedGender={selectedCategory}
                        selectedSubcategory={selectedSubcategory}
                        selectedSizes={selectedSizes}
                        selectedCategories={selectedCategories}
                        selectedMaterials={selectedMaterials}
                        selectedTypes={selectedTypes}
                        filteredCount={filteredProducts.length}
                    />
                </div>
            </div>

            <FacilityListingHeader
                title={`${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}'s Collection`}
                count={filteredProducts.length}
                categoryFilters={categoryFilters}
            />

            <div className="flex-1">
                {searchQuery && (
                    <div className="mb-6 flex items-center w-full justify-between">
                        <h2 className="text-lg font-medium">
                            {filteredProducts.length} {filteredProducts.length === 1 ? 'result' : 'results'} for "{searchQuery}"
                        </h2>
                        <ClearSearch />
                    </div>
                )}
                {filteredProducts.length > 0 ? (
                    <ProductGridSkeletonWrapper>
                        <Suspense fallback={null}>
                            <ProductGrid products={filteredProducts} />
                        </Suspense>
                    </ProductGridSkeletonWrapper>
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
                )}
            </div>
        </div>
    );
}

export default function FacilityListing({
    listingPromise,
    categoryFilters = false,
    suspenseKey,
    category
}: FacilityListingProps) {
    return (
        <TransitionProvider>
            <Suspense fallback={
                <div className='container'>
                    <div className="flex flex-wrap items-center">
                        {categoryFilters && <CategoryButtons selectedCategory={category} />}
                        <div className={`ml-auto ${!categoryFilters ? 'mb-[-65px]' : ''}`}>
                            <Button className="cursor-not-allowed opacity-50 flex items-center gap-2">
                                <span className="text-sm font-medium">Filter</span>
                            </Button>
                        </div>
                    </div>

                    <FacilityListingHeader
                        title={`${category.charAt(0).toUpperCase() + category.slice(1)}'s Collection`}
                        count={0}
                        categoryFilters={categoryFilters}
                        isLoading={true}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {[...Array(8)].map((_, i) => (
                            <ProductSkeletonCard key={i} />
                        ))}
                    </div>
                </div>
            }>
                <FacilityListingInner listingPromise={listingPromise} categoryFilters={categoryFilters} />
            </Suspense>
        </TransitionProvider>
    );
}