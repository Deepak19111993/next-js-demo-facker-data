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
      <div className="relative aspect-square mb-2 overflow-hidden rounded-lg bg-gray-100 group">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <button
          onClick={handleLike}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/90 shadow-sm hover:bg-white hover:scale-110 transition-all z-10 cursor-pointer"
        >
          <Heart
            className={`h-5 w-5 ${isSaved ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
          />
        </button>

        {/* Overlay Add to Cart Button - Visible on mobile/touch, Hover on desktop */}
        <div className="absolute inset-x-0 bottom-0 p-3 md:p-4 translate-y-0 md:translate-y-full md:group-hover:translate-y-0 transition-transform duration-300 ease-out bg-gradient-to-t from-black/60 to-transparent">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();

              if (!user) {
                toast.error('Please login to add items to cart');
                router.push('/login');
                return;
              }

              if (!isInCart) {
                addToCart(product);
                toast.success(`Successfully added ${product.name} to cart`);
              }
            }}
            disabled={isInCart}
            className={`w-full flex items-center justify-center gap-2 py-2 md:py-2.5 px-4 rounded-full transition-all duration-300 ${isInCart
              ? 'bg-white/20 backdrop-blur-md text-white/80 cursor-not-allowed'
              : 'bg-white text-black hover:bg-blue-600 hover:text-white shadow-lg cursor-pointer transform hover:scale-102 active:scale-95'}`}
          >
            {isInCart ? (
              <>
                <span className="text-xs md:text-sm font-semibold italic">In Cart</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-3.5 h-3.5 md:w-4 h-4" />
                <span className="text-xs md:text-sm font-bold">Add to Cart</span>
              </>
            )}
          </button>
        </div>
      </div>
      <div className="mt-4 flex justify-between px-1">
        <div>
          <h3 className="text-sm font-semibold text-gray-800">
            {product.name}
          </h3>
          <p className="mt-1 text-xs text-gray-500 uppercase tracking-wider">{product.category}</p>
        </div>
        <p className="text-sm font-bold text-blue-600">${product.price.toFixed(2)}</p>
      </div>
    </Link>
  );
}