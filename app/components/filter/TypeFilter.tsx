'use client';

import { Button } from "@/components/ui/button";
import { useSearchParams, usePathname } from 'next/navigation';
import { shopData, type Gender, type ProductCategory } from '@/lib/shopData';
import { useTransitionContext } from '@/app/context/TransitionContext';

type TypeFilterProps = {
    selectedTypes: string[];
    selectedGender: Gender;
    selectedCategories?: ProductCategory[];
};

const getAvailableTypes = (gender: Gender, selectedCategories: ProductCategory[] = []): string[] => {
    const genderProducts = shopData[gender];
    const types = new Set<string>();

    genderProducts?.forEach(product => {
        if (selectedCategories.length > 0 && !selectedCategories.includes(product.category)) {
            return;
        }

        if (product.type) {
            types.add(product.type);
        }
    });

    return Array.from(types).sort();
};

export function TypeFilter({
    selectedTypes = [],
    selectedGender,
    selectedCategories = [],
}: TypeFilterProps) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { isPending, startTransition, router } = useTransitionContext();

    const availableTypes = getAvailableTypes(selectedGender, selectedCategories);

    if (availableTypes.length === 0) {
        return null;
    }

    const handleTypeToggle = (type: string) => {
        const types = new Set(selectedTypes);

        if (types.has(type)) {
            types.delete(type);
        } else {
            types.add(type);
        }

        const newTypes = Array.from(types);

        const params = new URLSearchParams(searchParams.toString());
        if (newTypes.length > 0) {
            params.set('types', newTypes.join(','));
        } else {
            params.delete('types');
        }

        params.delete('type');
        params.delete('page');

        startTransition(() => {
            router.push(`${pathname}?${params.toString()}`);
        });
    };

    return (
        <div className="mb-4 pb-4 border-b border-gray-200">
            <h2 className="font-semibold text-lg mb-3">Type</h2>
            <div className="flex flex-wrap gap-2">
                {availableTypes.map((type) => (
                    <Button
                        key={type}
                        type="button"
                        variant={selectedTypes.includes(type) ? 'default' : 'outline'}
                        className="cursor-pointer capitalize"
                        size="sm"
                        disabled={isPending}
                        onClick={() => handleTypeToggle(type)}
                    >
                        {type}
                    </Button>
                ))}
            </div>
        </div>
    );
}
