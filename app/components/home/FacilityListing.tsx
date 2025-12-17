
// import FacilityCard from "../FacilityCard";
import { type Product, type Gender, type ProductCategory } from '@/lib/shopData';
import { CategoryButtons } from './CategoryButtons';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from "@/components/ui/sheet";
import { ListFilterPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CategoryFilter } from "../filter/CategoryFilter";
import { SizeFilter } from "../filter/SizeFilter";
import { ClearFiltersButton } from '../filter/ClearFilterButton';
import { ClearSearch } from '../filter/ClearSearch';
import { MaterialFilter } from "../filter/MaterialFilter";
import { ProductCard } from "../ProductCard";
import { ProductSkeletonCard } from "../ProductSkeletonCard";
import { Suspense } from 'react';
import FacilityListingWithSuspense from './FacilityListingWithSuspense';

interface FacilityListingProps {
    initialData: {
        men: Product[];
        kids: Product[];
    };
    initialCategory: Gender;
    searchParams?: { [key: string]: string | string[] | undefined };
    categoryFilters?: boolean;
}

export default async function FacilityListing({
    initialData,
    initialCategory,
    searchParams,
    categoryFilters = false
}: FacilityListingProps) {
    // Add a 2-second delay to simulate loading
    // await new Promise(resolve => setTimeout(resolve, 2000));

    // Parse URL parameters
    const categoryParam = searchParams?.category || initialCategory;
    const selectedCategory = (Array.isArray(categoryParam) ? categoryParam[0] : categoryParam) as Gender;

       
    // Add a 2-second delay to simulate loading
    // await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Search query
    const searchQuery = searchParams?.q ? String(searchParams.q).toLowerCase() : '';
    
    // State for filters
    const selectedSizes = typeof searchParams?.sizes === 'string' 
        ? searchParams.sizes.split(',').filter(Boolean) 
        : [];
        
    const selectedCategories = (() => {
        const categoriesParam = searchParams?.categories;
        return (typeof categoriesParam === 'string'
            ? categoriesParam.split(',').filter(Boolean)
            : []) as ProductCategory[];
    })();
    
    const selectedMaterials = typeof searchParams?.materials === 'string'
        ? searchParams.materials.split(',').filter(Boolean)
        : [];

    // Filter products based on selected filters
    const filteredProducts = (() => {
        // Make sure we have valid data
        if (!initialData || !initialData[selectedCategory]) {
            return [];
        }

        let result = [...initialData[selectedCategory]];

        // Apply search filter
        if (searchQuery) {
            result = result.filter(product =>
                product.name.toLowerCase().includes(searchQuery) ||
                product.description.toLowerCase().includes(searchQuery) ||
                product.category.toLowerCase().includes(searchQuery)
            );
        }

        // Apply size filters
        if (selectedSizes.length > 0) {
            result = result.filter(product =>
                product.sizes?.some(size => selectedSizes.includes(size)) || false
            );
        }

        // Filter by category if any categories are selected
        if (selectedCategories.length > 0) {
            result = result.filter(product =>
                selectedCategories.includes(product.category)
            );
        }

        // Filter by material if any materials are selected
        if (selectedMaterials.length > 0) {
            result = result.filter(product => 
                product.material && selectedMaterials.includes(product.material)
            );
        }

        return result;
    })();

    return (
        <div className="container">
            <div className="flex flex-wrap items-center">
                {categoryFilters && <CategoryButtons selectedCategory={selectedCategory} />}
                <div className={`ml-auto ${!categoryFilters ? 'mb-[-65px]' : ''}`}>
                    <Sheet>
                        <SheetTrigger className="cursor-pointer">
                            <div className="flex items-center gap-1">
                                <ListFilterPlus />
                                {(selectedSizes.length > 0 || selectedCategories.length > 0 || selectedMaterials.length > 0) && (
                                    <span className="ml-1 text-xs bg-primary text-primary-foreground rounded-full h-4 w-4 flex items-center justify-center">
                                        {selectedSizes.length + selectedCategories.length + selectedMaterials.length}
                                    </span>
                                )}
                            </div>
                        </SheetTrigger>
                        <SheetContent className="overflow-y-auto">
                            <SheetHeader className="border-b border-gray-200 sticky top-0 bg-background z-10">
                                <SheetTitle>Filter</SheetTitle>
                            </SheetHeader>
                            <div className="px-4 py-2">
                                <CategoryFilter selectedGender={selectedCategory} selectedCategories={selectedCategories} />
                                <SizeFilter
                                    selectedSizes={selectedSizes}
                                    selectedGender={selectedCategory}
                                    selectedCategories={selectedCategories}
                                />
                                {/* material filters */}
                                <MaterialFilter
                                    selectedMaterials={selectedMaterials}
                                    selectedGender={selectedCategory}
                                    selectedCategories={selectedCategories}
                                />
                            </div>
                            <SheetFooter className="flex flex-row justify-between flex-wrap border-t border-gray-200 sticky bottom-0 bg-background z-10 py-4">
                                <ClearFiltersButton
                                    selectedSizes={selectedSizes}
                                    selectedCategories={selectedCategories}
                                    selectedMaterials={selectedMaterials}
                                    className={`flex-1 pointer-events-auto! ${selectedSizes.length === 0 && selectedCategories.length === 0 && selectedMaterials.length === 0 ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                                    buttonText={'Clear All'} />

                                <Button className="flex-1 cursor-pointer" asChild>
                                    <SheetTrigger>Show {filteredProducts.length} items</SheetTrigger>
                                </Button>
                            </SheetFooter>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>

            <h2 className={`text-xl font-semibold my-4 ${!categoryFilters ? 'mb-6' : ''}`}>
                {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}'s Collection
                <span className="text-gray-500 ml-2">({filteredProducts.length} items)</span>
            </h2>

            <div className="flex-1">
                {searchQuery && (
                    <div className="mb-6 flex items-center w-full justify-between">
                        <h2 className="text-lg font-medium">
                            {filteredProducts.length} {filteredProducts.length === 1 ? 'result' : 'results'} for "{searchQuery}"
                        </h2>
                        <ClearSearch />
                    </div>
                )}
                {/* <Suspense fallback={
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {[...Array(8)].map((_, i) => (
                            <ProductSkeletonCard key={i} />
                        ))}
                    </div>
                }>
                    {filteredProducts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {filteredProducts?.map((product: Product) => (
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
                    )}
                </Suspense> */}
                <FacilityListingWithSuspense filteredProducts={filteredProducts} selectedSizes={selectedSizes} selectedCategories={selectedCategories} selectedMaterials={selectedMaterials} />
            </div>
        </div>
    );
}