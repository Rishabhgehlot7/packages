import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createBoostApiRouter } from '@boostengine/server';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// ── Middleware ─────────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

const isMock = process.env.MOCK_MODE !== 'false';

// ── Boost API Router ───────────────────────────────────────────────────────────
// All eCommerce routes are auto-mounted here.
// When MOCK_MODE=true, checkout, OTP auth (code: 1234), and shipping work without API keys!
const boostRouter = createBoostApiRouter({
  mockMode:           isMock,
  razorpayKeyId:      process.env.RAZORPAY_KEY_ID,
  razorpayKeySecret:  process.env.RAZORPAY_KEY_SECRET,
  shiprocketEmail:    process.env.SHIPROCKET_EMAIL,
  shiprocketPassword: process.env.SHIPROCKET_PASSWORD,
  fast2smsApiKey:     process.env.FAST2SMS_API_KEY,
  gstNumber:          process.env.GST_NUMBER,
  businessName:       process.env.BUSINESS_NAME || '{{BRAND_TITLE}}',
});

app.use('/api', boostRouter);

// ── Curated D2C Catalog Endpoint ─────────────────────────────────────────────
const DEMO_PRODUCTS = [
  {
    id: 'prod_1',
    title: 'Cyberpunk Heavyweight 450 GSM Hoodie',
    price: 2499,
    compareAtPrice: 3999,
    category: 'Streetwear',
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewsCount: 64,
    inStock: true,
    hsn: '6109',
    gstRate: 18,
  },
  {
    id: 'prod_2',
    title: 'Acid Wash Vintage Boxy Tee',
    price: 1199,
    compareAtPrice: 1799,
    category: 'T-Shirts',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviewsCount: 42,
    inStock: true,
    hsn: '6109',
    gstRate: 18,
  },
  {
    id: 'prod_3',
    title: 'Tactical Cargo Pants (Water-Repellent)',
    price: 2999,
    compareAtPrice: 4499,
    category: 'Bottoms',
    image: 'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    reviewsCount: 38,
    inStock: true,
    hsn: '6203',
    gstRate: 18,
  },
  {
    id: 'prod_4',
    title: 'Artisanal Matte Black Solid Perfume (50ml)',
    price: 1899,
    compareAtPrice: 2499,
    category: 'Fragrances',
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80',
    rating: 5.0,
    reviewsCount: 89,
    inStock: true,
    hsn: '3303',
    gstRate: 18,
  },
];

app.get('/api/products', (_req, res) => {
  res.json({
    success: true,
    count: DEMO_PRODUCTS.length,
    products: DEMO_PRODUCTS,
  });
});

// ── Root / Health ─────────────────────────────────────────────────────────────
app.get('/', (_req, res) => {
  res.json({
    message: '⚡ {{BRAND_TITLE}} API is running!',
    mockMode: isMock,
    endpoints: {
      catalog: 'GET /api/products',
      health: 'GET /api/health',
      pincode: 'GET /api/shipping/pincode/:pincode',
      payments: 'POST /api/payments/create-order',
      auth: 'POST /api/auth/send-otp (mock OTP: 1234)',
      coupons: 'POST /api/coupons/validate (code: BOOST20)',
    },
  });
});

// ── Start Server ───────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n\x1b[32m✔ {{BRAND_TITLE}} API running on http://localhost:${PORT}\x1b[0m`);
  if (isMock) {
    console.log(`\x1b[33m⚡ MOCK MODE ACTIVE: Instant test payments, OTP (1234), and Indian pincodes ready!\x1b[0m`);
  }
  console.log(`  🛍️  Catalog:   http://localhost:${PORT}/api/products`);
  console.log(`  ❤️  Health:    http://localhost:${PORT}/api/health`);
  console.log(`  🚚 Pincode:   http://localhost:${PORT}/api/shipping/pincode/110001`);
  console.log(`  💳 Payments:  http://localhost:${PORT}/api/payments/create-order\n`);
});
