import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './db';
import { productsRouter } from './routes/products';
import { ordersRouter } from './routes/orders';
import { paymentsRouter } from './routes/payments';
import { shippingRouter } from './routes/shipping';
import { authRouter } from './routes/auth';
import { couponsRouter } from './routes/coupons';
import { supportRouter } from './routes/support';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const isMock = process.env.MOCK_MODE !== 'false' && !process.env.MONGODB_URI;

// ── Middleware ─────────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── API Routes Mount ───────────────────────────────────────────────────────────
app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/shipping', shippingRouter);
app.use('/api/auth', authRouter);
app.use('/api/coupons', couponsRouter);
app.use('/api', supportRouter);

// ── Root / Health ─────────────────────────────────────────────────────────────
app.get('/', (_req: Request, res: Response) => {
  res.json({
    message: '⚡ {{BRAND_TITLE}} Express API is running!',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    mockMode: isMock,
    mongoConnected: !isMock && !!process.env.MONGODB_URI,
    endpoints: {
      catalog: 'GET /api/products',
      catalogItem: 'GET /api/products/:idOrSlug',
      orders: 'POST /api/orders',
      orderLookup: 'GET /api/orders/:orderId',
      pincode: 'GET /api/shipping/pincode/:pincode',
      payments: 'POST /api/payments/create-order',
      paymentsVerify: 'POST /api/payments/verify',
      auth: 'POST /api/auth/send-otp (mock OTP: 1234)',
      authVerify: 'POST /api/auth/verify-otp',
      coupons: 'POST /api/coupons/validate (code: BOOST20)',
      contact: 'POST /api/contact',
      warrantyRegister: 'POST /api/warranty/register',
      warrantyClaim: 'POST /api/warranty/claim',
      policies: 'GET /api/policies/:type (privacy|terms|refund|shipping)',
    },
  });
});

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

// ── Start Server ───────────────────────────────────────────────────────────────
async function startServer() {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`\n\x1b[32m✔ {{BRAND_TITLE}} API running on http://localhost:${PORT}\x1b[0m`);
    if (isMock) {
      console.log(`\x1b[33m⚡ MOCK MODE ACTIVE: Zero credentials required. Test OTP: 1234, Coupon: BOOST20\x1b[0m`);
    } else {
      console.log(`\x1b[32m⚡ PRODUCTION/DB MODE ACTIVE\x1b[0m`);
    }
    console.log(`  🛍️  Catalog:   http://localhost:${PORT}/api/products`);
    console.log(`  📦 Orders:    http://localhost:${PORT}/api/orders`);
    console.log(`  🚚 Pincode:   http://localhost:${PORT}/api/shipping/pincode/110001`);
    console.log(`  💳 Payments:  http://localhost:${PORT}/api/payments/create-order\n`);
  });
}

startServer();
