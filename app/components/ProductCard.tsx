'use client';

import { type Product } from '@/lib/shopData';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/app/context/AuthContext';
import { useCart } from '@/app/context/CartContext';
import { Heart, ShoppingCart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { toggleSavedItem, savedItems, user } = useAuth();
  const { addToCart, cartItems } = useCart();
  const router = useRouter();
  const isSaved = savedItems.has(product.id);
  const isInCart = cartItems.some(item => item.id === product.id);

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent Link navigation
    e.stopPropagation();

    if (!user) {
      router.push('/login');
      return;
    }

    toggleSavedItem(product.id);
  };

  return (
    <Link
      href={`/product/${product.id}`}
      className="group cursor-pointer block animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out fill-mode-backwards"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="relative aspect-square mb-2 overflow-hidden rounded-lg bg-gray-100">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <button
          onClick={handleLike}
          className="absolute top-2 right-2 p-2 rounded-full bg-white/80 hover:bg-white transition-colors z-10 cursor-pointer"
        >
          <Heart
            className={`h-5 w-5 ${isSaved ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
          />
        </button>
      </div>
      <div className="mt-4 flex justify-between">
        <div>
          <h3 className="text-sm text-gray-700">
            {product.name}
          </h3>
          <p className="mt-1 text-sm text-gray-500">{product.category}</p>
        </div>
        <p className="text-sm font-medium text-gray-900">${product.price.toFixed(2)}</p>
      </div>
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (!isInCart) {
            addToCart(product);
            toast.success(`Successfully added ${product.name} to cart`);
          }
        }}
        disabled={isInCart}
        className={`w-full mt-3 flex items-center justify-center gap-2 py-2 px-4 rounded-md transition-colors duration-200 ${isInCart
          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
          : 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'}`}
      >
        {isInCart ? (
          <>
            <span className="text-sm font-medium">Added</span>
          </>
        ) : (
          <>
            <ShoppingCart className="w-4 h-4" />
            <span className="text-sm font-medium">Add to Cart</span>
          </>
        )}
      </button>
    </Link>
  );
}