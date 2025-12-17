import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="container py-8! animate-pulse">
      <Skeleton className="h-8 w-24 bg-gray-200 rounded mb-6" />
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Image Skeleton */}
        <Skeleton className="bg-gray-200 rounded-lg aspect-square" />
        
        {/* Details Skeleton */}
        <div className="space-y-6">
          <div>
            <Skeleton className="h-8 bg-gray-200 rounded w-3/4 mb-2" />
            <Skeleton className="h-6 bg-gray-200 rounded w-1/2" />
          </div>
          
          <Skeleton className="h-8 bg-gray-200 rounded w-1/4" />
          
          <div className="space-y-4">
            <div>
              <Skeleton className="h-4 bg-gray-200 rounded w-1/4 mb-2" />
              <Skeleton className="h-16 bg-gray-200 rounded" />
            </div>
            
            <div>
              <Skeleton className="h-4 bg-gray-200 rounded w-1/4 mb-2" />
              <div className="flex gap-2">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-8 w-12 bg-gray-200 rounded" />
                ))}
              </div>
            </div>
          </div>
          
          <Skeleton className="h-12 bg-gray-200 rounded w-full" />
        </div>
      </div>
    </div>
  );
}
