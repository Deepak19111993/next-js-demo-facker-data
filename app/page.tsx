import FacilityListing from "./components/home/FacilityListing";
// import { generateShopData } from '@/lib/shopData';
import { shopData } from '@/lib/shopData';

export const dynamic= 'force-dynamic';

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  // Fetch data on the server
 const parsedSearchParams = await searchParams || {};
  const category = (parsedSearchParams.category as 'men' | 'kids' | undefined) || 'men';

  return (
    <div className="py-5">
      <FacilityListing 
        initialData={shopData} 
        initialCategory={category}
        searchParams={parsedSearchParams}
      />
    </div>
  );
}