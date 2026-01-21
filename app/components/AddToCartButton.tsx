'use client';

import { useCart } from '@/app/context/CartContext';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Product } from '@/lib/shopData';
import { ShoppingCart } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export default function AddToCartButton({ product }: { product: Product }) {
    const { addToCart, cartItems } = useCart();
    const { user } = useAuth();
    const router = useRouter();
    const [isInCart, setIsInCart] = useState(false);

    useEffect(() => {
        setIsInCart(cartItems.some(item => item.id === product.id));
    }, [cartItems, product.id]);

    const handleAddToCart = () => {
        if (!user) {
            toast.error('Please login to add items to cart');
            router.push('/login');
            return;
        }

        if (!isInCart) {
            addToCart(product);
            toast.success(`Successfully added ${product.name} to cart`);
        }
    };

    return (
        <Button
            size="lg"
            className={`w-full relative overflow-hidden group transition-all duration-300 rounded-full h-12 ${isInCart
                ? 'bg-green-500 hover:bg-green-600 text-white shadow-md'
                : !product.inStock
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-blue-500/25 active:scale-95'
                }`}
            onClick={handleAddToCart}
            disabled={!product.inStock || isInCart}
        >
            <div className="flex items-center justify-center gap-2">
                {product.inStock ? (
                    isInCart ? (
                        <>
                            <div className="flex items-center gap-2 animate-in zoom-in duration-300">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="font-bold tracking-wide">Securely Added</span>
                            </div>
                        </>
                    ) : (
                        <>
                            <ShoppingCart className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                            <span className="font-bold tracking-wide uppercase">Add to Cart</span>
                        </>
                    )
                ) : (
                    <span className="font-bold tracking-wide uppercase opacity-70">Out of Stock</span>
                )}
            </div>

            {/* Subtle glow effect on hover */}
            {!isInCart && product.inStock && (
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            )}
        </Button>
    );
}
