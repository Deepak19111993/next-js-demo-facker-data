'use client';

import { useCart } from '@/app/context/CartContext';
import { Button } from '@/components/ui/button';
import { Product } from '@/lib/shopData';
import { ShoppingCart } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export default function AddToCartButton({ product }: { product: Product }) {
    const { addToCart, cartItems } = useCart();
    const [isInCart, setIsInCart] = useState(false);

    useEffect(() => {
        setIsInCart(cartItems.some(item => item.id === product.id));
    }, [cartItems, product.id]);

    const handleAddToCart = () => {
        if (!isInCart) {
            addToCart(product);
            toast.success(`Successfully added ${product.name} to cart`);
        }
    };

    return (
        <Button
            size="lg"
            className={`w-full ${isInCart || !product.inStock ? 'cursor-not-allowed bg-gray-100 text-gray-400 hover:bg-gray-100' : ''}`}
            onClick={handleAddToCart}
            disabled={!product.inStock || isInCart}
        >
            {product.inStock ? (
                isInCart ? (
                    'Added'
                ) : (
                    <>
                        Add to Cart
                    </>
                )
            ) : (
                'Out of Stock'
            )}
        </Button>
    );
}
