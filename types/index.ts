export interface FacilityCardDataType {
  id: string;
  name: string;
  price: number;
  rating: number;
  reviews: number;
  inStock: boolean;
  sizes?: string[];
  colors?: string[];
  ageGroup?: string;
  material?: string;
  brand: string;
  createdAt: Date;
};