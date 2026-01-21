
import { NextResponse } from 'next/server';
import { shopData, type Product, type Gender } from '@/lib/shopData';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
    try {
        const { ids } = await request.json();

        if (!Array.isArray(ids) || ids.length === 0) {
            return NextResponse.json({ products: [] });
        }

        const savedIds = ids as string[];
        let finalProducts: Product[] = [];
        const foundIds = new Set<string>();

        // 1. Try fetching from Supabase using Service Role Key (Admin access)
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (supabaseUrl && serviceRoleKey) {
            try {
                const supabase = createClient(supabaseUrl, serviceRoleKey, {
                    auth: {
                        autoRefreshToken: false,
                        persistSession: false
                    }
                });

                const { data, error } = await supabase
                    .from('products')
                    .select('*')
                    .in('id', savedIds);

                if (data) {
                    const mappedProducts = data.map((p: any) => ({
                        id: String(p.id),
                        name: p.name,
                        price: p.price,
                        description: p.description,
                        category: p.category,
                        type: p.type,
                        gender: p.gender,
                        image: p.image,
                        rating: p.rating,
                        reviews: p.reviews,
                        inStock: p.inStock,
                        brand: p.brand,
                        material: p.material,
                        createdAt: new Date(p.created_at),
                        tags: p.tags || [],
                        sizes: p.sizes || [],
                        colors: p.colors || [],
                        kidsSubcategory: p.kidsSubcategory,
                        ageGroup: p.ageGroup
                    }));
                    finalProducts = [...mappedProducts];
                    mappedProducts.forEach((p: Product) => foundIds.add(p.id));
                }
            } catch (err) {
                console.error("API: Error fetching from Supabase:", err);
            }
        }

        // 2. Fallback to mock data for missing IDs
        const missingIds = savedIds.filter(id => !foundIds.has(id));
        if (missingIds.length > 0) {
            const allMock = [...shopData.men, ...shopData.women, ...shopData.kids];
            const foundInMock = allMock.filter(p => missingIds.includes(p.id));
            finalProducts = [...finalProducts, ...foundInMock];
        }

        return NextResponse.json({ products: finalProducts });

    } catch (error) {
        console.error("API error:", error);
        return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }
}
