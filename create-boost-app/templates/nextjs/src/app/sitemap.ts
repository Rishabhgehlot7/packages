import { MetadataRoute } from 'next';
import Product from '@/models/Product';
import { dbConnect } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  
  let productUrls: MetadataRoute.Sitemap = [];
  try {
    await dbConnect();
    const products = await Product.find({ isActive: true, isDeleted: false }, 'slug updatedAt').lean();
    productUrls = (products || []).map((p: any) => ({
      url: `${baseUrl}/products/${p.slug}`,
      lastModified: new Date(p.updatedAt || new Date()),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    }));
  } catch (err) {
    // If DB is offline during build
  }

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    ...productUrls,
  ];
}
