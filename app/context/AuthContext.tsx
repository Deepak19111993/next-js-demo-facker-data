'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '@/lib/shopData';
import { supabase } from '@/lib/supabaseClient';
import { Session } from '@supabase/supabase-js';

export interface User {
    id: string;
    name: string;
    email: string;
    phone?: string;
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
    session: Session | null;
    admin: User | null;
    setUser: (user: User | null) => void;
    loginAdmin: (email: string, pass: string) => Promise<boolean>;
    logout: () => Promise<void>;
    logoutAdmin: () => void;
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
    const [session, setSession] = useState<Session | null>(null);
    const [admin, setAdmin] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [savedItems, setSavedItems] = useState<Set<string>>(new Set());
    const [isLoadingSavedItems, setIsLoadingSavedItems] = useState(true);
    const router = useRouter();

    // Global Orders State
    const [orders, setOrders] = useState<Order[]>([]);

    useEffect(() => {
        // Initialize Supabase Auth Listener
        if (!supabase) {
            setIsLoading(false);
            return;
        }

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
            setSession(currentSession);

            if (currentSession?.user) {
                if (!supabase) return;
                // Fetch profile
                const { data: profile, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', currentSession.user.id)
                    .single();

                if (profile) {
                    setUser({
                        id: profile.id,
                        name: profile.full_name || currentSession.user.email?.split('@')[0] || 'User',
                        email: profile.email || currentSession.user.email || '',
                        phone: profile.phone || currentSession.user.phone,
                    });
                } else {
                    // Fallback if profile doesn't exist yet
                    setUser({
                        id: currentSession.user.id,
                        name: currentSession.user.user_metadata?.full_name || currentSession.user.email?.split('@')[0] || 'User',
                        email: currentSession.user.email || '',
                        phone: currentSession.user.phone,
                    });
                }
            } else {
                setUser(null);
            }
            setIsLoading(false);
        });

        // Initial Session Check
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (!session) {
                setIsLoading(false);
            }
        });

        // Load Admin from Admin LocalStorage
        const storedAdmin = localStorage.getItem('currentAdmin');
        if (storedAdmin) {
            setAdmin(JSON.parse(storedAdmin));
        }

        return () => {
            subscription.unsubscribe();
        };
    }, []);


    // Load Orders from Supabase
    useEffect(() => {
        const fetchOrders = async () => {
            if (!supabase) return;

            let query = supabase.from('order_history').select('*');

            if (admin) {
                query = query.order('created_at', { ascending: false });
            } else if (user) {
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
            }
        };

        fetchOrders();
    }, [user, admin]);

    // Load Saved Items
    useEffect(() => {
        const fetchSavedItems = async () => {
            if (user) {
                setIsLoadingSavedItems(true);
                if (!supabase) {
                    setIsLoadingSavedItems(false);
                    return;
                }
                const { data, error } = await supabase
                    .from('saved_items')
                    .select('product_id')
                    .eq('user_id', user.id);

                if (data && !error) {
                    const ids = data.map(item => item.product_id);
                    setSavedItems(new Set(ids));
                } else {
                    setSavedItems(new Set());
                }
            } else {
                setSavedItems(new Set());
            }
            setIsLoadingSavedItems(false);
        };

        fetchSavedItems();
    }, [user]);

    const toggleSavedItem = async (productId: string) => {
        if (!user || !supabase) return;

        const newSaved = new Set(savedItems);
        const isAlreadySaved = savedItems.has(productId);

        if (isAlreadySaved) {
            newSaved.delete(productId);
            try {
                await supabase.from('saved_items').delete().eq('user_id', user.id).eq('product_id', productId);
            } catch (error) {
                console.error("Error removing saved item:", error);
            }
        } else {
            newSaved.add(productId);
            try {
                await supabase.from('saved_items').insert({ user_id: user.id, product_id: productId });
            } catch (error) {
                console.error("Error adding saved item:", error);
            }
        }
        setSavedItems(newSaved);
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

    const logout = async () => {
        if (supabase) {
            await supabase.auth.signOut();
        }
        setUser(null);
        setSession(null);
        setOrders([]);
        setSavedItems(new Set());
        router.push('/login');
    };

    const logoutAdmin = () => {
        setAdmin(null);
        setOrders([]);
        localStorage.removeItem('currentAdmin');
        router.push('/admin/login');
    };

    const isSaved = (productId: string) => savedItems.has(productId);

    const placeOrder = async (items: Product[], total: number, shippingDetails?: { address: string; paymentMethod: string }): Promise<string> => {
        if (!user || !supabase) throw new Error("User must be logged in");

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

        const { data, error } = await supabase
            .from('order_history')
            .insert(orderData)
            .select()
            .single();

        if (error) throw error;

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

        setOrders(prev => [newOrder, ...prev]);
        return newOrder.id;
    };

    const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
        if (!supabase) return;
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
        await supabase.from('order_history').update({ status }).eq('id', orderId);
    };

    return (
        <AuthContext.Provider value={{
            user,
            session,
            admin,
            setUser,
            loginAdmin,
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
