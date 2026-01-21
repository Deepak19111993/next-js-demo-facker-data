'use client';

import { useAuth, type OrderStatus } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Package, ChevronRight, Clock, CheckCircle2, Truck, ChevronDown, ChevronUp } from 'lucide-react';

export default function OrdersPage() {
    const { user, isLoading, orders } = useAuth();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
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
        setMounted(true);
        if (!isLoading && !user) {
            router.push('/login');
        }
    }, [isLoading, user, router]);

    if (!mounted || isLoading || !user) return null;

    // Filter orders for the current user
    const myOrders = orders.filter(order => order.userId === user.id);

    const statusColors: Record<OrderStatus, string> = {
        'Placed': 'bg-blue-100 text-blue-800',
        'Processing': 'bg-yellow-100 text-yellow-800',
        'Shipped': 'bg-purple-100 text-purple-800',
        'Delivered': 'bg-green-100 text-green-800',
    };

    const StatusIcon = ({ status }: { status: OrderStatus }) => {
        switch (status) {
            case 'Placed': return <Package className="w-4 h-4" />;
            case 'Processing': return <Clock className="w-4 h-4" />;
            case 'Shipped': return <Truck className="w-4 h-4" />;
            case 'Delivered': return <CheckCircle2 className="w-4 h-4" />;
            default: return <Package className="w-4 h-4" />;
        }
    };

    return (
        <div className="container mx-auto px-4 py-8! max-w-4xl">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
            </div>

            <div className="space-y-6">
                {myOrders.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Package className="w-8 h-8 text-gray-400" />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900 mb-2">No orders yet</h2>
                        <p className="text-gray-500 mb-6">Start shopping to see your orders here.</p>
                        <Link href="/">
                            <Button>Start Shopping</Button>
                        </Link>
                    </div>
                ) : (
                    myOrders.map((order) => (
                        <div key={order.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                            <div className="p-6">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-mono font-medium text-gray-900">#{order.id}</span>
                                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium flex items-center gap-1 ${statusColors[order.status]}`}>
                                                <StatusIcon status={order.status} />
                                                {order.status}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-500">
                                            Placed on {new Date(order.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                        </p>
                                    </div>
                                    <div className="text-left md:text-right">
                                        <p className="text-sm text-gray-500">Total Amount</p>
                                        <p className="font-bold text-gray-900">${order.totalAmount.toFixed(2)}</p>
                                    </div>
                                </div>

                                <div className="border-t border-gray-100 pt-4 mt-4 flex items-center justify-between">
                                    <div
                                        className="text-sm text-gray-600 cursor-pointer flex items-center gap-1 hover:text-gray-900 select-none"
                                        onClick={() => toggleOrderExpansion(order.id)}
                                    >
                                        {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                                        {expandedOrders.has(order.id) ? (
                                            <ChevronUp className="w-4 h-4 ml-1" />
                                        ) : (
                                            <ChevronDown className="w-4 h-4 ml-1" />
                                        )}
                                    </div>
                                    <Link href={`/order-tracking/${order.id}`}>
                                        <Button variant="outline" size="sm" className="gap-2 cursor-pointer">
                                            Track Order
                                            <ChevronRight className="w-4 h-4" />
                                        </Button>
                                    </Link>
                                </div>

                                {expandedOrders.has(order.id) && (
                                    <div className="mt-4 border-t border-gray-100 bg-gray-50 px-6 py-4 animate-in slide-in-from-top-2 duration-200">
                                        <div className="space-y-4">
                                            {order.items.map((item, idx) => (
                                                <div key={`${order.id}-item-${idx}`} className="flex items-center gap-4">
                                                    <div className="h-16 w-16 bg-white rounded-md border border-gray-200 overflow-hidden flex-shrink-0">
                                                        <img
                                                            src={item.image}
                                                            alt={item.name}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    </div>
                                                    <div className="flex-1">
                                                        <Link href={`/product/${item.id}`} className="font-medium text-gray-900 hover:text-blue-600 line-clamp-1">
                                                            {item.name}
                                                        </Link>
                                                        <p className="text-sm text-gray-500 line-clamp-1">{item.brand}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className="font-semibold text-gray-900">${item.price.toFixed(2)}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
