import { Skeleton } from "@/components/ui/skeleton";

export function FacilitySkeletonCard() {
    return (
        <div className="flex flex-col space-y-3">
            <Skeleton className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80" />
            <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-4 w-[100px]" />
            </div>
        </div>
    );
}