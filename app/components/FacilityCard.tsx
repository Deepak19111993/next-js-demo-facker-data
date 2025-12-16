"use client";

import Image from "next/image";
import { Product } from "@/lib/shopData";
import { Star } from "lucide-react";
import Link from "next/link";

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
        <div className="border border-[#ececec] rounded-md overflow-hidden hover:shadow-md transition-shadow">
            <Link href={`/facility/${id}`} className="block">
                <div className="relative aspect-[1.4/1] w-full">
                    <Image
                        src={image}
                        alt={name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                    <div className="absolute bottom-2 right-2 text-sm font-semibold w-fit bg-black text-white px-2 py-1 rounded capitalize">{category}</div>
                    <div className={`absolute top-2 left-2 text-sm w-fit flex items-center justify-center px-4 py-1 rounded-md capitalize ${inStock ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                        {inStock ? 'In Stock' : 'Out of Stock'}
                    </div>
                </div>
                <div className="flex flex-col pt-5 pb-0 px-4 space-y-3 relative">
                    {tags && tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                            {tags.map((tag) => (
                                <span key={tag} className="text-xs font-medium bg-gray-100 px-2 py-0.5 rounded">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}
                    <h3 className="text-base font-semibold w-full pr-14 break-word">{name}</h3>
                    <div className="text-base w-fit"><strong>$ {price}</strong></div>
                    <div className="absolute top-5 right-5 text-base w-fit flex items-center">
                        <Star className="inline mr-2" color="orange" fill="orange" size={16} />
                        {rating}
                    </div>
                    
                </div>
            </Link>

            {/* Additional details that aren't part of the link */}
            <div className="px-4 pb-4 pt-0 space-y-4">
                {sizes && sizes.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {sizes.map((size) => (
                            <span
                                key={size}
                                className="rounded-full bg-gray-100 px-2.5 py-0.5 text-sm text-gray-700"
                            >
                                {size}
                            </span>
                        ))}
                    </div>
                )}

                {colors && colors.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2">
                        {colors.map((color) => (
                            <span
                                key={color}
                                className="w-4 h-4 rounded-full border border-gray-200"
                                style={{ backgroundColor: color }}
                                title={color}
                            />
                        ))}
                    </div>
                )}

                {(ageGroup || material || brand) && (
                    <div className="text-sm text-gray-500 space-y-1">
                        {ageGroup && <div>{ageGroup}</div>}
                        {material && <div>{material}</div>}
                        {brand && <div>{brand}</div>}
                    </div>
                )}
                
            </div>
        </div>
    )
}