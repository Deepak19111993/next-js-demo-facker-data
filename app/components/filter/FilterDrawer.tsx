'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ListFilterPlus } from "lucide-react";
import { CategoryFilter } from "./CategoryFilter";
import { SizeFilter } from "./SizeFilter";
import { MaterialFilter } from "./MaterialFilter";
import { TypeFilter } from "./TypeFilter";
import { KidsSubcategoryFilter } from "./KidsSubcategoryFilter";
import { ClearFiltersButton } from "./ClearFilterButton";
import { type Gender, type ProductCategory } from "@/lib/shopData";

export function FilterDrawer({
    selectedGender,
    selectedSubcategory,
    selectedSizes,
    selectedCategories,
    selectedMaterials,
    selectedTypes,
    filteredCount,
}: {
    selectedGender: Gender;
    selectedSubcategory?: string;
    selectedSizes: string[];
    selectedCategories: ProductCategory[];
    selectedMaterials: string[];
    selectedTypes: string[];
    filteredCount: number;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isOpen, setIsOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    // Set mounted state to prevent hydration mismatch
    useEffect(() => {
        setIsMounted(true);
        return () => setIsMounted(false);
    }, []);

    const kidsSubcategorySelected =
        selectedGender === 'kids' &&
        (selectedSubcategory?.toLowerCase() === 'boys' || selectedSubcategory?.toLowerCase() === 'girls');

    const activeCount =
        selectedSizes.length +
        selectedCategories.length +
        selectedMaterials.length +
        selectedTypes.length +
        (kidsSubcategorySelected ? 1 : 0);

    const handleOpenChange = (open: boolean) => {
        // Only update state if the component is mounted to prevent hydration issues
        if (isMounted) {
            setIsOpen(open);
        }
    };

    const handleCancel = () => {
        setIsOpen(false);
    };

    const handleShowItems = () => {
        setIsOpen(false);
    };

    return (
        <Sheet open={isOpen} onOpenChange={handleOpenChange}>
            <SheetTrigger asChild>
                <button className="flex items-center gap-1 cursor-pointer">
                    <ListFilterPlus />
                    {activeCount > 0 && (
                        <span className="ml-1 text-xs bg-primary text-primary-foreground rounded-full h-4 w-4 flex items-center justify-center">
                            {activeCount}
                        </span>
                    )}
                </button>
            </SheetTrigger>
            <SheetContent className="overflow-y-auto">
                <SheetHeader className="border-b border-gray-200 sticky top-0 bg-background z-10">
                    <SheetTitle>Filter</SheetTitle>
                </SheetHeader>
                <div className="px-4 py-2">
                    {selectedGender === 'kids' && (
                        <KidsSubcategoryFilter selectedSubcategory={selectedSubcategory} />
                    )}
                    <CategoryFilter selectedGender={selectedGender} selectedCategories={selectedCategories} />
                    <SizeFilter
                        selectedSizes={selectedSizes}
                        selectedGender={selectedGender}
                        selectedCategories={selectedCategories}
                    />
                    <MaterialFilter
                        selectedMaterials={selectedMaterials}
                        selectedGender={selectedGender}
                        selectedCategories={selectedCategories}
                    />
                    <TypeFilter
                        selectedTypes={selectedTypes}
                        selectedGender={selectedGender}
                        selectedCategories={selectedCategories}
                    />
                </div>
                <SheetFooter className="flex flex-row justify-between flex-wrap border-t border-gray-200 sticky bottom-0 bg-background z-10 py-4">
                    <ClearFiltersButton
                        selectedSizes={selectedSizes}
                        selectedCategories={selectedCategories}
                        selectedMaterials={selectedMaterials}
                        className={`flex-1 pointer-events-auto! ${activeCount === 0 ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                        buttonText={'Clear All'}
                    />

                    <Button
                        type="button"
                        variant="outline"
                        className="flex-1 cursor-pointer"
                        onClick={handleCancel}
                    >
                        Cancel
                    </Button>

                    <Button type="button" className="flex-1 cursor-pointer" onClick={handleShowItems}>
                        Show {filteredCount} items
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
