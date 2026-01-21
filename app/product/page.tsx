import FacilityListing from "../components/home/FacilityListing";
import { generateConsistentData } from '@/lib/shopData';

export default async function FacilityPage({ searchParams }: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {

  const parsedSearchParams = await searchParams || {};
  const category = (parsedSearchParams.category as 'men' | 'women' | 'kids' | undefined) || 'men';

  const listingPromise = generateConsistentData(parsedSearchParams, category);

  const suspenseKey = JSON.stringify(parsedSearchParams);

  return (
    <div className="py-5">
      <FacilityListing
        listingPromise={listingPromise}
        suspenseKey={suspenseKey}
        categoryFilters={false}
        category={category}
      />
    </div>
  );
}