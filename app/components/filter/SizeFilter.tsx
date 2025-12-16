'use client';
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

type SizeFilterProps = {
    selectedSizes: string[];
};

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'] as const;

export function SizeFilter({ selectedSizes = [] }: SizeFilterProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    const handleSizeToggle = (size: string) => {
        const params = new URLSearchParams(searchParams);
        const sizes = new Set(selectedSizes);
        
        if (sizes.has(size)) {
            sizes.delete(size);
        } else {
            sizes.add(size);
        }
        
        if (sizes.size > 0) {
            params.set('sizes', Array.from(sizes).join(','));
        } else {
            params.delete('sizes');
        }
        
        // Reset to first page when changing filters
        params.delete('page');
        
        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <div className="mb-4 pb-4 border-b border-gray-200">
            <h2 className="font-semibold text-lg mb-3">Size</h2>
            <div className="flex flex-wrap gap-3">
                {SIZES.map((size) => (
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
                ))}
            </div>
        </div>
    );
}