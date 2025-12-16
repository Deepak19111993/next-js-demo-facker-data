// lib/shopData.ts
import { faker } from '@faker-js/faker';

// Set a fixed seed for consistent data generation
faker.seed(42);

type ProductCategory = 'clothing' | 'footwear' | 'accessories' | 'toys' | 'essentials';
type Gender = 'men' | 'kids';

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: ProductCategory;
  gender: Gender;
  image: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  sizes?: string[];
  colors?: string[];
  ageGroup?: string;
  material?: string;
  brand: string;
  createdAt: Date;
  tags: string[];
}

// ... (keep your existing categories, brands, materials, etc. constants)

// Generate consistent data
const generateConsistentData = () => {
  const menProducts = Array(50).fill(null).map((_, i) => ({
    id: `men-${i}`,
    name: `Men's ${faker.commerce.productName()}`,
    price: parseFloat(faker.commerce.price({ min: 10, max: 200, dec: 2 })),
    description: faker.commerce.productDescription(),
    category: faker.helpers.arrayElement(['clothing', 'footwear', 'accessories']),
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

  const kidsProducts = Array(100).fill(null).map((_, i) => ({
    id: `kids-${i}`,
    name: `Kids' ${faker.commerce.productName()}`,
    price: parseFloat(faker.commerce.price({ min: 5, max: 100, dec: 2 })),
    description: faker.commerce.productDescription(),
    category: faker.helpers.arrayElement(['clothing', 'footwear', 'toys', 'essentials']),
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
    createdAt: faker.date.past({ years: 1 }),
    tags: faker.helpers.arrayElements(['summer', 'winter', 'sale', 'new'], { min: 1, max: 3 })
  }));

  return {
    men: menProducts,
    kids: kidsProducts
  };
};

// Export the pre-generated data
export const shopData = generateConsistentData();

// For backward compatibility
// export function generateShopData() {
//   return shopData;
// }

export type { Gender, ProductCategory };