import { FacilitySkeletonCard } from './components/FacilitySkeletonCard';
import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="container py-5">
      <div className="flex items-center gap-2 mb-5 py-5 justify-between">
        <div className="flex gap-2">
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-10 w-20" />
        </div>
        <Skeleton className="h-8 w-10" />
      </div>
      <div className="text-xl font-semibold mb-4">
        <Skeleton className='h-6 w-48' />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <FacilitySkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
}