import { faker } from '@faker-js/faker';

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
  ageGroup?: string; // For kids category
  material?: string;
  brand: string;
  createdAt: Date;
  tags: string[];
}

const menCategories: { category: ProductCategory; items: string[] }[] = [
  {
    category: 'clothing',
    items: ['T-Shirt', 'Shirt', 'Jeans', 'Polo', 'Hoodie', 'Jacket', 'Sweater', 'Shorts', 'Joggers']
  },
  {
    category: 'footwear',
    items: ['Sneakers', 'Formal Shoes', 'Sandals', 'Boots', 'Loafers']
  },
  {
    category: 'accessories',
    items: ['Watch', 'Cap', 'Belt', 'Wallet', 'Sunglasses', 'Tie', 'Socks']
  }
];

const kidsCategories: { category: ProductCategory; items: string[] }[] = [
  {
    category: 'clothing',
    items: ['T-Shirt', 'Shirt', 'Jeans', 'Dress', 'Sweater', 'Jacket', 'Shorts', 'Skirt', 'Romper']
  },
  {
    category: 'footwear',
    items: ['Sneakers', 'Sandals', 'School Shoes', 'Boots', 'Flip Flops']
  },
  {
    category: 'accessories',
    items: ['Cap', 'Hair Accessories', 'Sunglasses', 'Socks', 'Gloves']
  },
  {
    category: 'toys',
    items: ['Action Figure', 'Doll', 'Building Blocks', 'Puzzle', 'Stuffed Animal']
  },
  {
    category: 'essentials',
    items: ['Diaper Bag', 'Feeding Bottle', 'Bib', 'Blanket', 'Pacifier']
  }
];

const brands = [
  'Nike', 'Adidas', 'Puma', 'H&M', 'Zara', 'Gap', 'Levi\'s', 'Tommy Hilfiger',
  'Ralph Lauren', 'Calvin Klein', 'The Children\'s Place', 'Carter\'s', 'Gymboree'
];

const materials = ['Cotton', 'Polyester', 'Denim', 'Wool', 'Leather', 'Silk', 'Linen', 'Nylon'];
const colors = ['Red', 'Blue', 'Green', 'Black', 'White', 'Gray', 'Yellow', 'Pink', 'Purple'];
const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const kidsSizes = ['2T', '3T', '4T', '5T', 'XS', 'S', 'M'];
const ageGroups = ['0-6 months', '6-12 months', '1-2 years', '2-4 years', '4-6 years', '6-8 years', '8-10 years'];

// Generic marketing/style tags to enrich product data
const tagPool = ['New', 'Sale', 'Trending', 'Limited', 'Eco', 'Premium', 'Hot', 'Best Seller', 'Comfort', 'Sport', 'Casual'];

function generateProducts(gender: Gender, count: number): Product[] {
  const categories = gender === 'men' ? menCategories : kidsCategories;
  const products: Product[] = [];

  for (let i = 0; i < count; i++) {
    const category = faker.helpers.arrayElement(categories);
    const item = faker.helpers.arrayElement(category.items);
    const price = faker.number.float({ min: 10, max: 200, fractionDigits: 2 });
    const isInStock = faker.datatype.boolean(0.85); // 85% chance of being in stock
    
    const product: Product = {
      id: faker.string.uuid(),
      name: `${gender === 'men' ? 'Men\'s' : 'Kids\''} ${item} ${faker.commerce.productAdjective()}`,
      price,
      description: faker.commerce.productDescription(),
      category: category.category,
      gender,
      image: faker.image.urlLoremFlickr({
        category: gender === 'men' ? 'fashion-men' : 'children-clothes',
        width: 400,
        height: 400
      }),
      rating: faker.number.float({ min: 1, max: 5, fractionDigits: 1 }),
      reviews: faker.number.int({ min: 0, max: 500 }),
      inStock: isInStock,
      brand: faker.helpers.arrayElement(brands),
      material: faker.helpers.arrayElement(materials),
      createdAt: faker.date.past({
        years: 2,
        refDate: '2023-01-01'
      }),
      tags: faker.helpers.arrayElements(tagPool, faker.number.int({ min: 1, max: 3 }))
    };

    if (category.category !== 'toys' && category.category !== 'essentials') {
      product.sizes = gender === 'men' ? 
        faker.helpers.arrayElements(sizes, faker.number.int({ min: 2, max: sizes.length })) :
        faker.helpers.arrayElements(kidsSizes, faker.number.int({ min: 2, max: kidsSizes.length }));
      
      product.colors = faker.helpers.arrayElements(
        colors, 
        faker.number.int({ min: 1, max: 4 })
      );
    }

    if (gender === 'kids') {
      product.ageGroup = faker.helpers.arrayElement(ageGroups);
    }

    products.push(product);
  }

  return products;
}

export function generateShopData() {
  return {
    men: generateProducts('men', 50), // Generate 50 men's products
    kids: generateProducts('kids', 50) // Generate 50 kids' products
  };
}

export type { ProductCategory, Gender };
