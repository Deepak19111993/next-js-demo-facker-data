'use client';

import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { shopData, type Product } from '@/lib/shopData';
import { ProductCard } from '@/app/components/ProductCard';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';


export default function SavedItemsPage() {
    const { user, savedItems, isLoading, isLoadingSavedItems } = useAuth();
    const router = useRouter();
    const [fetchedProducts, setFetchedProducts] = useState<Product[]>([]);
    const [isFetching, setIsFetching] = useState(true);
    const [groupedProducts, setGroupedProducts] = useState({
        men: [] as Product[],
        women: [] as Product[],
        kids: [] as Product[]
    });

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/login');
        }
    }, [isLoading, user, router]);

    useEffect(() => {
        const fetchProducts = async () => {
            if (isLoading || isLoadingSavedItems) return; // Wait for auth and saved items loading

            setIsFetching(true);
            if (savedItems.size === 0) {
                setFetchedProducts([]);
                setIsFetching(false);
                return;
            }

            const savedIds = Array.from(savedItems);

            try {
                const response = await fetch('/api/products/get-by-ids', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ ids: savedIds }),
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }

                const data = await response.json();
                setFetchedProducts(data.products || []);

            } catch (err) {
                console.error("Error fetching saved items:", err);
                // Fallback to local filtering if API fails completely (unlikely, but safe)
                const allMock = [...shopData.men, ...shopData.women, ...shopData.kids];
                const foundInMock = allMock.filter(p => savedItems.has(p.id));
                setFetchedProducts(foundInMock);
            } finally {
                setIsFetching(false);
            }
        };

        fetchProducts();
    }, [savedItems, isLoading, isLoadingSavedItems]);

    useEffect(() => {
        setGroupedProducts({
            men: fetchedProducts.filter(p => p.gender === 'men'),
            women: fetchedProducts.filter(p => p.gender === 'women'),
            kids: fetchedProducts.filter(p => p.gender === 'kids')
        });
    }, [fetchedProducts]);

    if (isLoading || !user || isFetching || isLoadingSavedItems || (savedItems.size > 0 && fetchedProducts.length === 0)) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
            </div>
        );
    }

    const hasAnySaved = savedItems.size > 0;

    return (
        <div className="container mx-auto px-4 py-4! lg:py-8!">
            {/* <h1 className="text-3xl font-bold mb-5 lg:mb-8">Saved Items</h1> */}

            {hasAnySaved ? (
                <div className="space-y-12">
                    {/* Checkout Summary Block */}
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-2xl font-bold">Saved Items</h1>
                        <Link href="/shop?category=men">
                            <Button variant="outline">Continue Shopping</Button>
                        </Link>
                    </div>

                    {/* Men's Section */}
                    {groupedProducts.men.length > 0 && (
                        <div>
                            <h2 className="text-2xl font-semibold mb-6">Men's Collection</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {groupedProducts.men.map((product, index) => (
                                    <ProductCard key={product.id} product={product} index={index % 10} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Women's Section */}
                    {groupedProducts.women.length > 0 && (
                        <div>
                            <h2 className="text-2xl font-semibold mb-6">Women's Collection</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {groupedProducts.women.map((product, index) => (
                                    <ProductCard key={product.id} product={product} index={index % 10} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Kids' Section */}
                    {groupedProducts.kids.length > 0 && (
                        <div>
                            <h2 className="text-2xl font-semibold mb-6">Kids' Collection</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {groupedProducts.kids.map((product, index) => (
                                    <ProductCard key={product.id} product={product} index={index % 10} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="text-center py-12">
                    <p className="text-lg text-gray-500 mb-6">You haven't saved any items yet.</p>
                    <Link href="/shop?category=men">
                        <Button>Continue Shopping</Button>
                    </Link>
                </div>
            )}
        </div>
    );
}
