export interface MobileProduct {
  id: string;
  title: string;
  slug: string;
  price: number;
  compareAtPrice: number;
  category: string;
  image: string;
  description: string;
  rating: number;
  reviewsCount: number;
  inStock: boolean;
  hsn: string;
  gstRate: number;
  sizes: string[];
}

export const DEMO_PRODUCTS: MobileProduct[] = [
  {
    id: 'prod_1',
    title: 'Cyberpunk 450 GSM Oversized Hoodie',
    slug: 'cyberpunk-heavyweight-450-gsm-hoodie',
    price: 2499,
    compareAtPrice: 3999,
    category: 'Hoodies',
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80',
    description: '450 GSM heavy French Terry cotton, oversized tailored fit, double-layer hood.',
    rating: 4.9,
    reviewsCount: 64,
    inStock: true,
    hsn: '6109',
    gstRate: 18,
    sizes: ['S', 'M', 'L', 'XL'],
  },
  {
    id: 'prod_2',
    title: 'Acid Wash Vintage Boxy Tee',
    slug: 'acid-wash-vintage-boxy-tee',
    price: 1199,
    compareAtPrice: 1799,
    category: 'T-Shirts',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80',
    description: '240 GSM single-jersey cotton with enzyme wash for authentic vintage streetwear draping.',
    rating: 4.8,
    reviewsCount: 42,
    inStock: true,
    hsn: '6109',
    gstRate: 18,
    sizes: ['M', 'L', 'XL'],
  },
  {
    id: 'prod_3',
    title: 'Tactical Multi-Pocket Cargo Pants',
    slug: 'tactical-multi-pocket-cargo-pants',
    price: 2999,
    compareAtPrice: 4499,
    category: 'Bottoms',
    image: 'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=600&q=80',
    description: 'Water-repellent ripstop fabric with 6 utility pockets and custom YKK hardware.',
    rating: 4.7,
    reviewsCount: 38,
    inStock: true,
    hsn: '6203',
    gstRate: 18,
    sizes: ['30', '32', '34'],
  },
  {
    id: 'prod_4',
    title: 'Matte Black Solid Perfume (50ml)',
    slug: 'artisanal-matte-black-solid-fragrance-50ml',
    price: 1899,
    compareAtPrice: 2499,
    category: 'Fragrances',
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=600&q=80',
    description: 'Beeswax and jojoba base infused with smoked cedarwood and amber resin. 12h projection.',
    rating: 5.0,
    reviewsCount: 89,
    inStock: true,
    hsn: '3303',
    gstRate: 18,
    sizes: ['50ml'],
  },
];
