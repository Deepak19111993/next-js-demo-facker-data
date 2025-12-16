'use client';
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { type Gender, type ProductCategory } from '@/lib/shopData';

const PRODUCT_CATEGORIES: ProductCategory[] = ['clothing', 'footwear', 'accessories', 'toys', 'essentials'];

type CategoryFilterProps = {
    selectedCategory: Gender;
    selectedCategories: string[];
};

export function CategoryFilter({ selectedCategory, selectedCategories }: CategoryFilterProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();
    
    // Get currently selected categories from URL
    const currentCategories = searchParams.get('categories')?.split(',').filter(Boolean) || [];

    const handleCategoryToggle = (category: ProductCategory) => {
        const params = new URLSearchParams(searchParams);
        const categories = new Set(currentCategories);
        
        if (categories.has(category)) {
            categories.delete(category);
        } else {
            categories.add(category);
        }
        
        if (categories.size > 0) {
            params.set('categories', Array.from(categories).join(','));
        } else {
            params.delete('categories');
        }
        
        // Reset to first page when changing filters
        params.delete('page');
        
        router.push(`${pathname}?${params.toString()}`);
    };

    const getCategoryLabel = (category: ProductCategory) => {
        switch (category) {
            case 'clothing': return 'Clothing';
            case 'footwear': return 'Footwear';
            case 'accessories': return 'Accessories';
            case 'toys': return 'Toys';
            case 'essentials': return 'Essentials';
            default: return category;
        }
    };

    return (
        <div className="mb-4 pb-4 border-b border-gray-200">
            <h2 className="font-semibold text-lg mb-3">Product Categories</h2>
            <div className="flex flex-wrap gap-2">
                {PRODUCT_CATEGORIES.map((category) => (
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
        </div>
    );
}