export interface Product {
  id: string;
  title: string;
  slug?: string;
  description: string;
  price: number;
  compareAtPrice: number;
  category: string;
  image: string;
  images?: string[];
  rating: number;
  reviewsCount: number;
  tags: string[];
  inStock: boolean;
  sizes?: string[];
  colors?: string[];
  hsn?: string;
}

export const DEMO_PRODUCTS: Product[] = [
  {
    id: 'prod_1',
    title: 'Cyberpunk Heavyweight 450 GSM Hoodie',
    description: '450 GSM French Terry pure cotton oversized hoodie with cyberpunk reflective backprint. Dropped shoulders, double-layered hood.',
    price: 2499,
    compareAtPrice: 3999,
    category: 'Hoodies',
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewsCount: 84,
    tags: ['oversized', 'streetwear', 'heavyweight'],
    inStock: true,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
  },
  {
    id: 'prod_2',
    title: 'Acid Wash Vintage Boxy Tee',
    description: '240 GSM pre-shrunk vintage wash drop-shoulder t-shirt. Ultra-soft breathable feel with raw seam collar detailing.',
    price: 1199,
    compareAtPrice: 1799,
    category: 'T-Shirts',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviewsCount: 52,
    tags: ['boxy', 'acidwash', 'essential'],
    inStock: true,
    sizes: ['S', 'M', 'L', 'XL'],
  },
  {
    id: 'prod_3',
    title: 'Tactical Multi-Pocket Cargo Pants',
    description: 'Water-repellent technical cargo with 6 functional pockets, adjustable toggle ankles, and reinforced knee stitching.',
    price: 2899,
    compareAtPrice: 4299,
    category: 'Bottoms',
    image: 'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    reviewsCount: 46,
    tags: ['cargo', 'tactical', 'streetwear'],
    inStock: true,
    sizes: ['30', '32', '34', '36'],
  },
  {
    id: 'prod_4',
    title: 'Smoked Amber & Vanilla Solid Perfume',
    description: 'Alcohol-free organic solid cologne. 12-hour projection with warm woody amber, Madagascar vanilla, and cedarwood notes.',
    price: 1499,
    compareAtPrice: 2199,
    category: 'Fragrances',
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80',
    rating: 5.0,
    reviewsCount: 97,
    tags: ['fragrance', 'unisex', 'luxury'],
    inStock: true,
  },
  {
    id: 'prod_5',
    title: 'Matte Black Minimalist Sling Bag',
    description: 'Cordura weather-resistant crossbody sling with Fidlock magnetic buckle, waterproof YKK zippers, and modular compartments.',
    price: 1899,
    compareAtPrice: 2799,
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviewsCount: 39,
    tags: ['bag', 'travel', 'minimalist'],
    inStock: true,
  },
  {
    id: 'prod_6',
    title: 'Retro Washed Denim Overshirt',
    description: 'Vintage distressed denim button-down jacket with dual chest flap pockets, custom matte nickel hardware, and boxy cut.',
    price: 3299,
    compareAtPrice: 4999,
    category: 'Jackets',
    image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewsCount: 61,
    tags: ['denim', 'vintage', 'outerwear'],
    inStock: true,
    sizes: ['M', 'L', 'XL'],
  },
];
