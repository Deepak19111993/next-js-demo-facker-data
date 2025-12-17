'use client';
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { shopData, type Gender, type ProductCategory } from '@/lib/shopData';

type SizeFilterProps = {
    selectedSizes: string[];
    selectedGender: Gender;
    selectedCategories?: ProductCategory[];
    onSizesChange?: (sizes: string[]) => void;
};

// Get available sizes from shop data based on gender and selected categories
const getAvailableSizes = (gender: Gender, selectedCategories: ProductCategory[] = []): string[] => {
    const genderProducts = shopData[gender];
    const sizes = new Set<string>();

    genderProducts?.forEach(product => {
        // If categories are selected, only include products from those categories
        if (selectedCategories.length > 0 && !selectedCategories.includes(product.category)) {
            return;
        }
        
        // Add all available sizes for matching products
        if (product.sizes) {
            product.sizes.forEach(size => sizes.add(size));
        }
    });

    // Convert to array and sort by size
    return Array.from(sizes).sort((a, b) => {
        const sizeOrder = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
        return sizeOrder.indexOf(a) - sizeOrder.indexOf(b);
    });
};

export function SizeFilter({ selectedSizes = [], selectedGender, selectedCategories = [], onSizesChange }: SizeFilterProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    const handleSizeToggle = (size: string) => {
        const sizes = new Set(selectedSizes);
        
        if (sizes.has(size)) {
            sizes.delete(size);
        } else {
            sizes.add(size);
        }
        
        const newSizes = Array.from(sizes);
        
        // Update URL
        const params = new URLSearchParams(searchParams);
        if (newSizes.length > 0) {
            params.set('sizes', newSizes.join(','));
        } else {
            params.delete('sizes');
        }
        params.delete('page'); // Reset to first page when changing filters
        
        router.push(`${pathname}?${params.toString()}`);
        
        // Notify parent component if callback provided
        if (onSizesChange) {
            onSizesChange(newSizes);
        }
    };
    
    // Get available sizes based on selected gender and categories
    const availableSizes = getAvailableSizes(selectedGender, selectedCategories);

    return (
        <div className="mb-4 pb-4 border-b border-gray-200">
            <h2 className="font-semibold text-lg mb-3">Size</h2>
            <div className="flex flex-wrap gap-3">
                {availableSizes.length > 0 ? (
                    availableSizes.map((size) => (
                        <Button
                            key={size}
                            type="button"
                            variant={selectedSizes.includes(size) ? 'default' : 'outline'}
                            className="cursor-pointer"
                            size="sm"
                            onClick={() => handleSizeToggle(size)}
                        >
                            {size}
                        </Button>
                    ))
                ) : (
                    <p className="text-sm text-gray-500">No sizes available for the selected filters</p>
                )}
            </div>
        </div>
    );
}