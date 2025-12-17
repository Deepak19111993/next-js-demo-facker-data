import FacilityListing from "../components/home/FacilityListing";
import { shopData } from '@/lib/shopData';

export default async function FacilityPage({searchParams}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {

    const parsedSearchParams = await searchParams || {};
    const category = (parsedSearchParams.category as 'men' | 'kids' | undefined) || 'men';
    
    return (
         <div className="py-5">
             <FacilityListing
               initialData={shopData} 
               initialCategory={category}
               searchParams={parsedSearchParams}
                categoryFilters={false} 
             />
           </div>
    );
}