'use client';

import { useAuth, type Order, type OrderStatus } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ExternalLink, RefreshCw } from 'lucide-react';
import { toast } from "sonner"

export default function AdminDashboard() {
    const { admin, orders, updateOrderStatus, logoutAdmin, isLoading } = useAuth();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (!isLoading && !admin) {
            router.push('/admin/login');
        }
    }, [isLoading, admin, router]);

    if (!mounted || isLoading || !admin) {
        return null;
    }

    // This block will only be reached if admin is present.
    // The check for superadmin@gmail.com is kept as per the provided Code Edit,
    // even if the loginAdmin function might already enforce it.
    if (admin.email !== 'superadmin@gmail.com') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg text-center">
                    <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
                    <p className="text-gray-600 mb-6">You do not have permission to view the Admin Dashboard.</p>
                    <p className="text-sm text-gray-500 mb-6">Current User: {admin?.email}</p>
                    <div className="flex flex-col gap-3">
                        <Button
                            onClick={() => {
                                logoutAdmin(); // Use logoutAdmin here
                                window.location.href = '/admin/login'; // Redirect after logout
                            }}
                            className="w-full cursor-pointer"
                        >
                            Logout & Login as Admin
                        </Button>
                        <Link href="/" className="text-sm text-blue-600 hover:text-blue-800">
                            Return to Home
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const statusColors: Record<OrderStatus, string> = {
        'Placed': 'bg-blue-100 text-blue-800',
        'Processing': 'bg-yellow-100 text-yellow-800',
        'Shipped': 'bg-purple-100 text-purple-800',
        'Delivered': 'bg-green-100 text-green-800',
    };

    const handleStatusChange = async (orderId: string, newStatus: string) => {
        try {
            await updateOrderStatus(orderId, newStatus as OrderStatus);
            toast.success(`Order #${orderId} updated to ${newStatus}`);
        } catch (e) {
            toast.error("Failed to update status");
        }
    };

    return (
        <div className="container mx-auto px-4 py-8!">
            <h1 className="text-3xl font-bold md:mb-8 mb-5">Admin Dashboard</h1>

            <div className="bg-white md:p-6 p-4 rounded-lg shadow-md mb-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold mb-2">Welcome, {admin.name}</h2>
                        <p className="text-gray-600">Manage all customer orders here.</p>
                    </div>
                    <div className="flex gap-4">
                        <Button
                            onClick={async () => {
                                const btn = document.getElementById('seed-btn');
                                if (btn) {
                                    btn.innerText = 'Seeding...';
                                    (btn as HTMLButtonElement).disabled = true;
                                }
                                try {
                                    const res = await fetch('/api/admin/seed', { method: 'POST' });
                                    const data = await res.json();
                                    if (data.success) {
                                        toast("Database Seeded Successfully", {
                                            description: "Products have been added to the database.",
                                        })
                                    } else {
                                        toast.error("Seeding Failed", {
                                            description: JSON.stringify(data.details || data.error),
                                        })
                                    }
                                } catch (e) {
                                    toast.error("Error seeding database")
                                } finally {
                                    if (btn) {
                                        btn.innerText = 'Seed Database';
                                        (btn as HTMLButtonElement).disabled = false;
                                    }
                                }
                            }}
                            id="seed-btn"
                            className="bg-green-600 hover:bg-green-700 text-white cursor-pointer"
                        >
                            Seed Database
                        </Button>

                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="md:p-6 p-4 border-b border-gray-200">
                    <h2 className="text-xl font-semibold">All Orders</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {orders.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                                        No orders found.
                                    </td>
                                </tr>
                            ) : (
                                orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="font-mono text-sm font-medium text-gray-900">#{order.id}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(order.date).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{order.userName}</div>
                                            <div className="text-sm text-gray-500">{order.userId}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {order.items.length} items
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            ${order.totalAmount.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[order.status]}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <div className="flex items-center gap-3">
                                                <select
                                                    value={order.status}
                                                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                    className="block w-32 pl-3 pr-8 py-1 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md cursor-pointer border"
                                                >
                                                    <option value="Placed">Placed</option>
                                                    <option value="Processing">Processing</option>
                                                    <option value="Shipped">Shipped</option>
                                                    <option value="Delivered">Delivered</option>
                                                </select>
                                                <Link href={`/order-tracking/${order.id}`} target="_blank" className="text-blue-600 hover:text-blue-900">
                                                    <ExternalLink className="w-4 h-4 cursor-pointer" />
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

    );
}
