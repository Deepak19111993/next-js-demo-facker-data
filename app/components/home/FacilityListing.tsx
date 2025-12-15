import { facilityCardData } from "@/constants/shopConstant";
import FacilityCard from "../FacilityCard";
import { generateShopData, Product } from '@/lib/shopData';

export default function FacilityListing() {

    // Generate shop data
const shopData = generateShopData();

// Access men's products
console.log(shopData.men);

// Access kids' products
console.log(shopData.kids);

    return (
        <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {shopData?.men?.map((facilityCard: Product) => (
                    <FacilityCard key={facilityCard.id} {...facilityCard} />
                ))}
            </div>
        </div>
    )
}