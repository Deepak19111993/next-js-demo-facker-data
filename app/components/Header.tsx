"use client";

import { useRouter, useSearchParams, usePathname, useSearchParams as useSearch } from 'next/navigation';
import { useCallback, useState, useEffect, useRef } from 'react';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LOGIN_BUTTON, navLinks, type NavItem } from "@/constants/header";
import { Input } from "@/components/ui/input";

const MegaMenu = ({ submenu, isOpen, categoryName }: { submenu: NavItem['submenu'], isOpen: boolean, categoryName?: string }) => {
    if (!submenu || !isOpen) return null;

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
                                    // Create search params for the URL
                                    const params = new URLSearchParams();
                                    params.set('category', categoryName?.toLowerCase() || '');
                                    params.set('categories', section.title?.toLowerCase() || '');
                                    params.set('materials', item.name?.toLowerCase() || '');

                                    // Create the URL with the item and category
                                    const newHref = `/facility/?${params.toString()}`;

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
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearch();
    const currentParams = new URLSearchParams(searchParams?.toString() || '');
    const currentCategory = currentParams.get('category');
    const [searchQuery, setSearchQuery] = useState('');
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
    return (
        <div className="bg-white border-b border-gray-200 sticky top-0 z-50 w-full" ref={menuRef}>
            <div className="relative">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex-shrink-0">
                            <Link href="/" className="text-xl font-bold text-gray-900">
                                Logo
                            </Link>
                        </div>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex space-x-8">
                            {navLinks.map((link) => {
                                const searchParams = useSearchParams();
                                const currentCategory = searchParams?.get('category')?.toLowerCase();

                                const isPathMatch = pathname === link.href;

                                // Home is active only when we're on the root path with no active category
                                const isHomeActive = link.href === '/' && pathname === '/' && !currentCategory;

                                const isActive = activeMenu === link.id ||
                                    (link.href === '/' ? isHomeActive :
                                        (isPathMatch ||
                                            (currentCategory && link.name.toLowerCase() === currentCategory)));

                                return (
                                    <div
                                        key={link.id}
                                        className="relative group"
                                        onMouseEnter={() => link.submenu && setActiveMenu(link.id)}
                                        onMouseLeave={() => link.submenu && setActiveMenu(null)}
                                    >
                                        <Link
                                            href={link.href ? `${link.href}` : `/facility?category=${link.name.toLowerCase()}`}
                                            className={`py-5 px-2 text-sm font-medium transition-colors duration-200 ${isActive
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

                        <div className="flex items-center space-x-4">
                            <form onSubmit={handleSearch} className="hidden md:flex items-center">
                                <div className="relative">
                                    <Input
                                        type="text"
                                        placeholder="Search products..."
                                        className="w-64 pl-4 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                    <button
                                        type="submit"
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </button>
                                </div>
                            </form>

                            <Button variant="outline" className="mr-0 hidden md:inline-flex cursor-pointer bg-black text-white border-0 hover:text-white hover:bg-black/80 transition-colors duration-200 ease-in-out">
                                {LOGIN_BUTTON}
                            </Button>

                            {/* Mobile menu button */}
                            <button
                                className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                                onClick={() => setActiveMenu(activeMenu === -1 ? null : -1)}
                            >
                                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile menu */}
                <div className={`md:hidden ${activeMenu === -1 ? 'block' : 'hidden'} bg-white border-t border-gray-200`}>
                    <div className="px-2 pt-2 pb-3 space-y-1">
                        {navLinks.map((link) => (
                            <div key={link.id} className="relative">
                                <Link
                                    href={link.href}
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
                                                        href={`/products?category=${encodeURIComponent(item.name.toLowerCase())}`}
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
                        <div className="px-3 py-2">
                            <form onSubmit={handleSearch} className="flex space-x-2">
                                <Input
                                    type="text"
                                    placeholder="Search..."
                                    className="flex-1"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <Button type="submit" variant="outline" size="sm">
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </Button>
                            </form>
                        </div>
                        <div className="px-3 py-2">
                            <Button className="w-full">
                                {LOGIN_BUTTON}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}