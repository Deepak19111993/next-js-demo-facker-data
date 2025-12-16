"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState, useEffect } from 'react';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LOGIN_BUTTON, navLinks } from "@/constants/header";
import { Input } from "@/components/ui/input";

export default function Header() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');

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
   <div className="py-5 bg-white border border-b border-[#ececec]">
    <div className="container">
        <div className="flex items-center">
            <span className="mr-4">Logo</span>
            <div className="flex flex-1 justify-center px-4">
                <ul className="flex flex-wrap gap-8">
                    {navLinks?.map((navLink: any) => (
                        <li key={navLink.id}>
                            <Link className="px-2 py-1" href={navLink.href}>{navLink.name}</Link>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="ml-auto flex items-center">
                <form onSubmit={handleSearch} className="mr-5 flex">
                    <Input 
                        placeholder="Search products..." 
                        type="search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="min-w-[200px] rounded-r-none ring-0 focus-visible:ring-0 focus-visible:border-[#e5e5e5]"
                    />
                    <Button type="submit" variant="outline" className='rounded-l-none border-l-0 cursor-pointer'>
                        Search
                    </Button>
                </form>
                <Button className="cursor-pointer">{LOGIN_BUTTON}</Button>
            </div>
        </div>
    </div>
   </div>
  );
}