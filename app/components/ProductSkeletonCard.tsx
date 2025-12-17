import { Skeleton } from "@/components/ui/skeleton";

export function ProductSkeletonCard() {
  return (
    <div className="group relative">
      {/* Image Skeleton */}
      <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none lg:h-80">
        <Skeleton className="h-full w-full" />
      </div>
      
      {/* Content Skeleton */}
      <div className="mt-4 flex justify-between">
        <div className="w-full">
          {/* Product Name Skeleton */}
          <div className="relative">
            <Skeleton className="h-5 w-3/4 mb-1" />
            <span className="absolute inset-0" aria-hidden="true" />
          </div>
          
          {/* Category Skeleton */}
          <Skeleton className="h-4 w-1/2 mt-1" />
        </div>
        
        {/* Price Skeleton */}
        <Skeleton className="h-5 w-16" />
      </div>
    </div>
  );
}
