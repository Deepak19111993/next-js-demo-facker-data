'use client';

import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, ChevronDown, ChevronUp, Loader2, Package, ChevronRight } from 'lucide-react';


export default function OrderHistoryPage() {
    const { user, orders, isLoading } = useAuth();
    const router = useRouter();
    const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());

    const toggleOrderExpansion = (orderId: string) => {
        setExpandedOrders(prev => {
            const next = new Set(prev);
            if (next.has(orderId)) {
                next.delete(orderId);
            } else {
                next.add(orderId);
            }
            return next;
        });
    };

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/login');
        }
    }, [isLoading, user, router]);

    if (isLoading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
            </div>
        );
    }

    // Filter orders to only show those belonging to the current user
    const myOrders = orders.filter(order => order.userId === user.id);

    return (
        <div className="container mx-auto px-4 py-8! max-w-4xl">
            <div className="mb-6">
                <button
                    onClick={() => router.back()}
                    className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
                >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Back
                </button>
            </div>

            <h1 className="text-3xl font-bold mb-8">My Order History</h1>

            {myOrders.length > 0 ? (
                <div className="space-y-6">
                    {myOrders.map((order) => (
                        <div key={order.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                            <div className="bg-gray-50 px-6 py-4 flex flex-wrap justify-between items-center gap-4 border-b border-gray-200">
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-semibold">Order ID</p>
                                    <p className="text-sm font-medium text-gray-900">#{order.id.slice(-8).toUpperCase()}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-semibold">Date</p>
                                    <p className="text-sm font-medium text-gray-900">{new Date(order.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-semibold">Total Amount</p>
                                    <p className="text-sm font-bold text-gray-900">${order.totalAmount.toFixed(2)}</p>
                                </div>
                                <div>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                                        order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                                            'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {order.status}
                                    </span>
                                </div>
                            </div>

                            <div className="px-6 py-4 border-b border-gray-100">
                                <button
                                    onClick={() => toggleOrderExpansion(order.id)}
                                    className="w-full flex items-center justify-between text-sm text-gray-600 hover:text-gray-900 transition-colors py-2 cursor-pointer"
                                >
                                    <div className="flex items-center gap-2">
                                        <Package className="w-4 h-4" />
                                        <span>{order.items.length} {order.items.length === 1 ? 'Item' : 'Items'}</span>
                                    </div>
                                    <div className="flex items-center gap-1 font-medium text-blue-600">
                                        {expandedOrders.has(order.id) ? (
                                            <>Hide Details <ChevronUp className="w-4 h-4" /></>
                                        ) : (
                                            <>View Details <ChevronDown className="w-4 h-4" /></>
                                        )}
                                    </div>
                                </button>
                            </div>

                            {expandedOrders.has(order.id) && (
                                <div className="px-6 py-6 bg-gray-50/50 animate-in slide-in-from-top-2 duration-300">
                                    <div className="space-y-4">
                                        {/* Shipping and Payment Info */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4 border-b border-gray-200">
                                            <div>
                                                <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">Shipping Address</p>
                                                <p className="text-xs text-gray-600 leading-relaxed">
                                                    {order.shippingAddress || 'Standard Shipping Address'}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">Payment Method</p>
                                                <div className="text-xs text-gray-600 flex items-center gap-2">
                                                    {order.paymentMethod?.toLowerCase().includes('card') ? (
                                                        <span className="w-8 h-4 bg-gray-800 rounded flex items-center justify-center text-[6px] text-white font-bold">VISA</span>
                                                    ) : (
                                                        <div className="w-8 h-4 bg-green-100 rounded flex items-center justify-center">
                                                            <Package className="w-3 h-3 text-green-600" />
                                                        </div>
                                                    )}
                                                    <span>{order.paymentMethod || 'Credit Card'}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <p className="text-[10px] text-gray-400 uppercase font-bold">Items</p>
                                            {order.items.map((item, idx) => (
                                                <div key={idx} className="flex gap-4 items-center">
                                                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                                        <img
                                                            src={item.image}
                                                            alt={item.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="text-sm font-medium text-gray-900 truncate">{item.name}</h4>
                                                        <p className="text-xs text-gray-500 capitalize">{item.category} • {item.brand || 'Premium'}</p>
                                                    </div>
                                                    <div className="text-sm font-medium text-gray-900">
                                                        ${item.price.toFixed(2)}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="px-6 py-4 flex justify-end">
                                <Button asChild variant="outline" size="sm" className="gap-2 cursor-pointer">
                                    <Link href={`/order-tracking/${order.id}`}>
                                        Track Order <ChevronRight size={16} />
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                    <div className="mb-4 flex justify-center">
                        <Package className="w-16 h-16 text-gray-300" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders yet</h3>
                    <p className="text-gray-500 mb-8">Looks like you haven't placed any orders yet. Start exploring our collection!</p>
                    <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white px-8 rounded-full">
                        <Link href="/shop?category=men">Browse Collection</Link>
                    </Button>
                </div>
            )}
        </div>
    );
}
