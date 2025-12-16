
import FacilityCard from "../FacilityCard";
import { type Product, type Gender } from '@/lib/shopData';
import { CategoryButtons } from './CategoryButtons';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from "@/components/ui/sheet";
import { ListFilterPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CategoryFilter } from "../filter/CategoryFilter";
import { SizeFilter } from "../filter/SizeFilter";
import { ClearFiltersButton } from '../filter/ClearFilterButton';
import { ClearSearch } from '../filter/ClearSearch';

interface FacilityListingProps {
    initialData: {
        men: Product[];
        kids: Product[];
    };
    initialCategory: Gender;
    searchParams?: { [key: string]: string | string[] | undefined };
}

export default async function FacilityListing({
    initialData,
    initialCategory,
    searchParams
}: FacilityListingProps) {

    // await new Promise((resolve) => setTimeout(resolve, 5000));
    
    const categoryParam = searchParams?.category || initialCategory;
    const selectedCategory = (Array.isArray(categoryParam) ? categoryParam[0] : categoryParam) as Gender;
    
    const sizesParam = searchParams?.sizes;
    const selectedSizes = typeof sizesParam === 'string' ? sizesParam.split(',').filter(Boolean) : [];
    
    // Get search query from URL
    const searchQuery = searchParams?.q ? String(searchParams.q).toLowerCase() : '';
    
    const categoriesParam = searchParams?.categories;
    const selectedCategories = typeof categoriesParam === 'string' ? categoriesParam.split(',').filter(Boolean) : [];

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
        
        return result;
    })();

    return (
        <div className="container">
            <div className="flex flex-wrap items-center">
                <CategoryButtons selectedCategory={selectedCategory} />
                <div className="ml-auto">
                    <Sheet>
                        <SheetTrigger className="cursor-pointer">
                            <div className="flex items-center gap-1">
                                <ListFilterPlus />
                                {(selectedSizes.length > 0 || selectedCategories.length > 0) && (
                                    <span className="ml-1 text-xs bg-primary text-primary-foreground rounded-full h-4 w-4 flex items-center justify-center">
                                        {selectedSizes.length + selectedCategories.length}
                                    </span>
                                )}
                            </div>
                        </SheetTrigger>
                        <SheetContent className="overflow-y-auto">
                            <SheetHeader className="border-b border-gray-200 sticky top-0 bg-background z-10">
                                <SheetTitle>Filter</SheetTitle>
                            </SheetHeader>
                            <div className="px-4 py-2">
                                <CategoryFilter selectedCategory={selectedCategory} selectedCategories={selectedCategories} />
                                <SizeFilter selectedSizes={selectedSizes} />
                            </div>
                            <SheetFooter className="flex flex-row justify-between flex-wrap border-t border-gray-200 sticky bottom-0 bg-background z-10 py-4">
                                <ClearFiltersButton
                                selectedSizes={selectedSizes}
                                selectedCategories={selectedCategories}
                                 className={`flex-1 pointer-events-auto! ${selectedSizes.length === 0 && selectedCategories.length === 0 ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                                 buttonText={'Clear All'} />

                                <Button className="flex-1 cursor-pointer" asChild>
                                    <SheetTrigger>Show {filteredProducts.length} items</SheetTrigger>
                                </Button>
                            </SheetFooter>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>

            <h2 className="text-xl font-semibold my-4">
                {selectedCategory === 'men' ? "Men's Collection" : "Kids' Collection"}
                <span className="text-gray-500 ml-2">({filteredProducts.length} items)</span>
            </h2>
            
            <div className="flex-1">
                {searchQuery && (
                    <div className="mb-6 flex items-center w-full justify-between">
                        <h2 className="text-lg font-medium">
                            {filteredProducts.length} {filteredProducts.length === 1 ? 'result' : 'results'} for "{searchQuery}"
                        </h2>
                        <ClearSearch  />
                    </div>
                )}
                {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {filteredProducts.map((product: Product) => (
                            <FacilityCard key={product.id} {...product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-lg text-gray-600 mb-4">No products found matching your search.</p>
                            <ClearFiltersButton
                            className='cursor-pointer' buttonText={'Clear Filters'} />
                    </div>
                )}
            </div>
        </div>
    );
}