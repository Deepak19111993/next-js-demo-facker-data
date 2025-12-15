import Image from "next/image";
import { Product } from "@/lib/shopData";

export default function FacilityCard({
    id,
    name,
    image,
    category,
    price,
    rating,
    reviews,
    inStock,
    sizes,
    colors,
    ageGroup,
    material,
    brand,
    createdAt,
    tags
}: Product) {
    return (
        <div key={id} className="border border-[#ececec] rounded-md overflow-hidden">
            <Image src={image} alt="" width={100} height={100} className="w-full h-[250px] object-cover" />
            <div className="flex flex-col p-5 space-y-3">
                <p className="text-base font-semibold">{name}</p>
                <p className="text-base">{price}</p>
                <p className="text-base">{rating}</p>
                <p className="text-base">{reviews}</p>
                <p className="text-base">{inStock ? 'In Stock' : 'Out of Stock'}</p>
                {sizes?.length ? (
                    <div className="flex flex-wrap gap-2">
                        {sizes.map((size) => (
                        <span
                            key={size}
                            className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-700"
                        >
                            {size}
                        </span>
                        ))}
                    </div>
                ) : null}
                {colors?.length ? (
                    <div className="flex flex-wrap gap-2">
                        {colors.map((color) => (
                        <span
                            key={color}
                            className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-700"
                        >
                            {color}
                        </span>
                        ))}
                    </div>
                ) : null}
                <p className="text-base">{ageGroup}</p>
                <p className="text-base">{material}</p>
                <p className="text-base">{brand}</p>
                <p className="text-base">{createdAt.toDateString()}</p>
                {tags?.length ? (
                    <div className="flex flex-wrap gap-2">
                        {tags.map((t) => (
                        <span
                            key={t}
                            className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-700"
                        >
                            {t}
                        </span>
                        ))}
                    </div>
                    ) : null}
                <p className="text-base">{category}</p>
            </div>
        </div>
    )
}