'use client';

import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { shopData, type Gender, type ProductCategory } from '@/lib/shopData';

type MaterialFilterProps = {
    selectedMaterials: string[];
    selectedGender: Gender;
    selectedCategories?: ProductCategory[];
};

// Get unique materials from shop data based on gender and selected categories
const getAvailableMaterials = (gender: Gender, selectedCategories: ProductCategory[] = []): string[] => {
    const genderProducts = shopData[gender];
    const materials = new Set<string>();

    genderProducts?.forEach(product => {
        // If categories are selected, only include products from those categories
        if (selectedCategories.length > 0 && !selectedCategories.includes(product.category)) {
            return;
        }
        
        // Add material if it exists
        if (product.material) {
            materials.add(product.material);
        }
    });

    // Convert to array and sort alphabetically
    return Array.from(materials).sort();
};

export function MaterialFilter({ 
    selectedMaterials = [], 
    selectedGender, 
    selectedCategories = [] 
}: MaterialFilterProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    const handleMaterialToggle = (material: string) => {
        const materials = new Set(selectedMaterials);
        
        if (materials.has(material)) {
            materials.delete(material);
        } else {
            materials.add(material);
        }
        
        const newMaterials = Array.from(materials);
        
        // Update URL
        const params = new URLSearchParams(searchParams);
        if (newMaterials.length > 0) {
            params.set('materials', newMaterials.join(','));
        } else {
            params.delete('materials');
        }
        params.delete('page'); // Reset to first page when changing filters
        
        router.push(`${pathname}?${params.toString()}`);
    };
    
    // Get available materials based on selected gender and categories
    const availableMaterials = getAvailableMaterials(selectedGender, selectedCategories);

    if (availableMaterials.length === 0) {
        return null;
    }

    return (
        <div className="mb-4 pb-4 border-b border-gray-200">
            <h2 className="font-semibold text-lg mb-3">Material</h2>
            <div className="flex flex-wrap gap-2">
                {availableMaterials.map((material) => (
                    <Button
                        key={material}
                        type="button"
                        variant={selectedMaterials.includes(material) ? 'default' : 'outline'}
                        className="cursor-pointer capitalize"
                        size="sm"
                        onClick={() => handleMaterialToggle(material)}
                    >
                        {material}
                    </Button>
                ))}
            </div>
        </div>
    );
}
