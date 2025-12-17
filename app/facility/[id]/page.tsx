import { notFound } from 'next/navigation';
import { shopData } from '@/lib/shopData';
import Image from 'next/image';
import { Star, ArrowLeft, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Suspense } from 'react';
import { ProductCard } from '@/app/components/ProductCard';

interface FacilityPageProps {
  params: {
    id: string;
  };
}

async function getFacilityData(id: string | undefined) {
  if (!id) return undefined;
  
  const allProducts = [...shopData.men, ...shopData.kids];
  const idStr = String(id); // Ensure id is a string
  
  // First try exact match
  let product = allProducts.find(p => p.id === idStr);

  
  // If no exact match, try matching with 'men-' or 'kids-' prefix
  if (!product && !idStr.startsWith('men-') && !idStr.startsWith('kids-')) {
    product = allProducts.find(p => p.id === `men-${idStr}` || p.id === `kids-${idStr}`);
  }
  
  return product;
}

// function ProductCard({ product }: { product: any }) {
//   return (
//     <div className="group relative">
//       <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
//         <Image
//           src={product.image}
//           alt={product.name}
//           width={300}
//           height={400}
//           className="h-full w-full object-cover object-center lg:h-full lg:w-full"
//         />
//       </div>
//       <div className="mt-4 flex justify-between">
//         <div>
//           <h3 className="text-sm text-gray-700">
//             <Link href={`/facility/${product.id}`}>
//               <span aria-hidden="true" className="absolute inset-0" />
//               {product.name}
//             </Link>
//           </h3>
//           <p className="mt-1 text-sm text-gray-500">{product.category}</p>
//         </div>
//         <p className="text-sm font-medium text-gray-900">${product.price.toFixed(2)}</p>
//       </div>
//     </div>
//   );
// }

export default async function FacilityPage({ params }: FacilityPageProps) {
  const getParams = await params;
  const id = getParams.id.toLowerCase();
  
  // Check if the ID is a category (men, women, kids)
  // const isCategory = ['men', 'women', 'kids'].includes(id);
  
  // if (isCategory) {
  //   // Show category products
  //   const categoryProducts = shopData[id as keyof typeof shopData] || [];
    
  //   return (
  //     <div className="container mx-auto px-4 py-8">
  //       {/* <div className="mb-6 pt-5">
  //         <Button asChild variant="ghost" className="gap-2 cursor-pointer px-0! hover:bg-transparent!">
  //           <Link href="/">
  //             <ArrowLeft size={16} />
  //             Back
  //           </Link>
  //         </Button>
  //       </div> */}
  //         {/* <h1 className="text-3xl font-bold mt-4 capitalize">{id}</h1> */}

  //       {categoryProducts.length > 0 ? (
  //         <div className="grid py-12 grid-cols-1 gap-x-4 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-4">
  //           {categoryProducts.map((product) => (
  //             <ProductCard key={product.id} product={product} />
  //           ))}
  //         </div>
  //       ) : (
  //         <div className="text-center py-12">
  //           <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
  //           <h3 className="mt-2 text-sm font-medium text-gray-900">No products found</h3>
  //           <p className="mt-1 text-sm text-gray-500">There are no products in this category yet.</p>
  //         </div>
  //       )}
  //     </div>
  //   );
  // }

  // Existing product detail view
  const facility = await getFacilityData(id);

  if (!facility) {
    notFound();
  }

  return (
    <div className="container">
      <div className="mb-5 pt-5">
        <Button asChild variant="ghost" className="gap-2 cursor-pointer px-0! hover:bg-transparent!">
          <Link href="/">
            <ArrowLeft size={16} />
            Back
          </Link>
        </Button>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8 pb-5">
        <div className="overflow-hidden">
          <Image
            src={facility.image}
            alt={facility.name}
            width={800}
            height={600}
            className="w-full h-auto object-cover aspect-square rounded-lg"
            priority
          />
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{facility.name}</h1>
            <div className="flex items-center mt-2 text-lg">
              <div className="flex items-center text-yellow-500 mr-4">
                <Star className="fill-current mr-1" size={20} />
                <span className="text-gray-800">{facility.rating}</span>
                <span className="text-gray-400 ml-1 text-sm font-medium">({facility.reviews} reviews)</span>
              </div>
              <div className={`text-sm px-3 py-1 rounded-full ${facility.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {facility.inStock ? 'In Stock' : 'Out of Stock'}
              </div>
            </div>
          </div>

          <div className="text-2xl font-bold">${facility.price.toFixed(2)}</div>

          <div className="space-y-6">
            <div>
              <h3 className="font-medium text-gray-900">Description</h3>
              <p className="text-gray-600">{facility.description}</p>
            </div>

            {facility.sizes?.length > 0 && (
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Available Sizes</h3>
                <div className="flex flex-wrap gap-2">
                  {facility.sizes.map((size) => (
                    <span key={size} className="px-3 py-1 border rounded-md text-sm">
                      {size}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {facility.colors?.length > 0 && (
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Colors</h3>
                <div className="flex flex-wrap gap-2">
                  {facility.colors.map((color) => (
                    <span 
                      key={color}
                      className="w-8 h-8 rounded-full border"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            )}

            {facility.category && (
              <div>
                <h3 className="font-medium text-gray-900">Category</h3>
                <p className="text-gray-600 capitalize">{facility.category}</p>
              </div>
            )}

            {facility.brand && (
              <div>
                <h3 className="font-medium text-gray-900">Brand</h3>
                <p className="text-gray-600">{facility.brand}</p>
              </div>
            )}

            {facility.material && (
              <div>
                <h3 className="font-medium text-gray-900">Material</h3>
                <p className="text-gray-600">{facility.material}</p>
              </div>
            )}

            {facility.tags?.length > 0 && (
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {facility.tags.map((tag) => (
                    <span key={tag} className="px-2 py-1 bg-gray-100 text-sm rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="pt-4">
            <Button size="lg" className="w-full cursor-pointer" disabled={!facility.inStock}>
              {facility.inStock ? 'Add to Cart' : 'Out of Stock'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Generate static params for better performance
export async function generateStaticParams() {
  // In a real app, you might fetch this from an API
  const allProducts = [...shopData.men, ...shopData.kids];
  
  return allProducts.map((product) => ({
    id: product.id,
  }));
}
