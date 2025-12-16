'use client';

import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from 'next/navigation';

export function ClearSearch() {
    const router = useRouter();
    const searchParamsObjString = useSearchParams()?.toString() || '';
    return (
        <Button
            variant="ghost"
            className="p-0 text-md text-blue-600 hover:text-blue-800 hover:bg-transparent cursor-pointer"
            onClick={() => {
                const params = new URLSearchParams(searchParamsObjString);
                params.delete('q');
                router.push(`?${params.toString()}`);
            }}
        >
            Clear search
        </Button>
    )
}