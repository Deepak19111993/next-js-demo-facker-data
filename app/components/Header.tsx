"use client";

import { useRouter, useSearchParams, usePathname, useSearchParams as useSearch } from 'next/navigation';
import { useCallback, useState, useEffect, useRef } from 'react';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LOGIN_BUTTON, navLinks, type NavItem } from "@/constants/header";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/app/context/AuthContext";
import { useCart } from "@/app/context/CartContext";
import { Heart, X, Search, Package, LayoutDashboard, ShoppingCart } from "lucide-react";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { Logo } from "@/components/ui/Logo";

const MegaMenu = ({ submenu, isOpen, categoryName }: { submenu: NavItem['submenu'], isOpen: boolean, categoryName?: string }) => {
    if (!submenu || !isOpen) return null;

    const knownMaterials = new Set(['cotton', 'polyester', 'wool', 'denim', 'leather', 'fleece']);

    const buildHref = (sectionTitle: string, itemName: string) => {
        const params = new URLSearchParams();
        const category = (categoryName || '').toLowerCase();
        const section = (sectionTitle || '').toLowerCase();
        const item = (itemName || '').toLowerCase();

        if (category) {
            params.set('category', category);
        }

        if (category === 'kids') {
            if (section === 'boys' || section === 'girls') {
                params.set('subcategory', section);
                if (item === 'clothing' || item === 'footwear' || item === 'accessories') {
                    params.set('categories', item);
                }
            } else if (section === 'baby') {
                params.set('categories', 'essentials');
                if (item === 'newborn') params.set('types', 'newborn');
                if (item === '0-24 months') params.set('types', '0-24 months');
                if (item === '2-4 years') params.set('types', '2-4 years');
            } else if (section === 'toys & games') {
                params.set('categories', 'toys');
                params.set('types', item);
            } else if (section) {
                params.set('subcategory', section);
            }
        } else {
            if (section) {
                params.set('subcategory', section);
                if (knownMaterials.has(item)) {
                    params.set('materials', item);
                } else {
                    params.set('types', item);
                }
            }
        }

        return `/shop?${params.toString()}`;
    };

    return (
        <div className="w-full fixed left-0 right-0 top-[64px] bg-white shadow-lg transition-all duration-300 ease-in-out z-50 border-t border-gray-100 py-6">
            <div className="container mx-auto px-4 py-6">
                <div className="grid grid-cols-4 gap-8">
                    {submenu.map((section, sectionIndex) => (
                        <div key={sectionIndex} className="space-y-4">
                            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
                                {section.title}
                            </h3>
                            <ul className="mt-2 space-y-2">
                                {section.items.map((item, itemIndex) => {
                                    const newHref = buildHref(section.title, item.name);

                                    return (
                                        <li key={itemIndex}>
                                            <Link
                                                href={newHref}
                                                className="text-gray-600 hover:text-gray-900 text-sm hover:font-medium transition-colors duration-150"
                                            >
                                                {item.name}
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default function Header() {
    const { user, login, logout, savedItems, admin, logoutAdmin } = useAuth();
    const { cartCount, clearCart } = useCart();
    const router = useRouter();
    const pathname = usePathname();
    const isAdminRoute = pathname?.startsWith('/admin');
    const searchParams = useSearch();
    const currentParams = new URLSearchParams(searchParams?.toString() || '');
    const currentCategory = currentParams.get('category');
    const currentCategoryLower = currentCategory?.toLowerCase();
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [activeMenu, setActiveMenu] = useState<number | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    // Close menu when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setActiveMenu(null);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Close menu on route change
    useEffect(() => {
        setActiveMenu(null);
    }, [pathname]);

    // Update search input when URL params change
    useEffect(() => {
        const query = searchParams.get('q') || '';
        setSearchQuery(query);
    }, [searchParams]);

    const handleSearch = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams(searchParams.toString());

        if (searchQuery.trim()) {
            params.set('q', searchQuery.trim());
        } else {
            params.delete('q');
        }

        // Reset to first page when searching
        params.delete('page');

        // Navigate to the same page with new search params
        router.push(`?${params.toString()}`);
    }, [searchQuery, router, searchParams]);

    // Lock body scroll when mobile menu or search is open
    useEffect(() => {
        if (activeMenu === -1 || isSearchOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [activeMenu, isSearchOpen]);
    return (
        <div className="bg-white border-b border-gray-200 sticky top-0 z-50 w-full" ref={menuRef} data-no-view-cursor="true">
            <div className="relative">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex-shrink-0">
                            <Link href="/" className="flex items-center gap-2">
                                <span className="sr-only">Home</span>
                                <div className="h-10 w-10 relative">
                                    <Logo className="w-full h-full" />
                                </div>
                                <span className="text-xl font-bold animate-text-shimmer">Store</span>
                            </Link>
                        </div>

                        {/* Desktop Navigation */}
                        {!isAdminRoute && (
                            <nav className="hidden md:flex md:space-x-4 lg:space-x-6 xl:space-x-8">
                                {navLinks.map((link) => {
                                    const isPathMatch = pathname === link.href;

                                    // Home is active only when we're on the root path with no active category
                                    const isHomeActive = link.href === '/' && pathname === '/' && !currentCategory;

                                    const isActive = activeMenu === link.id ||
                                        (link.href === '/' ? isHomeActive :
                                            (isPathMatch ||
                                                (currentCategoryLower && link.name.toLowerCase() === currentCategoryLower)));

                                    return (
                                        <div
                                            key={link.id}
                                            className="relative group"
                                            onMouseEnter={() => link.submenu && setActiveMenu(link.id)}
                                            onMouseLeave={() => link.submenu && setActiveMenu(null)}
                                        >
                                            <Link
                                                href={link.href ? `${link.href}` : `/product?category=${link.name.toLowerCase()}`}
                                                className={`py-5 md:px-1 lg:px-2 text-sm font-medium transition-colors duration-200 ${isActive
                                                    ? 'text-blue-700 border-b-2 border-blue-700 font-semibold'
                                                    : 'text-gray-700 hover:text-gray-900 hover:border-b-2 hover:border-gray-300'
                                                    }`}
                                            >
                                                {link.name}
                                            </Link>
                                            {link.submenu && (
                                                <MegaMenu
                                                    categoryName={link.name}
                                                    submenu={link.submenu}
                                                    isOpen={activeMenu === link.id}
                                                />
                                            )}
                                        </div>
                                    );
                                })}
                            </nav>
                        )}

                        <div className="flex items-center space-x-2 md:space-x-2 lg:space-x-4">
                            {/* Mobile User Info & Wishlist */}
                            {isAdminRoute ? (
                                admin && (
                                    <div className="flex md:hidden items-center gap-3 mr-1">
                                        <span className="text-sm font-medium text-blue-800 truncate max-w-[120px]">
                                            Admin: {admin.name}
                                        </span>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => {
                                                logoutAdmin();
                                                clearCart();
                                            }}
                                            className="text-red-500 hover:text-red-700 hover:bg-red-50 cursor-pointer px-2"
                                        >
                                            Logout
                                        </Button>
                                    </div>
                                )
                            ) : (
                                user && (
                                    <div className="flex md:hidden items-center gap-3 mr-1">
                                        <Link href="/saved-items" className="text-gray-700 hover:text-gray-900 relative">
                                            <Heart className="h-6 w-6" />
                                            {savedItems.size > 0 && (
                                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-sm font-bold w-5 h-5 flex items-center justify-center rounded-full">
                                                    <AnimatedCounter count={savedItems.size} />
                                                </span>
                                            )}
                                        </Link>
                                        <Link href="/checkout" className="text-gray-700 hover:text-gray-900 relative">
                                            <ShoppingCart className="h-6 w-6" />
                                            {cartCount > 0 && (
                                                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-sm font-bold w-5 h-5 flex items-center justify-center rounded-full animate-bounce">
                                                    <AnimatedCounter count={cartCount} />
                                                </span>
                                            )}
                                        </Link>
                                        <span className="text-sm font-medium text-gray-900 truncate max-w-[120px]">
                                            {user.name}
                                        </span>
                                    </div>
                                )
                            )}

                            {/* Mobile search toggle */}
                            {!isAdminRoute && (
                                <button
                                    className="lg:hidden p-2 text-gray-700 hover:text-gray-900 cursor-pointer mr-0"
                                    onClick={() => setIsSearchOpen(true)}
                                >
                                    <Search className="w-6 h-6" />
                                </button>
                            )}

                            {!isAdminRoute && (
                                <form onSubmit={handleSearch} className="hidden lg:flex items-center">
                                    <div className="relative">
                                        <Input
                                            type="text"
                                            placeholder="Search..."
                                            className="w-32 sm:w-48 md:w-40 lg:w-64 pl-4 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                        <button
                                            type="submit"
                                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                                        >
                                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                            </svg>
                                        </button>
                                    </div>
                                </form>
                            )}

                            {/* Auth Section */}
                            <div className="hidden md:flex items-center space-x-4">
                                {isAdminRoute ? (
                                    admin ? (
                                        <div className="flex items-center gap-3 border-l pl-4 border-gray-300">
                                            <span className="text-sm font-medium text-blue-800">Admin: {admin.name}</span>
                                            <Button variant="ghost" size="sm" onClick={() => {
                                                logoutAdmin();
                                                clearCart();
                                            }} className="text-red-500 hover:text-red-700 hover:bg-red-50 cursor-pointer">
                                                Logout
                                            </Button>
                                        </div>
                                    ) : (
                                        <Link href="/admin/login">
                                            <Button variant="outline" className="cursor-pointer bg-blue-900 text-white border-0 hover:bg-blue-800">
                                                Login
                                            </Button>
                                        </Link>
                                    )
                                ) : (
                                    user ? (
                                        <>
                                            <Link href="/saved-items" className="text-gray-700 hover:text-gray-900 relative">
                                                <Heart className="h-6 w-6" />
                                                {savedItems.size > 0 && (
                                                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-sm font-bold w-5 h-5 flex items-center justify-center rounded-full">
                                                        <AnimatedCounter count={savedItems.size} />
                                                    </span>
                                                )}
                                            </Link>
                                            <Link href="/checkout" className="text-gray-700 hover:text-gray-900 relative">
                                                <ShoppingCart className="h-6 w-6" />
                                                {cartCount > 0 && (
                                                    <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-sm font-bold w-5 h-5 flex items-center justify-center rounded-full animate-bounce">
                                                        <AnimatedCounter count={cartCount} />
                                                    </span>
                                                )}
                                            </Link>
                                            <div className="flex items-center gap-3 border-l pl-4 border-gray-300">
                                                <span className="text-sm font-medium truncate max-w-[150px] lg:max-w-[180px]">Hi, {user.name}</span>
                                                <Link href="/order">
                                                    <Button variant="ghost" size="sm" className="text-gray-700 hover:text-gray-900 cursor-pointer">
                                                        My Orders
                                                    </Button>
                                                </Link>
                                                <Button variant="ghost" size="sm" onClick={() => {
                                                    logout();
                                                    clearCart();
                                                }} className="text-red-500 hover:text-red-700 hover:bg-red-50 cursor-pointer">
                                                    Logout
                                                </Button>
                                            </div>
                                        </>
                                    ) : (
                                        <Link href="/login">
                                            <Button variant="outline" className="cursor-pointer bg-black text-white border-0 hover:text-white hover:bg-black/80 transition-colors duration-200 ease-in-out">
                                                {LOGIN_BUTTON}
                                            </Button>
                                        </Link>
                                    )
                                )}
                            </div>

                            {/* Mobile menu button */}
                            {!isAdminRoute && (
                                <button
                                    className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 cursor-pointer"
                                    onClick={() => setActiveMenu(activeMenu === -1 ? null : -1)}
                                >
                                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Mobile menu overlay */}
                <div
                    className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 md:hidden ${activeMenu === -1 ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                    onClick={() => setActiveMenu(null)}
                />

                {/* Search Overlay */}
                <div
                    className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 lg:hidden ${isSearchOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                    onClick={() => setIsSearchOpen(false)}
                />

                <div className={`fixed top-0 left-0 right-0 bg-white z-[60] p-4 transform transition-transform duration-300 ease-in-out lg:hidden ${isSearchOpen ? 'translate-y-0 shadow-lg' : '-translate-y-full'}`}>
                    <form onSubmit={(e) => {
                        handleSearch(e);
                        setIsSearchOpen(false);
                    }} className="flex items-center gap-2">
                        <div className="relative flex-1">
                            <Input
                                type="text"
                                placeholder="Search products..."
                                className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                autoFocus={isSearchOpen}
                            />
                            <button
                                type="submit"
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                            >
                                <Search className="w-5 h-5" />
                            </button>
                        </div>
                        <button
                            type="button"
                            onClick={() => setIsSearchOpen(false)}
                            className="p-2 text-gray-500 hover:text-gray-700 cursor-pointer"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </form>
                </div>

                {/* Mobile menu drawer */}
                <div
                    className={`fixed inset-y-0 right-0 z-50 w-[300px] bg-white shadow-xl transform transition-transform duration-300 ease-in-out md:hidden flex flex-col ${activeMenu === -1 ? 'translate-x-0' : 'translate-x-full'
                        }`}
                >
                    <div className="flex items-center justify-between p-4 border-b">
                        <span className="text-lg font-bold">Menu</span>
                        <button
                            onClick={() => setActiveMenu(null)}
                            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full cursor-pointer"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto pb-4">
                        <div className="px-2 pt-2 pb-3 space-y-1">
                            {navLinks.map((link) => (
                                <div key={link.id} className="relative">
                                    <Link
                                        href={link.href ? `${link.href}` : `/product?category=${link.name.toLowerCase()}`}
                                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                                        onClick={() => setActiveMenu(activeMenu === link.id ? null : link.id)}
                                    >
                                        {link.name}
                                    </Link>
                                    {link.submenu && activeMenu === link.id && (
                                        <div className="pl-4 mt-1 space-y-1">
                                            {link.submenu.map((section, sectionIndex) => (
                                                <div key={sectionIndex} className="space-y-1">
                                                    <h4 className="px-3 py-1 text-sm font-medium text-gray-500">
                                                        {section.title}
                                                    </h4>
                                                    {section.items.map((item, itemIndex) => (
                                                        <Link
                                                            key={itemIndex}
                                                            href={(() => {
                                                                const params = new URLSearchParams();
                                                                const category = (link.name || '').toLowerCase();
                                                                const sectionTitle = (section.title || '').toLowerCase();
                                                                const itemName = (item.name || '').toLowerCase();
                                                                const knownMaterials = new Set(['cotton', 'polyester', 'wool', 'denim', 'leather', 'fleece']);

                                                                if (category) {
                                                                    params.set('category', category);
                                                                }

                                                                if (category === 'kids') {
                                                                    if (sectionTitle === 'boys' || sectionTitle === 'girls') {
                                                                        params.set('subcategory', sectionTitle);
                                                                        if (itemName === 'clothing' || itemName === 'footwear' || itemName === 'accessories') {
                                                                            params.set('categories', itemName);
                                                                        }
                                                                    } else if (sectionTitle === 'baby') {
                                                                        params.set('categories', 'essentials');
                                                                        if (itemName === 'newborn') params.set('types', 'newborn');
                                                                        if (itemName === '0-24 months') params.set('types', '0-24 months');
                                                                        if (itemName === '2-4 years') params.set('types', '2-4 years');
                                                                    } else if (sectionTitle === 'toys & games') {
                                                                        params.set('categories', 'toys');
                                                                        params.set('types', itemName);
                                                                    } else if (sectionTitle) {
                                                                        params.set('subcategory', sectionTitle);
                                                                    }
                                                                } else {
                                                                    if (sectionTitle) {
                                                                        params.set('subcategory', sectionTitle);
                                                                        if (knownMaterials.has(itemName)) {
                                                                            params.set('materials', itemName);
                                                                        } else {
                                                                            params.set('types', itemName);
                                                                        }
                                                                    }
                                                                }

                                                                return `/product/?${params.toString()}`;
                                                            })()}
                                                            className="block px-3 py-1 text-base font-normal text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                                                        >
                                                            {item.name}
                                                        </Link>
                                                    ))}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}

                        </div>
                    </div>

                    <div className="p-4 border-t border-gray-200 mt-auto">
                        {isAdminRoute ? (
                            admin ? (
                                <div className="space-y-3">
                                    <Button disabled variant="outline" className="w-full justify-start cursor-default bg-blue-50 text-blue-700">
                                        <LayoutDashboard className="mr-2 h-4 w-4" />
                                        Admin Panel
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                            logoutAdmin();
                                            clearCart();
                                            setActiveMenu(null);
                                        }}
                                        className="w-full text-red-500 hover:text-red-700 hover:bg-red-50 border border-red-200 cursor-pointer"
                                    >
                                        Logout Admin
                                    </Button>
                                </div>
                            ) : (
                                <Link href="/admin/login" onClick={() => setActiveMenu(null)}>
                                    <Button className="w-full bg-blue-900 hover:bg-blue-800">
                                        Admin Login
                                    </Button>
                                </Link>
                            )
                        ) : (
                            user ? (
                                <div className="flex flex-col space-y-3">
                                    <Link href="/order" onClick={() => setActiveMenu(null)}>
                                        <Button variant="outline" className="w-full justify-start cursor-pointer">
                                            <Package className="mr-2 h-4 w-4" />
                                            My Orders
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                            logout();
                                            clearCart();
                                            setActiveMenu(null);
                                        }}
                                        className="w-full text-red-500 hover:text-red-700 hover:bg-red-50 border border-red-200 cursor-pointer"
                                    >
                                        Logout
                                    </Button>
                                </div>
                            ) : (
                                <Link href="/login" onClick={() => setActiveMenu(null)}>
                                    <Button className="w-full">
                                        {LOGIN_BUTTON}
                                    </Button>
                                </Link>
                            )
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}