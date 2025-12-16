'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { type Gender } from '@/lib/shopData';

export function CategoryButtons({
    selectedCategory,
}: {
    selectedCategory: Gender;
}) {
    const router = useRouter();
    const searchParams = useSearchParams();
  
    const handleCategoryChange = (category: Gender) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('category', category);
        router.push(`?${params.toString()}`, { scroll: false });
    };
    return (
        <div className="flex gap-2 mb-5">
        <Button
          className='cursor-pointer'
          variant={selectedCategory === 'men' ? 'default' : 'outline'}
          onClick={() => handleCategoryChange('men')}
        >
          Men
        </Button>
        <Button
          className='cursor-pointer'
          variant={selectedCategory === 'kids' ? 'default' : 'outline'}
          onClick={() => handleCategoryChange('kids')}
        >
          Kids
        </Button>
      </div>
    )
}