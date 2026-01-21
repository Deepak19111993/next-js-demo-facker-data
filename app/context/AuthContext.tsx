'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '@/lib/shopData';
import { supabase } from '@/lib/supabaseClient';

export interface User {
    id: string;
    name: string;
    email: string;
}

export type OrderStatus = 'Placed' | 'Processing' | 'Shipped' | 'Delivered';

export interface Order {
    id: string;
    userId: string;
    userName: string;
    items: Product[];
    totalAmount: number;
    status: OrderStatus;
    date: string;
    estimatedDeliveryStart: string;
    estimatedDeliveryEnd: string;
    shippingAddress?: string;
    paymentMethod?: string;
}

interface AuthContextType {
    user: User | null;
    admin: User | null; // Admin session
    setUser: (user: User | null) => void;
    login: (email: string, pass: string) => Promise<boolean>;
    loginAdmin: (email: string, pass: string) => Promise<boolean>; // Admin login
    signup: (name: string, email: string, pass: string) => Promise<boolean>;
    logout: () => void;
    logoutAdmin: () => void; // Admin logout
    isLoading: boolean;
    // Saved Items
    savedItems: Set<string>;
    isLoadingSavedItems: boolean;
    toggleSavedItem: (productId: string) => void;
    isSaved: (productId: string) => boolean;
    // Orders
    orders: Order[];
    placeOrder: (items: Product[], total: number, shippingDetails?: { address: string; paymentMethod: string }) => Promise<string>;
    updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [admin, setAdmin] = useState<User | null>(null); // Admin state
    const [isLoading, setIsLoading] = useState(true);
    const [savedItems, setSavedItems] = useState<Set<string>>(new Set());
    const [isLoadingSavedItems, setIsLoadingSavedItems] = useState(true);
    const router = useRouter();

    // Global Orders State (Load from localStorage)
    const [orders, setOrders] = useState<Order[]>([]);

    useEffect(() => {
        // Load User
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }

        // Load Admin
        const storedAdmin = localStorage.getItem('currentAdmin');
        if (storedAdmin) {
            setAdmin(JSON.parse(storedAdmin));
        }

        // Load Orders (Global - Fallback for guests if needed, but usually for history we want DB)
        const storedOrders = localStorage.getItem('orders');
        if (storedOrders) {
            setOrders(JSON.parse(storedOrders));
        }

        setIsLoading(false);
    }, []);

    // Load Orders from Supabase
    useEffect(() => {
        const fetchOrders = async () => {
            if (!supabase) {
                console.warn('Supabase client not available');
                return;
            }

            let query = supabase.from('order_history').select('*');

            if (admin) {
                // Admin fetches all orders
                query = query.order('created_at', { ascending: false });
            } else if (user) {
                // Regular user fetches only their orders
                query = query.eq('user_id', user.id).order('created_at', { ascending: false });
            } else {
                return;
            }

            const { data, error } = await query;

            if (data && !error) {
                const mappedOrders: Order[] = data.map(o => ({
                    id: String(o.id),
                    userId: o.user_id,
                    userName: o.user_name,
                    items: o.items,
                    totalAmount: o.total_amount,
                    status: o.status,
                    date: o.created_at,
                    estimatedDeliveryStart: o.estimated_delivery_start,
                    estimatedDeliveryEnd: o.estimated_delivery_end,
                    shippingAddress: o.shipping_address,
                    paymentMethod: o.payment_method
                }));
                setOrders(mappedOrders);
                localStorage.setItem('orders', JSON.stringify(mappedOrders));
            }
        };

        fetchOrders();
    }, [user, admin]);

    // Load Saved Items when User Changes
    useEffect(() => {
        const fetchSavedItems = async () => {
            if (user) {
                setIsLoadingSavedItems(true);
                if (!supabase) {
                    setIsLoadingSavedItems(false);
                    return;
                }
                // Try to load from Supabase for logged in users
                const { data, error } = await supabase
                    .from('saved_items')
                    .select('product_id')
                    .eq('user_id', user.id);

                if (data && !error) {
                    const ids = data.map(item => item.product_id);
                    setSavedItems(new Set(ids));
                    // Sync local storage as backup/cache
                    localStorage.setItem(`savedItems_${user.id}`, JSON.stringify(ids));
                } else {
                    // Fallback to local storage if DB fails or offline (optional)
                    const storedSaved = localStorage.getItem(`savedItems_${user.id}`);
                    if (storedSaved) {
                        setSavedItems(new Set(JSON.parse(storedSaved)));
                    } else {
                        setSavedItems(new Set());
                    }
                }
            } else {
                setSavedItems(new Set());
            }
            setIsLoadingSavedItems(false);
        };

        fetchSavedItems();
    }, [user]);

    const toggleSavedItem = async (productId: string) => {
        if (!user) {
            // Redirect or show login (handled in component usually), or just return
            return;
        }

        const newSaved = new Set(savedItems);
        const isAlreadySaved = savedItems.has(productId);

        if (isAlreadySaved) {
            newSaved.delete(productId);
            // Remove from Supabase
            if (supabase) {
                try {
                    await supabase
                        .from('saved_items')
                        .delete()
                        .eq('user_id', user.id)
                        .eq('product_id', productId);
                } catch (error) {
                    console.error("Error removing saved item:", error);
                }
            }
        } else {
            newSaved.add(productId);
            // Add to Supabase
            if (supabase) {
                try {
                    await supabase
                        .from('saved_items')
                        .insert({ user_id: user.id, product_id: productId });
                } catch (error) {
                    console.error("Error adding saved item:", error);
                }
            }
        }

        setSavedItems(newSaved);
        localStorage.setItem(`savedItems_${user.id}`, JSON.stringify(Array.from(newSaved)));
    };

    const login = async (email: string, pass: string) => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Try to find existing registered user
        const storedProfile = localStorage.getItem(`user_profile_${email}`);

        let targetUser: User;

        if (storedProfile) {
            targetUser = JSON.parse(storedProfile);
        } else {
            // Create a pseudo-profile if not signed up explicitly
            targetUser = {
                id: btoa(email), // Simple base64 of email as ID
                name: email.split('@')[0], // Derive name from email
                email: email,
            };
            // Save this "implicit" profile so we kept it
            localStorage.setItem(`user_profile_${email}`, JSON.stringify(targetUser));
        }

        setUser(targetUser);
        localStorage.setItem('currentUser', JSON.stringify(targetUser));
        return true;
    };

    const loginAdmin = async (email: string, pass: string) => {
        await new Promise(resolve => setTimeout(resolve, 1000));

        if (email === 'superadmin@gmail.com' && pass === 'SuperAdmin') {
            const mockAdmin: User = {
                id: 'admin_1',
                name: 'Super Admin',
                email: email,
            };
            setAdmin(mockAdmin);
            localStorage.setItem('currentAdmin', JSON.stringify(mockAdmin));
            return true;
        }
        return false;
    };

    const signup = async (name: string, email: string, pass: string) => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const newUser: User = {
            id: btoa(email), // Consistent ID generation
            name,
            email,
        };

        // Save profile for future logins
        localStorage.setItem(`user_profile_${email}`, JSON.stringify(newUser));

        setUser(newUser);
        localStorage.setItem('currentUser', JSON.stringify(newUser));

        return true;
    };

    const logout = () => {
        setUser(null);
        setOrders([]);
        setSavedItems(new Set());
        localStorage.removeItem('currentUser');
        localStorage.removeItem('orders');
        localStorage.removeItem('shoppingCart');
        // Clear all user-specific saved items keys
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith('savedItems_')) {
                localStorage.removeItem(key);
            }
        });
        router.push('/login');
    };

    const logoutAdmin = () => {
        setAdmin(null);
        setOrders([]);
        localStorage.removeItem('currentAdmin');
        // Note: We keep shoppingCart and orders if they are for the regular user session
        router.push('/admin/login');
    };

    const isSaved = (productId: string) => savedItems.has(productId);

    const placeOrder = async (items: Product[], total: number, shippingDetails?: { address: string; paymentMethod: string }): Promise<string> => {
        if (!user) throw new Error("User must be logged in");

        const orderData: any = {
            user_id: user.id,
            user_name: user.name,
            items,
            total_amount: total,
            status: 'Placed' as OrderStatus,
            estimated_delivery_start: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
            estimated_delivery_end: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        };

        if (shippingDetails) {
            orderData.shipping_address = shippingDetails.address;
            orderData.payment_method = shippingDetails.paymentMethod;
        }

        console.log("Placing order with data:", orderData);

        if (!supabase) {
            throw new Error("Supabase client not available");
        }

        const { data, error } = await supabase
            .from('order_history')
            .insert(orderData)
            .select()
            .single();

        if (error) {
            console.log("--- Supabase Order Error Details ---");
            console.error("Error Message:", error.message || "No message");
            console.error("Error Code:", error.code || "No code");
            console.error("Error Details:", error.details || "No details");
            console.error("Supabase Error Object:", JSON.stringify(error, null, 2));
            console.log("------------------------------------");
            throw error;
        }

        const newOrder: Order = {
            id: String(data.id),
            userId: data.user_id,
            userName: data.user_name,
            items: data.items,
            totalAmount: data.total_amount,
            status: data.status,
            date: data.created_at,
            estimatedDeliveryStart: data.estimated_delivery_start,
            estimatedDeliveryEnd: data.estimated_delivery_end,
            shippingAddress: data.shipping_address,
            paymentMethod: data.payment_method
        };

        setOrders(prev => {
            const updated = [newOrder, ...prev];
            localStorage.setItem('orders', JSON.stringify(updated));
            return updated;
        });

        return newOrder.id;
    };

    const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
        // 1. Update local state
        setOrders(prev => {
            const updated = prev.map(o => o.id === orderId ? { ...o, status } : o);
            localStorage.setItem('orders', JSON.stringify(updated));
            return updated;
        });

        // 2. Update Supabase
        try {
            if (!supabase) throw new Error("Supabase client not available");

            const { error } = await supabase
                .from('order_history')
                .update({ status })
                .eq('id', orderId);

            if (error) throw error;
            console.log(`Successfully updated order ${orderId} status to ${status}`);
        } catch (error) {
            console.error("Error updating order status in Supabase:", error);
            // Revert local state if needed? For now just log.
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            admin,
            setUser,
            login,
            loginAdmin,
            signup,
            logout,
            logoutAdmin,
            isLoading,
            savedItems,
            isLoadingSavedItems,
            toggleSavedItem,
            isSaved,
            orders,
            placeOrder,
            updateOrderStatus
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
