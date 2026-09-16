import { Router, Request, Response } from 'express';

export const couponsRouter = Router();

const ACTIVE_COUPONS: Record<string, { discountPercent: number; minOrder: number; description: string }> = {
  BOOST20: { discountPercent: 20, minOrder: 999, description: 'Flat 20% off on orders above ₹999' },
  WELCOME10: { discountPercent: 10, minOrder: 499, description: '10% off for first-time shoppers' },
  FESTIVE25: { discountPercent: 25, minOrder: 1999, description: 'Special 25% festive drop discount' },
};

// POST /api/coupons/validate
couponsRouter.post('/validate', (req: Request, res: Response) => {
  const { code, orderAmount = 1500 } = req.body;

  if (!code) {
    return res.status(400).json({ success: false, error: 'Coupon code is required.' });
  }

  const cleanCode = String(code).toUpperCase().trim();
  const coupon = ACTIVE_COUPONS[cleanCode];

  if (!coupon) {
    return res.status(404).json({ success: false, error: 'Invalid or expired coupon code.' });
  }

  if (orderAmount < coupon.minOrder) {
    return res.status(400).json({
      success: false,
      error: `Coupon valid only on orders above ₹${coupon.minOrder}. Add ₹${coupon.minOrder - orderAmount} more!`,
    });
  }

  const discountAmount = Math.round((orderAmount * coupon.discountPercent) / 100);

  return res.json({
    success: true,
    code: cleanCode,
    discountPercent: coupon.discountPercent,
    discountAmount,
    finalAmount: orderAmount - discountAmount,
    description: coupon.description,
  });
});
