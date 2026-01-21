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
    params.delete('subcategory');
    params.delete('categories');
    params.delete('material');
    params.delete('materials');
    params.delete('sizes');
    params.delete('page');
    router.push(`?${params.toString()}`, { scroll: false });
  };
  return (
    <div className="flex gap-2                                                                                                                                    ">
      <Button
        className='cursor-pointer'
        variant={selectedCategory === 'men' ? 'default' : 'outline'}
        onClick={() => handleCategoryChange('men')}
      >
        Men
      </Button>
      <Button
        className='cursor-pointer'
        variant={selectedCategory === 'women' ? 'default' : 'outline'}
        onClick={() => handleCategoryChange('women')}
      >
        Women
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