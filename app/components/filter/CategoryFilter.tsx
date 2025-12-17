'use client';
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { type Gender, type ProductCategory, shopData } from '@/lib/shopData';

// Get unique categories from shop data based on gender
const getCategoriesByGender = (gender: Gender): ProductCategory[] => {
    const genderProducts = shopData[gender];
    const categories = new Set<ProductCategory>();

    genderProducts?.forEach(product => {
        categories.add(product.category);
    });

    return Array.from(categories);
};

type CategoryFilterProps = {
    selectedGender: Gender;
    selectedCategories: string[];
    onCategoryChange?: (categories: string[]) => void;
};

export function CategoryFilter({ selectedGender, selectedCategories, onCategoryChange }: CategoryFilterProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    // Get currently selected categories from URL

    const handleCategoryToggle = (category: ProductCategory) => {
        const categories = new Set(selectedCategories);

        if (categories.has(category)) {
            categories.delete(category);
        } else {
            categories.add(category);
        }

        const newCategories = Array.from(categories);

        // Update URL
        const params = new URLSearchParams(searchParams);
        if (newCategories.length > 0) {
            params.set('categories', newCategories.join(','));
        } else {
            params.delete('categories');
        }
        params.delete('page'); // Reset to first page when changing filters

        router.push(`${pathname}?${params.toString()}`);

        // Notify parent component if callback provided
        if (onCategoryChange) {
            onCategoryChange(newCategories);
        }
    };

    const getCategoryLabel = (category: ProductCategory): string => {
        // Convert first letter to uppercase and the rest to lowercase
        return category.charAt(0).toUpperCase() + category.slice(1);
    };

    const availableCategories = getCategoriesByGender(selectedGender);

    return (
        <div className="mb-4 pb-4 border-b border-gray-200">
            <h2 className="font-semibold text-lg mb-3">Product Categories</h2>
            {availableCategories.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                    {availableCategories.map((category) => (
                        <Button
                            key={category}
                            type="button"
                            variant={selectedCategories.includes(category) ? 'default' : 'outline'}
                            className="cursor-pointer"
                            size="sm"
                            onClick={() => handleCategoryToggle(category)}
                        >
                            {getCategoryLabel(category)}
                        </Button>
                    ))}
                </div>
            ) : (
                <p className="text-sm text-muted-foreground">No categories available for the selected gender</p>
            )}
        </div>
    );
}