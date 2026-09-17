import { Router, Request, Response } from 'express';

export const productsRouter = Router();

export interface ProductItem {
  id: string;
  title: string;
  slug: string;
  price: number;
  compareAtPrice: number;
  category: string;
  image: string;
  images: string[];
  description: string;
  rating: number;
  reviewsCount: number;
  inStock: boolean;
  hsn: string;
  gstRate: number;
  sizes: string[];
  colors: string[];
}

export const DEMO_CATALOG: ProductItem[] = [
  {
    id: 'prod_1',
    title: 'Cyberpunk Heavyweight 450 GSM Hoodie',
    slug: 'cyberpunk-heavyweight-450-gsm-hoodie',
    price: 2499,
    compareAtPrice: 3999,
    category: 'Hoodies',
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'Crafted with 450 GSM pure French Terry cotton, oversized silhouette, ribbed cuffs, and brushed fleece interior.',
    rating: 4.9,
    reviewsCount: 64,
    inStock: true,
    hsn: '6109',
    gstRate: 18,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Onyx Black', 'Stone Grey', 'Vintage Cream'],
  },
  {
    id: 'prod_2',
    title: 'Acid Wash Vintage Boxy Tee',
    slug: 'acid-wash-vintage-boxy-tee',
    price: 1199,
    compareAtPrice: 1799,
    category: 'T-Shirts',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
    ],
    description: '240 GSM heavy combed single-jersey cotton with enzyme wash for authentic vintage streetwear draping.',
    rating: 4.8,
    reviewsCount: 42,
    inStock: true,
    hsn: '6109',
    gstRate: 18,
    sizes: ['M', 'L', 'XL'],
    colors: ['Washed Charcoal', 'Olive Green'],
  },
  {
    id: 'prod_3',
    title: 'Tactical Multi-Pocket Cargo Pants',
    slug: 'tactical-multi-pocket-cargo-pants',
    price: 2999,
    compareAtPrice: 4499,
    category: 'Bottoms',
    image: 'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'Water-repellent ripstop fabric with 6 utility pockets, custom YKK hardware, and adjustable ankle toggles.',
    rating: 4.7,
    reviewsCount: 38,
    inStock: true,
    hsn: '6203',
    gstRate: 18,
    sizes: ['30', '32', '34', '36'],
    colors: ['Matte Black', 'Desert Tan'],
  },
  {
    id: 'prod_4',
    title: 'Artisanal Matte Black Solid Fragrance (50ml)',
    slug: 'artisanal-matte-black-solid-fragrance-50ml',
    price: 1899,
    compareAtPrice: 2499,
    category: 'Fragrances',
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'Beeswax and jojoba base infused with smoked cedarwood, amber resin, and bergamot top notes. Long-lasting 12h projection.',
    rating: 5.0,
    reviewsCount: 89,
    inStock: true,
    hsn: '3303',
    gstRate: 18,
    sizes: ['50ml'],
    colors: ['Matte Black Jar'],
  },
];

// GET /api/products (with category & search filtering)
productsRouter.get('/', (req: Request, res: Response) => {
  const { category, search } = req.query;
  let items = [...DEMO_CATALOG];

  if (category && category !== 'All') {
    items = items.filter((p) => p.category.toLowerCase() === String(category).toLowerCase());
  }

  if (search) {
    const q = String(search).toLowerCase();
    items = items.filter((p) => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
  }

  res.json({
    success: true,
    count: items.length,
    products: items,
  });
});

// GET /api/products/:idOrSlug
productsRouter.get('/:idOrSlug', (req: Request, res: Response) => {
  const { idOrSlug } = req.params;
  const product = DEMO_CATALOG.find((p) => p.id === idOrSlug || p.slug === idOrSlug);

  if (!product) {
    return res.status(404).json({ success: false, error: 'Product not found' });
  }

  return res.json({ success: true, product });
});

// POST /api/products - Create new product (Admin)
productsRouter.post('/', (req: Request, res: Response) => {
  const { title, price, compareAtPrice, category, image, description, sizes, inStock } = req.body;

  if (!title || !price || !category) {
    return res.status(400).json({ success: false, error: 'Title, price, and category are required' });
  }

  const id = 'prod_' + (DEMO_CATALOG.length + 1) + '_' + Date.now().toString().slice(-4);
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const newProduct: ProductItem = {
    id,
    title,
    slug,
    price: Number(price),
    compareAtPrice: compareAtPrice ? Number(compareAtPrice) : Number(price) * 1.3,
    category,
    image: image || 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
    images: [image || 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80'],
    description: description || 'Premium heavyweight garment tailored for high-performance everyday wear.',
    rating: 5.0,
    reviewsCount: 1,
    inStock: inStock !== undefined ? Boolean(inStock) : true,
    hsn: '6109',
    gstRate: 18,
    sizes: Array.isArray(sizes) && sizes.length ? sizes : ['S', 'M', 'L', 'XL'],
    colors: ['Onyx Black'],
  };

  DEMO_CATALOG.unshift(newProduct);

  return res.status(201).json({
    success: true,
    message: 'Product created successfully',
    product: newProduct,
  });
});

// PUT /api/products/:id - Update product (Admin)
productsRouter.put('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const index = DEMO_CATALOG.findIndex((p) => p.id === id);

  if (index === -1) {
    return res.status(404).json({ success: false, error: 'Product not found' });
  }

  DEMO_CATALOG[index] = {
    ...DEMO_CATALOG[index],
    ...req.body,
    id: DEMO_CATALOG[index].id, // protect id
  };

  return res.json({
    success: true,
    message: 'Product updated successfully',
    product: DEMO_CATALOG[index],
  });
});

// DELETE /api/products/:id - Delete product (Admin)
productsRouter.delete('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const index = DEMO_CATALOG.findIndex((p) => p.id === id);

  if (index === -1) {
    return res.status(404).json({ success: false, error: 'Product not found' });
  }

  const deleted = DEMO_CATALOG.splice(index, 1)[0];
  return res.json({
    success: true,
    message: 'Product deleted successfully',
    product: deleted,
  });
});

