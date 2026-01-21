'use client';

import { Button } from "@/components/ui/button";
import { usePathname, useSearchParams } from 'next/navigation';
import { useTransitionContext } from '@/app/context/TransitionContext';

export function KidsSubcategoryFilter({
    selectedSubcategory,
}: {
    selectedSubcategory?: string;
}) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { isPending, startTransition, router } = useTransitionContext();

    const normalized = (selectedSubcategory || '').toLowerCase();
    const selected = normalized === 'boys' || normalized === 'girls' ? normalized : undefined;

    const handleToggle = (value: 'boys' | 'girls') => {
        const params = new URLSearchParams(searchParams.toString());

        if (selected === value) {
            params.delete('subcategory');
        } else {
            params.set('subcategory', value);
        }

        params.delete('page');

        startTransition(() => {
            router.push(`${pathname}?${params.toString()}`);
        });
    };

    return (
        <div className="mb-4 pb-4 border-b border-gray-200">
            <h2 className="font-semibold text-lg mb-3">Kids</h2>
            <div className="flex flex-wrap gap-2">
                <Button
                    type="button"
                    variant={selected === 'boys' ? 'default' : 'outline'}
                    className="cursor-pointer"
                    size="sm"
                    disabled={isPending}
                    onClick={() => handleToggle('boys')}
                >
                    Boys
                </Button>
                <Button
                    type="button"
                    variant={selected === 'girls' ? 'default' : 'outline'}
                    className="cursor-pointer"
                    size="sm"
                    disabled={isPending}
                    onClick={() => handleToggle('girls')}
                >
                    Girls
                </Button>
            </div>
        </div>
    );
}
