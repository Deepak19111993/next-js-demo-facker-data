// lib/shopData.ts
import { faker } from '@faker-js/faker';

// Set a fixed seed for consistent data generation
faker.seed(42);

type ProductCategory = 'clothing' | 'footwear' | 'accessories' | 'toys' | 'essentials';
type Gender = 'men' | 'women' | 'kids';

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: ProductCategory;
  type?: string;
  gender: Gender;
  image: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  sizes?: string[];
  colors?: string[];
  ageGroup?: string;
  material?: string;
  kidsSubcategory?: 'boys' | 'girls';
  brand: string;
  createdAt: Date;
  tags: string[];
}

// ... (keep your existing categories, brands, materials, etc. constants)

// Generate consistent data
const generateBaseData = () => {
  const typesByCategory: Record<'men' | 'women' | 'kids', Partial<Record<ProductCategory, string[]>>> = {
    men: {
      clothing: ['t-shirts', 'shirts', 'jeans', 'jackets'],
      footwear: ['sneakers', 'casual shoes', 'formal shoes'],
      accessories: ['watches', 'bags', 'wallets']
    },
    women: {
      clothing: ['dresses', 'tops', 'jeans', 'jackets'],
      footwear: ['heels', 'flats', 'boots'],
      accessories: ['jewelry', 'bags', 'scarves']
    },
    kids: {
      clothing: ['t-shirts', 'jackets', 'jeans'],
      footwear: ['sneakers', 'sandals'],
      accessories: ['bags', 'watches'],
      toys: ['educational', 'outdoor', 'board games'],
      essentials: ['newborn', '0-24 months', '2-4 years']
    }
  };

  const menProducts: Product[] = Array(50).fill(null).map((_, i) => ({
    id: `men-${i}`,
    name: `Men's ${faker.commerce.productName()}`,
    price: parseFloat(faker.commerce.price({ min: 10, max: 200, dec: 2 })),
    description: faker.commerce.productDescription(),
    category: faker.helpers.arrayElement(['clothing', 'footwear', 'accessories']) as ProductCategory,
    type: undefined,
    gender: 'men' as const,
    image: `https://picsum.photos/seed/men-${i}/400/400`,
    rating: faker.number.float({ min: 1, max: 5, fractionDigits: 1 }),
    reviews: faker.number.int({ min: 0, max: 500 }),
    inStock: faker.datatype.boolean(0.85),
    sizes: faker.helpers.arrayElements(['S', 'M', 'L', 'XL'], { min: 2, max: 4 }),
    colors: faker.helpers.arrayElements(['red', 'blue', 'black', 'white', 'green'], { min: 1, max: 3 }),
    brand: faker.company.name(),
    material: faker.helpers.arrayElement(['cotton', 'polyester', 'wool', 'denim', 'leather']),
    createdAt: faker.date.past({ years: 2 }),
    tags: faker.helpers.arrayElements(['summer', 'winter', 'sale', 'new', 'limited'], { min: 1, max: 3 })
  }));

  menProducts.forEach(product => {
    const options = typesByCategory.men[product.category] || [];
    if (options.length > 0) {
      product.type = faker.helpers.arrayElement(options);
    }
  });

  const womenProducts: Product[] = Array(50).fill(null).map((_, i) => ({
    id: `women-${i}`,
    name: `Women's ${faker.commerce.productName()}`,
    price: parseFloat(faker.commerce.price({ min: 10, max: 200, dec: 2 })),
    description: faker.commerce.productDescription(),
    category: faker.helpers.arrayElement(['clothing', 'footwear', 'accessories']) as ProductCategory,
    type: undefined,
    gender: 'women' as const,
    image: `https://picsum.photos/seed/women-${i}/400/400`,
    rating: faker.number.float({ min: 1, max: 5, fractionDigits: 1 }),
    reviews: faker.number.int({ min: 0, max: 500 }),
    inStock: faker.datatype.boolean(0.85),
    sizes: faker.helpers.arrayElements(['XS', 'S', 'M', 'L'], { min: 2, max: 4 }),
    colors: faker.helpers.arrayElements(['red', 'blue', 'black', 'white', 'green'], { min: 1, max: 3 }),
    brand: faker.company.name(),
    material: faker.helpers.arrayElement(['cotton', 'polyester', 'wool', 'denim', 'leather']),
    createdAt: faker.date.past({ years: 2 }),
    tags: faker.helpers.arrayElements(['summer', 'winter', 'sale', 'new', 'limited'], { min: 1, max: 3 })
  }));

  womenProducts.forEach(product => {
    const options = typesByCategory.women[product.category] || [];
    if (options.length > 0) {
      product.type = faker.helpers.arrayElement(options);
    }
  });

  const kidsProducts: Product[] = Array(100).fill(null).map((_, i) => ({
    id: `kids-${i}`,
    name: `Kids' ${faker.commerce.productName()}`,
    price: parseFloat(faker.commerce.price({ min: 5, max: 100, dec: 2 })),
    description: faker.commerce.productDescription(),
    category: faker.helpers.arrayElement(['clothing', 'footwear', 'accessories', 'toys', 'essentials']) as ProductCategory,
    type: undefined,
    gender: 'kids' as const,
    image: `https://picsum.photos/seed/kids-${i}/400/400`,
    rating: faker.number.float({ min: 1, max: 5, fractionDigits: 1 }),
    reviews: faker.number.int({ min: 0, max: 200 }),
    inStock: faker.datatype.boolean(0.9),
    sizes: faker.helpers.arrayElements(['XS', 'S', 'M'], { min: 2, max: 3 }),
    colors: faker.helpers.arrayElements(['red', 'blue', 'yellow', 'pink', 'green'], { min: 1, max: 3 }),
    brand: faker.company.name(),
    material: faker.helpers.arrayElement(['cotton', 'polyester', 'fleece']),
    ageGroup: faker.helpers.arrayElement(['0-3 years', '4-6 years', '7-10 years']),
    kidsSubcategory: faker.helpers.arrayElement(['boys', 'girls']),
    createdAt: faker.date.past({ years: 1 }),
    tags: faker.helpers.arrayElements(['summer', 'winter', 'sale', 'new'], { min: 1, max: 3 })
  }));

  kidsProducts.forEach(product => {
    const options = typesByCategory.kids[product.category] || [];
    if (options.length > 0) {
      product.type = faker.helpers.arrayElement(options);
    }
  });

  const data: Record<Gender, Product[]> = {
    men: menProducts,
    women: womenProducts,
    kids: kidsProducts
  };

  return data;
};

export const generateConsistentData = async (
  searchParams: { [key: string]: string | string[] | undefined } = {},
  initialCategory: Gender = 'men'
) => {
  // await new Promise(resolve => setTimeout(resolve, 2000)); // Remove fake delay for better UX if using real DB

  const categoryParam = searchParams?.category || initialCategory;
  const selectedCategory = (Array.isArray(categoryParam) ? categoryParam[0] : categoryParam) as Gender;
  const searchQuery = searchParams?.q ? String(searchParams.q).toLowerCase() : '';
  const subcategoryParam = typeof searchParams?.subcategory === 'string' ? searchParams.subcategory : undefined;

  const selectedSizes = typeof searchParams?.sizes === 'string'
    ? searchParams.sizes.split(',').filter(Boolean)
    : [];

  const selectedCategories = (() => {
    const categoriesParam = searchParams?.categories;
    const fromCategories = (typeof categoriesParam === 'string'
      ? categoriesParam.split(',').filter(Boolean)
      : []) as ProductCategory[];

    const fromSubcategory = (() => {
      if (selectedCategory === 'kids') return [];
      if (!subcategoryParam) return [];
      const normalized = subcategoryParam.toLowerCase() as ProductCategory;
      const allowed: ProductCategory[] = ['clothing', 'footwear', 'accessories', 'toys', 'essentials'];
      return allowed.includes(normalized) ? [normalized] : [];
    })();

    return (fromCategories.length > 0 ? fromCategories : fromSubcategory) as ProductCategory[];
  })();

  const selectedMaterials = typeof searchParams?.materials === 'string'
    ? searchParams.materials.split(',').filter(Boolean)
    : [];

  const selectedTypes = typeof searchParams?.types === 'string'
    ? searchParams.types.split(',').filter(Boolean)
    : [];

  // Try fetching from Supabase with Server-Side Filtering
  let filteredProducts: Product[] = [];
  let fetchMethod: 'supabase' | 'mock' = 'mock';

  let supabaseClient: any;
  try {
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (serviceRoleKey) {
      const { createClient } = await import('@supabase/supabase-js');
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
      supabaseClient = createClient(supabaseUrl, serviceRoleKey, {
        auth: { autoRefreshToken: false, persistSession: false }
      });
    } else {
      const { supabase } = await import('./supabaseClient');
      supabaseClient = supabase;
    }

    // Build Dynamic Query
    let query = supabaseClient.from('products').select('*').eq('gender', selectedCategory);

    // Filter by Category
    if (selectedCategories.length > 0) {
      query = query.in('category', selectedCategories);
    }

    // Filter by Search Query
    if (searchQuery) {
      query = query.or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,category.ilike.%${searchQuery}%`);
    }

    // Filter by Materials
    if (selectedMaterials.length > 0) {
      query = query.in('material', selectedMaterials);
    }

    // Filter by Types
    if (selectedTypes.length > 0) {
      query = query.in('type', selectedTypes);
    }

    // Kids Subcategory (Boys/Girls)
    if (selectedCategory === 'kids' && subcategoryParam) {
      const normalized = subcategoryParam.toLowerCase();
      if (normalized === 'boys' || normalized === 'girls') {
        query = query.eq('kidsSubcategory', normalized);
      }
    }

    const { data: products, error } = await query;

    if (products && products.length > 0 && !error) {
      filteredProducts = products.map((p: any) => ({
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

      // Post-fetch filtering for complex logic that might be tricky in standard Supabase Select (like nested JSON array overlap)
      if (selectedSizes.length > 0) {
        filteredProducts = filteredProducts.filter(p =>
          p.sizes?.some(size => selectedSizes.includes(size))
        );
      }

      fetchMethod = 'supabase';
      console.log(`Backend Filtered: Fetched ${filteredProducts.length} items from Supabase.`);
    }
  } catch (err) {
    console.warn('Supabase backend filtering failed, falling back to mock data', err);
  }

  // Fallback to Mock Data and Client-Side Filtering ONLY if the database is completely empty or the fetch failed
  let isDatabaseEmpty = false;
  if (fetchMethod === 'mock') {
    isDatabaseEmpty = true;
  } else if (fetchMethod === 'supabase' && filteredProducts.length === 0) {
    // We found nothing with filters, but is the WHOLE table empty?
    try {
      const { count } = await supabaseClient
        .from('products')
        .select('*', { count: 'exact', head: true });
      if (count === 0) isDatabaseEmpty = true;
    } catch {
      isDatabaseEmpty = true;
    }
  }

  if (isDatabaseEmpty) {
    const base = generateBaseData();
    let result = [...base[selectedCategory]];

    if (searchQuery) {
      result = result.filter(product =>
        product.name.toLowerCase().includes(searchQuery) ||
        product.description.toLowerCase().includes(searchQuery) ||
        product.category.toLowerCase().includes(searchQuery)
      );
    }

    if (selectedSizes.length > 0) {
      result = result.filter(product =>
        product.sizes?.some(size => selectedSizes.includes(size))
      );
    }

    if (selectedCategories.length > 0) {
      result = result.filter(product => selectedCategories.includes(product.category));
    }

    if (selectedMaterials.length > 0) {
      result = result.filter(product => product.material && selectedMaterials.includes(product.material));
    }

    if (selectedTypes.length > 0) {
      result = result.filter(product => product.type && selectedTypes.includes(product.type));
    }

    if (selectedCategory === 'kids' && subcategoryParam) {
      const normalized = subcategoryParam.toLowerCase();
      if (normalized === 'boys' || normalized === 'girls') {
        result = result.filter(product => product.kidsSubcategory === normalized);
      }
    }

    filteredProducts = result;
    console.log(`Frontend Filtered: ${filteredProducts.length} items from Mock Data.`);
  }

  return {
    selectedCategory,
    selectedSubcategory: subcategoryParam,
    searchQuery,
    selectedSizes,
    selectedCategories,
    selectedMaterials,
    selectedTypes,
    filteredProducts
  };
};

// Export the pre-generated data
export const shopData = generateBaseData();

// For backward compatibility
// export function generateShopData() {
//   return shopData;
// }

export type { Gender, ProductCategory };