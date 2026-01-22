'use client';

import { useAuth } from '@/app/context/AuthContext';
import { useCart } from '@/app/context/CartContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, Loader2, Minus, Plus, Trash2, Package } from 'lucide-react';

export default function CheckoutPage() {
    const { user, isLoading, placeOrder } = useAuth();
    const { cartItems, cartTotal, updateQuantity, removeFromCart, clearCart } = useCart();
    const router = useRouter();
    const [isSuccess, setIsSuccess] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        address: '',
        cardNumber: '',
        expiry: '',
        cvv: '',
        paymentMethod: 'card' // 'card' or 'cod'
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        // Special handling for card number formatting
        if (name === 'cardNumber') {
            const val = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
            const matches = val.match(/\d{4,16}/g);
            const match = (matches && matches[0]) || '';
            const parts: string[] = [];

            for (let i = 0, len = match.length; i < len; i += 4) {
                parts.push(match.substring(i, i + 4));
            }

            if (parts.length) {
                setFormData(prev => ({ ...prev, [name]: parts.join(' ') }));
            } else {
                setFormData(prev => ({ ...prev, [name]: val }));
            }
            return;
        }

        // Special handling for expiry date formatting (MM/YY)
        if (name === 'expiry') {
            const val = value.replace(/\D/g, ''); // Remove all non-digits
            if (val.length <= 2) {
                setFormData(prev => ({ ...prev, [name]: val }));
            } else {
                setFormData(prev => ({ ...prev, [name]: `${val.slice(0, 2)}/${val.slice(2, 4)}` }));
            }
            return;
        }

        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const isFormValid = () => {
        const baseValid = (
            formData.fullName.trim() !== '' &&
            formData.email.trim() !== '' &&
            formData.address.trim() !== ''
        );

        if (formData.paymentMethod === 'cod') return baseValid;

        return (
            baseValid &&
            formData.cardNumber.replace(/\s/g, '').length === 16 &&
            formData.expiry.trim().length === 5 &&
            formData.cvv.trim().length === 3
        );
    };

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/login');
        } else if (user) {
            // Pre-fill user info
            setFormData(prev => ({
                ...prev,
                fullName: user.name || '',
                email: user.email || ''
            }));
        }
    }, [isLoading, user, router]);

    const handlePlaceOrder = async () => {
        if (!isFormValid()) return;

        setIsProcessing(true);
        try {
            const orderId = await placeOrder(cartItems, cartTotal, {
                address: formData.address,
                paymentMethod: formData.paymentMethod === 'card' ? 'Credit Card' : 'Cash on Delivery'
            });
            setIsSuccess(true);
            clearCart();
            setTimeout(() => {
                router.push(`/order-tracking/${orderId}`);
            }, 1500);
        } catch (error) {
            console.error("Failed to place order", error);
            setIsProcessing(false);
        }
    };

    if (isLoading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
            </div>
        );
    }

    if (isSuccess) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg text-center">
                    <div className="mb-4 flex justify-center">
                        <CheckCircle2 className="w-16 h-16 text-green-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Confirmed!</h2>
                    <p className="text-gray-600 mb-6">Thank you for your purchase. Your order has been placed successfully.</p>
                    <p className="text-sm text-gray-500">Redirecting to tracking...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-4! md:py-8! max-w-4xl">
            <div className="mb-4 md:mb-6">
                <button
                    onClick={() => router.back()}
                    className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 cursor-pointer"
                >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Back
                </button>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">Shopping Cart & Checkout</h1>

            <div className={`grid grid-cols-1 ${cartItems.length > 0 ? 'lg:grid-cols-3' : ''} gap-4 lg:gap-8`}>
                {/* Checkout Sections */}
                <div className={`${cartItems.length > 0 ? 'lg:col-span-2' : ''} space-y-4 md:space-y-6`}>
                    {cartItems.length > 0 && (
                        <>
                            {/* Shipping Information */}
                            <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6 shadow-sm">
                                <h2 className="text-lg md:text-xl font-semibold mb-4 flex items-center gap-2">
                                    <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-sm">1</div>
                                    Shipping Information
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex flex-col space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Full Name <span className="text-red-500">*</span></label>
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none bg-gray-50 text-gray-500 cursor-not-allowed transition-all text-sm"
                                            placeholder="John Doe"
                                            readOnly
                                        />
                                    </div>
                                    <div className="flex flex-col space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Email Address <span className="text-red-500">*</span></label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none bg-gray-50 text-gray-500 cursor-not-allowed transition-all text-sm"
                                            placeholder="john@example.com"
                                            readOnly
                                        />
                                    </div>
                                    <div className="flex flex-col md:col-span-2 space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Street Address <span className="text-red-500">*</span></label>
                                        <input
                                            type="text"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                                            placeholder="123 Shopping St, Retail City"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Payment Method */}
                            <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6 shadow-sm">
                                <h2 className="text-lg md:text-xl font-semibold mb-4 flex items-center gap-2">
                                    <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-sm">2</div>
                                    Payment Method
                                </h2>
                                <div className="space-y-4">
                                    {/* Credit Card Option */}
                                    <div
                                        onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'card' }))}
                                        className={`p-4 border-2 rounded-lg flex items-center justify-between cursor-pointer transition-all ${formData.paymentMethod === 'card' ? 'border-blue-500 bg-blue-50/50' : 'border-gray-100 bg-white hover:border-blue-200'}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-6 bg-gray-800 rounded flex items-center justify-center text-[8px] text-white font-bold">VISA</div>
                                            <div>
                                                <p className="text-sm font-semibold text-gray-900">Credit Card</p>
                                                <p className="text-xs text-gray-500">Safe and secure payment</p>
                                            </div>
                                        </div>
                                        <input type="radio" checked={formData.paymentMethod === 'card'} readOnly className="w-4 h-4 text-blue-600" />
                                    </div>

                                    {/* Cash on Delivery Option */}
                                    <div
                                        onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'cod' }))}
                                        className={`p-4 border-2 rounded-lg flex items-center justify-between cursor-pointer transition-all ${formData.paymentMethod === 'cod' ? 'border-blue-500 bg-blue-50/50' : 'border-gray-100 bg-white hover:border-blue-200'}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
                                                <Package className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-gray-900">Cash on Delivery</p>
                                                <p className="text-xs text-gray-500">Pay when you receive the order</p>
                                            </div>
                                        </div>
                                        <input type="radio" checked={formData.paymentMethod === 'cod'} readOnly className="w-4 h-4 text-blue-600" />
                                    </div>

                                    {/* Credit Card Details (only shown if 'card' selected) */}
                                    {formData.paymentMethod === 'card' && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-100 animate-in fade-in slide-in-from-top-2 duration-300">
                                            <div className="md:col-span-2 flex flex-col space-y-2">
                                                <label className="text-sm font-medium text-gray-700">Card Number <span className="text-red-500">*</span></label>
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        name="cardNumber"
                                                        value={formData.cardNumber}
                                                        onChange={handleInputChange}
                                                        maxLength={19}
                                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm pl-15"
                                                        placeholder="0000 0000 0000 0000"
                                                        required
                                                    />
                                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs uppercase">Credit</span>
                                                </div>
                                            </div>
                                            <div className="flex flex-col space-y-2">
                                                <label className="text-sm font-medium text-gray-700">Expiry Date <span className="text-red-500">*</span></label>
                                                <input
                                                    type="text"
                                                    name="expiry"
                                                    value={formData.expiry}
                                                    onChange={handleInputChange}
                                                    maxLength={5}
                                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                                                    placeholder="MM/YY"
                                                    required
                                                />
                                            </div>
                                            <div className="flex flex-col space-y-2">
                                                <label className="text-sm font-medium text-gray-700">CVV <span className="text-red-500">*</span></label>
                                                <input
                                                    type="password"
                                                    name="cvv"
                                                    value={formData.cvv}
                                                    onChange={handleInputChange}
                                                    maxLength={3}
                                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                                                    placeholder="***"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    )}

                    {/* Cart Items */}
                    <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6 shadow-sm">
                        <h2 className="text-lg md:text-xl font-semibold mb-4 flex items-center gap-2">
                            {cartItems.length > 0 && <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-sm">3</div>}
                            Cart Items ({cartItems.length})
                        </h2>
                        {cartItems.length > 0 ? (
                            <div className="divide-y divide-gray-100">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="py-3 md:py-4 flex gap-3 md:gap-4">
                                        <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 flex flex-col justify-between min-w-0">
                                            <div>
                                                <h3 className="font-medium text-gray-900 text-sm md:text-base truncate">{item.name}</h3>
                                                <p className="text-xs md:text-sm text-gray-500 capitalize">{item.brand}</p>
                                                <p className="text-xs md:text-sm text-gray-500 capitalize">{item.gender} • {item.category}</p>
                                            </div>
                                            <div className="flex items-center mt-2">
                                                <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1 border border-gray-100">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        disabled={item.quantity <= 1}
                                                        className={`p-1 rounded-md transition-all ${item.quantity <= 1
                                                            ? 'text-gray-300 cursor-not-allowed'
                                                            : 'hover:bg-white hover:shadow-sm text-gray-500 cursor-pointer'
                                                            }`}
                                                    >
                                                        <Minus className="w-3.5 h-3.5" />
                                                    </button>
                                                    <span className="text-sm font-semibold w-6 text-center">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="p-1 rounded-md hover:bg-white hover:shadow-sm text-gray-500 transition-all cursor-pointer"
                                                    >
                                                        <Plus className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right flex flex-col justify-between items-end">
                                            <div>
                                                <p className="font-bold text-gray-900 text-sm md:text-base">${(item.price * item.quantity).toFixed(2)}</p>
                                                <p className="text-[10px] md:text-xs text-gray-400 capitalize">${item.price.toFixed(2)} each</p>
                                            </div>
                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className="text-red-500 hover:text-red-700 text-xs flex items-center gap-1 mt-auto transition-colors cursor-pointer group py-1"
                                            >
                                                <Trash2 className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                                                <span className="font-medium">Remove</span>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 md:py-20">
                                <p className="text-gray-500 mb-6 text-lg">Your cart is empty.</p>
                                <Link href="/shop?category=men">
                                    <Button variant="outline" className="px-8">Start Shopping</Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Price Summary */}
                {cartItems.length > 0 && (
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6 shadow-sm sticky top-20">
                            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-gray-600 text-sm md:text-base">
                                    <span>Subtotal</span>
                                    <span>${cartTotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600 text-sm md:text-base">
                                    <span>Shipping</span>
                                    <span className="text-green-600">Free</span>
                                </div>
                                <div className="border-t pt-3 flex justify-between font-bold text-lg text-gray-900">
                                    <span>Total</span>
                                    <span>${cartTotal.toFixed(2)}</span>
                                </div>
                            </div>
                            <Button
                                className={`w-full text-lg py-6 ${!isFormValid() || isProcessing
                                    ? 'cursor-not-allowed bg-gray-100 text-gray-400 hover:bg-gray-100 disabled:pointer-events-auto'
                                    : 'cursor-pointer bg-black text-white hover:bg-gray-800'
                                    }`}
                                onClick={handlePlaceOrder}
                                disabled={!isFormValid() || isProcessing}
                            >
                                {isProcessing ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    "Place Order"
                                )}
                            </Button>
                            {!isFormValid() && (
                                <p className="mt-4 text-[11px] text-red-500 text-center">
                                    * Please fill all fields correctly to place order
                                </p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
