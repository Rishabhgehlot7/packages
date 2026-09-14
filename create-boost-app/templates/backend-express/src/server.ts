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

// ── Boost API Router ───────────────────────────────────────────────────────────
// All eCommerce routes are auto-mounted here.
// Just add your credentials to .env and everything works!
const boostRouter = createBoostApiRouter({
  razorpayKeyId:      process.env.RAZORPAY_KEY_ID,
  razorpayKeySecret:  process.env.RAZORPAY_KEY_SECRET,
  shiprocketEmail:    process.env.SHIPROCKET_EMAIL,
  shiprocketPassword: process.env.SHIPROCKET_PASSWORD,
  fast2smsApiKey:     process.env.FAST2SMS_API_KEY,
  gstNumber:          process.env.GST_NUMBER,
  businessName:       process.env.BUSINESS_NAME || '{{BRAND_TITLE}}',
});

app.use('/api', boostRouter);

// ── Custom Routes ──────────────────────────────────────────────────────────────
// Add your own routes here
app.get('/', (_req, res) => {
  res.json({
    message: '⚡ {{BRAND_TITLE}} API is running!',
    docs: 'GET /api/health for API status',
  });
});

// ── Start Server ───────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\x1b[32m✔ {{BRAND_TITLE}} API running on http://localhost:${PORT}\x1b[0m`);
  console.log(`  API Health: http://localhost:${PORT}/api/health`);
  console.log(`  Payments:   http://localhost:${PORT}/api/payments/*`);
  console.log(`  Shipping:   http://localhost:${PORT}/api/shipping/*`);
  console.log(`  Auth:       http://localhost:${PORT}/api/auth/*`);
});
