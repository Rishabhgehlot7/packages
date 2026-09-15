export interface StoreProduct {
  id: string;
  title: string;
  name?: string;
  slug?: string;
  description: string;
  shortDescription?: string;
  price: number;
  salePrice?: number;
  compareAtPrice: number;
  brand: string;
  category: string;
  tags: string[];
  image?: string;
  images: string[];
  media?: Array<{ type: 'image' | 'video'; url: string }>;
  inStock: boolean;
  isActive?: boolean;
  isDeleted?: boolean;
  hsnCode: string;
  taxRate: number;
  gstRate?: number;
  sku: string;
  weight?: number;
  dimensions?: { length: number; width: number; height: number };
  highlights?: string[];
  warrantyYears?: number;
  featureBanners?: Array<{ image: string; displayOrder?: number }>;
  upsellProducts?: string[];
  upsellItems?: Array<{
    product: string;
    variantSku?: string;
    discountType?: 'percentage' | 'fixed_price';
    discountValue?: number;
  }>;
  checkoutDealConfig?: {
    variantSku?: string;
    discountType?: 'percentage' | 'fixed_price';
    discountValue?: number;
  } | null;
  rating: {
    value: number;
    count: number;
  };
  variants?: Array<{
    id: string;
    title?: string;
    name?: string;
    sku: string;
    price: number;
    salePrice?: number;
    compareAtPrice?: number;
    stock: number;
    images?: string[];
    options?: Array<{ name: string; value: string }>;
    attributes?: Record<string, string>;
    weight?: number;
    dimensions?: { length: number; width: number; height: number };
  }>;
  reviews?: Array<{
    id: string;
    author: string;
    rating: number;
    body?: string;
    comment?: string;
    verifiedBuyer?: boolean;
    createdAt?: string;
  }>;
}

export const PRODUCTS: StoreProduct[] = [
  {
    id: 'prod_cyberpunk_hoodie',
    title: 'Cyberpunk Heavyweight 450 GSM Hoodie',
    description: 'Ultra-heavyweight 450 GSM French Terry pure cotton hoodie with cyberpunk backprint, double-layered hood, and ribbed cuffs. Handcrafted for maximum comfort and durability.',
    price: 2499,
    compareAtPrice: 3999,
    brand: 'Boost Aesthetic',
    category: 'Hoodies',
    tags: ['streetwear', 'hoodie', 'oversized', 'cyberpunk', 'winter'],
    images: [
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=800&q=80',
    ],
    inStock: true,
    hsnCode: '6109',
    taxRate: 18,
    sku: 'CP-HD-001',
    rating: { value: 4.9, count: 64 },
    variants: [
      { id: 'v_cp_s', title: 'Small / Black', sku: 'CP-HD-BLK-S', price: 2499, compareAtPrice: 3999, stock: 5, attributes: { Size: 'S', Color: 'Black' } },
      { id: 'v_cp_m', title: 'Medium / Black', sku: 'CP-HD-BLK-M', price: 2499, compareAtPrice: 3999, stock: 2, attributes: { Size: 'M', Color: 'Black' } },
      { id: 'v_cp_l', title: 'Large / Black', sku: 'CP-HD-BLK-L', price: 2499, compareAtPrice: 3999, stock: 1, attributes: { Size: 'L', Color: 'Black' } },
    ],
    reviews: [
      { id: 'r1', author: 'Aarav M.', rating: 5, body: 'Fabric is insanely thick and warm. Print quality is 10/10!', verifiedBuyer: true, createdAt: '2026-09-01' },
      { id: 'r2', author: 'Sneha P.', rating: 5, body: 'Loved the oversized drop shoulder cut. Perfect for winters.', verifiedBuyer: true, createdAt: '2026-09-03' },
    ],
  },
  {
    id: 'prod_acid_wash_tee',
    title: 'Vintage Acid-Wash Streetwear Tee',
    description: '240 GSM single-jersey combed cotton oversized streetwear t-shirt with vintage acid-wash mineral dye treatment.',
    price: 999,
    compareAtPrice: 1799,
    brand: 'Boost Aesthetic',
    category: 'T-Shirts',
    tags: ['tshirt', 'oversized', 'graphic', 'summer', 'casual'],
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
    ],
    inStock: true,
    hsnCode: '6109',
    taxRate: 18,
    sku: 'AC-TEE-002',
    rating: { value: 4.7, count: 48 },
    variants: [
      { id: 'v_tee_m', title: 'Medium / Charcoal', sku: 'AC-TEE-CH-M', price: 999, compareAtPrice: 1799, stock: 12, attributes: { Size: 'M', Color: 'Charcoal' } },
      { id: 'v_tee_l', title: 'Large / Charcoal', sku: 'AC-TEE-CH-L', price: 999, compareAtPrice: 1799, stock: 8, attributes: { Size: 'L', Color: 'Charcoal' } },
    ],
    reviews: [
      { id: 'r3', author: 'Rohan K.', rating: 5, body: 'Super soft feel and fits great on chest and shoulders.', verifiedBuyer: true, createdAt: '2026-08-28' },
    ],
  },
  {
    id: 'prod_retro_sneakers',
    title: 'Retro High-Top Street Sneakers',
    description: 'Handcrafted vulcanized leather streetwear sneakers with reinforced heel counter, memory-foam insole, and non-slip rubber outsoles.',
    price: 3499,
    compareAtPrice: 5499,
    brand: 'Boost Kicks',
    category: 'Footwear',
    tags: ['shoes', 'sneakers', 'retro', 'streetwear'],
    images: [
      'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80',
    ],
    inStock: true,
    hsnCode: '6403',
    taxRate: 18,
    sku: 'BK-SNK-003',
    rating: { value: 4.8, count: 32 },
    variants: [
      { id: 'v_snk_8', title: 'UK 8 / White & Green', sku: 'BK-SNK-WG-8', price: 3499, compareAtPrice: 5499, stock: 2, attributes: { Size: '8', Color: 'White/Green' } },
      { id: 'v_snk_9', title: 'UK 9 / White & Green', sku: 'BK-SNK-WG-9', price: 3499, compareAtPrice: 5499, stock: 1, attributes: { Size: '9', Color: 'White/Green' } },
    ],
    reviews: [
      { id: 'r4', author: 'Vikram S.', rating: 5, body: 'Comfortable right out of the box. Cushioning is awesome.', verifiedBuyer: true, createdAt: '2026-09-02' },
    ],
  },
  {
    id: 'prod_wireless_anc_earbuds',
    title: 'BoostPods Pro Active Noise Cancelling Earbuds',
    description: '35dB Hybrid Active Noise Cancellation, 40-hour battery life, 13mm deep bass drivers, and IPX5 water resistance for gaming and workouts.',
    price: 1999,
    compareAtPrice: 4999,
    brand: 'Boost Audio',
    category: 'Electronics',
    tags: ['audio', 'earbuds', 'wireless', 'bluetooth', 'gadgets'],
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80',
    ],
    inStock: true,
    hsnCode: '8518',
    taxRate: 18,
    sku: 'BA-EAR-004',
    rating: { value: 4.8, count: 128 },
    variants: [
      { id: 'v_ear_blk', title: 'Matte Black', sku: 'BA-EAR-BLK', price: 1999, compareAtPrice: 4999, stock: 15, attributes: { Color: 'Black' } },
      { id: 'v_ear_wht', title: 'Pearl White', sku: 'BA-EAR-WHT', price: 1999, compareAtPrice: 4999, stock: 9, attributes: { Color: 'White' } },
    ],
    reviews: [
      { id: 'r5', author: 'Sameer R.', rating: 5, body: 'Noise cancellation is surprisingly good for the price. Bass is punchy!', verifiedBuyer: true, createdAt: '2026-09-04' },
      { id: 'r6', author: 'Neha J.', rating: 4, body: 'Very lightweight case and fast charging works as advertised.', verifiedBuyer: true, createdAt: '2026-09-05' },
    ],
  },
  {
    id: 'prod_smart_watch_ultra',
    title: 'Titanium Ultra AMOLED Smartwatch (Bluetooth Calling)',
    description: '1.96-inch Always-On AMOLED Display, aerospace titanium alloy casing, 120+ sports modes, 24/7 heart & SpO2 health tracking.',
    price: 2999,
    compareAtPrice: 6999,
    brand: 'Boost Tech',
    category: 'Electronics',
    tags: ['smartwatch', 'wearable', 'fitness', 'gadgets'],
    images: [
      'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=800&q=80',
    ],
    inStock: true,
    hsnCode: '8517',
    taxRate: 18,
    sku: 'BT-SW-005',
    rating: { value: 4.9, count: 96 },
    variants: [
      { id: 'v_sw_titanium', title: 'Titanium Grey / Orange Strap', sku: 'BT-SW-ORG', price: 2999, compareAtPrice: 6999, stock: 8, attributes: { Color: 'Orange' } },
      { id: 'v_sw_midnight', title: 'Midnight Black / Black Strap', sku: 'BT-SW-BLK', price: 2999, compareAtPrice: 6999, stock: 14, attributes: { Color: 'Black' } },
    ],
    reviews: [
      { id: 'r7', author: 'Pooja T.', rating: 5, body: 'Display is super bright even under direct sunlight. Battery lasts 5 days easily.', verifiedBuyer: true, createdAt: '2026-09-06' },
    ],
  },
  {
    id: 'prod_anti_theft_backpack',
    title: 'Urban Armor Waterproof Laptop Backpack (28L)',
    description: 'TSA-approved anti-theft hidden zippers, waterproof ballistic nylon, dedicated 16-inch velvet laptop compartment, and external USB charging pass.',
    price: 1299,
    compareAtPrice: 2999,
    brand: 'Boost Gear',
    category: 'Accessories',
    tags: ['backpack', 'travel', 'accessories', 'laptop'],
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
    ],
    inStock: true,
    hsnCode: '4202',
    taxRate: 18,
    sku: 'BG-BP-006',
    rating: { value: 4.6, count: 54 },
    variants: [
      { id: 'v_bp_blk', title: 'Stealth Black', sku: 'BG-BP-BLK', price: 1299, compareAtPrice: 2999, stock: 10, attributes: { Color: 'Black' } },
    ],
    reviews: [
      { id: 'r8', author: 'Arjun D.', rating: 5, body: 'Tons of internal pockets, easily fits my MacBook Pro 16 and gym clothes.', verifiedBuyer: true, createdAt: '2026-09-07' },
    ],
  },
];

export const initialProducts = PRODUCTS;

