
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { shopData, Product } from '@/lib/shopData';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST() {
    if (!supabaseServiceRoleKey) {
        return NextResponse.json({ error: 'Missing SUPABASE_SERVICE_ROLE_KEY' }, { status: 500 });
    }
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    });

    try {
        const allProducts: Product[] = [
            ...shopData.men,
            ...shopData.women,
            ...shopData.kids
        ];

        // Map to Supabase table structure
        // We assume the table has columns matching these names or similar.
        // If 'jsonb' is used for some fields, we might need to stringify.
        // For now, let's assume a flat structure for main fields and maybe 'details' for others if needed.
        // But usually standard columns: id, name, price, description, category, image, etc.

        // Check if table exists/is accessible by trying to select 1
        const { error: checkError } = await supabase.from('products').select('id').limit(1);

        if (checkError) {
            return NextResponse.json({ error: 'Failed to access products table. Check if table exists.', details: checkError }, { status: 500 });
        }

        // 1. Clear existing products to prevent duplication
        const { error: deleteError } = await supabase
            .from('products')
            .delete()
            .neq('id', -1); // Deletes all rows

        if (deleteError) {
            console.error('Delete Error:', deleteError);
            return NextResponse.json({ error: 'Failed to clear old data', details: deleteError }, { status: 500 });
        }

        // 2. Insert fresh products
        const { error } = await supabase.from('products').insert(
            allProducts.map(p => ({
                name: p.name,
                price: p.price,
                description: p.description,
                category: p.category,
                type: p.type || null,
                gender: p.gender,
                image: p.image,
                rating: p.rating,
                reviews: p.reviews,
                inStock: p.inStock,
                brand: p.brand,
                material: p.material || null,
                created_at: p.createdAt,
                tags: p.tags,
                sizes: p.sizes,
                colors: p.colors,
                // Try top level camelCase
                kidsSubcategory: p.kidsSubcategory || null,
                ageGroup: p.ageGroup || null
            }))
        );

        if (error) {
            console.error('Seed Error:', error);
            return NextResponse.json({ error: 'Failed to seed data', details: error }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: `Seeded ${allProducts.length} products.` });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Internal Server Error', details: err }, { status: 500 });
    }
}
