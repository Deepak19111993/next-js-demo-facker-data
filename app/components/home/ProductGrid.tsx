'use client';


import { useState, useCallback, useEffect } from 'react';
import { Product } from '@/lib/shopData';
import { ProductCard } from '../ProductCard';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

interface ProductGridProps {
    products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Initialize from URL or default to 10
    const initialPage = Number(searchParams.get('page')) || 1;
    const [visibleCount, setVisibleCount] = useState(initialPage * 10);
    const [isLoading, setIsLoading] = useState(false);

    // Sync state with URL if URL changes externally (e.g. back button)
    useEffect(() => {
        const page = Number(searchParams.get('page')) || 1;
        setVisibleCount(page * 10);
    }, [searchParams]);

    const visibleProducts = products.slice(0, visibleCount);
    const hasMore = visibleCount < products.length;

    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString());
            params.set(name, value);
            return params.toString();
        },
        [searchParams]
    );

    const handleShowMore = () => {
        setIsLoading(true);
        // Simulate loading delay
        setTimeout(() => {
            const newCount = visibleCount + 10;
            setVisibleCount(newCount);

            // Update URL
            const newPage = Math.ceil(newCount / 10);
            router.replace(pathname + '?' + createQueryString('page', newPage.toString()), { scroll: false });

            setIsLoading(false);
        }, 300);
    };

    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {visibleProducts.map((product, index) => (
                    <ProductCard key={product.id} product={product} index={index % 10} />
                ))}
            </div>

            {hasMore && (
                <div className="mt-8 flex justify-center">
                    <Button
                        onClick={handleShowMore}
                        variant="outline"
                        size="lg"
                        className="min-w-[200px] cursor-pointer"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <div className="flex items-center">
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                <span>Loading...</span>
                            </div>
                        ) : (
                            'Show More'
                        )}
                    </Button>
                </div>
            )}
        </>
    );
}
