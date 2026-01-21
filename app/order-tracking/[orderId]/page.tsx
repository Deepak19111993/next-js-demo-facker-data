'use client';

import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Check, Package, Truck, Clock, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';


export default function OrderTrackingPage() {
    const params = useParams();
    const router = useRouter();
    const orderId = params.orderId as string;
    const { orders, isLoading } = useAuth();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted || isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
            </div>
        );
    }

    const order = orders.find(o => o.id === orderId);

    if (!order) {
        return (
            <div className="container mx-auto px-4 py-8 text-center min-h-[50vh] flex flex-col items-center justify-center">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h1>
                <p className="text-gray-600 mb-8">We couldn't find an order with ID #{orderId}.</p>
                <Link href="/">
                    <Button>Return to Home</Button>
                </Link>
            </div>
        );
    }

    const getStepFromStatus = (status: string) => {
        switch (status.toLowerCase()) {
            case 'placed': return 1;
            case 'processing': return 2;
            case 'shipped': return 3;
            case 'delivered': return 4;
            default: return 1;
        }
    };

    const currentStep = getStepFromStatus(order.status);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const steps = [
        { id: 1, name: 'Order Placed', icon: Package, date: formatDate(order.date) },
        { id: 2, name: 'Processing', icon: Clock, date: currentStep >= 2 ? 'In Progress' : 'Pending' },
        { id: 3, name: 'Shipped', icon: Truck, date: currentStep >= 3 ? formatDate(new Date().toISOString()) : 'Pending' }, // Simplified for demo
        { id: 4, name: 'Delivered', icon: Check, date: currentStep >= 4 ? formatDate(new Date().toISOString()) : 'Pending' },
    ];

    return (
        <div className="container mx-auto px-4 py-8! max-w-4xl">
            <div className="mb-6">
                <button
                    onClick={() => router.back()}
                    className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 cursor-pointer"
                >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Back
                </button>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-4 md:px-8 md:py-8 py-6 bg-gray-50 border-b border-gray-200">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Order Tracking</h1>
                            <p className="text-gray-600">Order ID: <span className="font-mono font-medium text-gray-900">#{orderId}</span></p>
                        </div>
                        <div className="text-left md:text-right">
                            <p className="text-sm text-gray-500">Estimated Delivery</p>
                            <p className="font-semibold text-gray-900 text-lg">
                                {formatDate(order.estimatedDeliveryStart)} - {formatDate(order.estimatedDeliveryEnd)}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="px-4 md:px-6 py-6 md:py-12">
                    {/* Progress Stepper */}
                    <div className="relative">
                        {/* Connecting Line - Desktop Track (Dotted) */}
                        <div className="hidden md:block absolute top-[23px] left-[12.5%] w-[75%] h-0 border-t-2 border-dotted border-gray-300"></div>

                        {/* Connecting Line - Desktop Progress (Solid) */}
                        <div className="hidden md:block absolute top-[22px] left-[12.5%] w-[75%] h-1">
                            <div
                                className="h-full bg-green-500 transition-all duration-1000 ease-out rounded-full"
                                style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                            ></div>
                        </div>
                        <div className="flex flex-col md:flex-row w-full justify-between gap-8 md:gap-0">
                            {steps.map((step) => {
                                const Icon = step.icon;
                                const isCompleted = step.id <= currentStep;
                                const isCurrent = step.id === currentStep;

                                return (
                                    <div key={step.id} className="flex md:flex-col items-center md:text-center gap-4 md:gap-2 relative md:flex-1">

                                        <div className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${isCompleted
                                            ? 'bg-green-500 border-green-500 text-white shadow-md'
                                            : 'bg-white border-gray-200 text-gray-300'
                                            } ${isCurrent ? 'ring-4 ring-green-100 scale-110' : ''}`}>

                                            {isCurrent && (
                                                <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-20 animate-ping"></span>
                                            )}

                                            <Icon className="w-5 h-5" />
                                        </div>

                                        <div className={`md:mt-2 transition-opacity duration-300 ${isCurrent || isCompleted ? 'opacity-100' : 'opacity-60'}`}>
                                            <p className={`font-semibold ${isCompleted ? 'text-gray-900' : 'text-gray-500'}`}>{step.name}</p>
                                            <p className="text-xs text-gray-500">{step.date}</p>
                                        </div>

                                        {/* Mobile vertical line (Dotted Track) */}
                                        {step.id !== steps.length && (
                                            <div className="md:hidden absolute left-[23px] top-12 h-[calc(100%+2rem)] w-0 border-l-2 border-dotted border-gray-300"></div>
                                        )}
                                        {/* Mobile vertical progress (Solid) */}
                                        {step.id < currentStep && step.id !== steps.length && (
                                            <div className="md:hidden absolute left-[23px] top-12 h-[calc(100%+2rem)] w-[2px] bg-green-500"></div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className={`mt-12 p-6 rounded-lg border flex gap-4 ${currentStep === 4 ? 'bg-green-50 border-green-200' : 'bg-blue-50 border-blue-100'
                        }`}>
                        <div className="mt-1">
                            {currentStep === 4 ? (
                                <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center">
                                    <Check className="w-3 h-3 text-green-600" />
                                </div>
                            ) : (
                                <Loader2 className={`w-5 h-5 text-blue-600 ${currentStep < 4 ? 'animate-spin' : ''}`} />
                            )}
                        </div>
                        <div>
                            <h3 className={`font-semibold mb-1 ${currentStep === 4 ? 'text-green-900' : 'text-blue-900'}`}>
                                {currentStep === 1 && 'Order Placed'}
                                {currentStep === 2 && 'Processing Order'}
                                {currentStep === 3 && 'Order Shipped'}
                                {currentStep === 4 && 'Order Delivered'}
                            </h3>
                            <p className={`text-sm ${currentStep === 4 ? 'text-green-700' : 'text-blue-700'}`}>
                                {currentStep === 1 && 'We have received your order and are getting it ready.'}
                                {currentStep === 2 && 'Your order meets our quality standards and is being packed with care.'}
                                {currentStep === 3 && 'Your order is on the way to you!'}
                                {currentStep === 4 && 'Your order has been delivered using our safe, contactless delivery.'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Order Info Summary */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                    <h3 className="text-sm font-bold text-gray-900 uppercase mb-4 tracking-wider">Shipping Details</h3>
                    <div className="space-y-3">
                        <div>
                            <p className="text-xs text-gray-400 font-medium uppercase mb-1">Full Name</p>
                            <p className="text-sm text-gray-900">{order.userName}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 font-medium uppercase mb-1">Address</p>
                            <p className="text-sm text-gray-900 leading-relaxed">
                                {order.shippingAddress || 'Address not provided'}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                    <h3 className="text-sm font-bold text-gray-900 uppercase mb-4 tracking-wider">Payment Method</h3>
                    <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
                        {order.paymentMethod?.toLowerCase().includes('card') ? (
                            <div className="w-12 h-8 bg-gray-800 rounded flex items-center justify-center text-[10px] text-white font-bold">
                                VISA
                            </div>
                        ) : (
                            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
                                <Package className="w-6 h-6" />
                            </div>
                        )}
                        <div>
                            <p className="text-sm font-semibold text-gray-900">{order.paymentMethod || 'Credit Card'}</p>
                            <p className="text-[10px] text-gray-500">
                                {order.paymentMethod?.toLowerCase().includes('card') ? 'Transaction Successful' : 'Pay on Delivery'}
                            </p>
                        </div>
                    </div>
                    <div className="mt-6 flex justify-between items-center px-1">
                        <p className="text-sm text-gray-600 font-medium">Order Total</p>
                        <p className="text-lg font-bold text-gray-900">${order.totalAmount.toFixed(2)}</p>
                    </div>
                </div>
            </div>



            <div className="mt-4 text-center">
                <Link href="/shop?category=men">
                    <Button size="lg" className="px-8 cursor-pointer">
                        Continue Shopping
                    </Button>
                </Link>
            </div>
        </div>
    );
}
