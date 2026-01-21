
import FacilityListing from "../components/home/FacilityListing";
import { generateConsistentData } from '@/lib/shopData';

export const dynamic = 'force-dynamic';

export default async function ShopPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    // Fetch data on the server
    const parsedSearchParams = await searchParams || {};

    const category = (parsedSearchParams.category as 'men' | 'women' | 'kids' | undefined) || 'men';

    const listingPromise = generateConsistentData(parsedSearchParams, category);

    const suspenseKey = JSON.stringify(parsedSearchParams);

    return (
        <div className="py-5">
            <FacilityListing
                listingPromise={listingPromise}
                categoryFilters={true}
                suspenseKey={suspenseKey}
                category={category}
            />
        </div>
    );
}
