import { Skeleton } from "@/components/ui/skeleton";

export function FacilitySkeletonCard() {
    return (
        <div className="flex flex-col space-y-3">
            <Skeleton className="w-full aspect-[1.4/1] rounded-lg" />
            <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-4 w-[100px]" />
            </div>
        </div>
    );
}