import { Router, Request, Response } from 'express';

export const shippingRouter = Router();

const PINCODE_DATA: Record<string, { city: string; state: string; days: string }> = {
  '11': { city: 'New Delhi', state: 'Delhi', days: 'Tomorrow, by 2 PM' },
  '40': { city: 'Mumbai', state: 'Maharashtra', days: '2-3 Business Days' },
  '56': { city: 'Bengaluru', state: 'Karnataka', days: '2-3 Business Days' },
  '60': { city: 'Chennai', state: 'Tamil Nadu', days: '3-4 Business Days' },
  '70': { city: 'Kolkata', state: 'West Bengal', days: '3-4 Business Days' },
  '50': { city: 'Hyderabad', state: 'Telangana', days: '2-3 Business Days' },
  '38': { city: 'Ahmedabad', state: 'Gujarat', days: '2-3 Business Days' },
  '41': { city: 'Pune', state: 'Maharashtra', days: '2-3 Business Days' },
  '16': { city: 'Chandigarh', state: 'Punjab', days: 'Tomorrow, by 5 PM' },
  '30': { city: 'Jaipur', state: 'Rajasthan', days: '2-3 Business Days' },
  '22': { city: 'Lucknow', state: 'Uttar Pradesh', days: '2-3 Business Days' },
};

// GET /api/shipping/pincode/:pincode
shippingRouter.get('/pincode/:pincode', (req: Request, res: Response) => {
  const { pincode } = req.params;

  if (!pincode || !/^\d{6}$/.test(pincode)) {
    return res.status(400).json({
      success: false,
      error: 'Please enter a valid 6-digit Indian pincode.',
    });
  }

  const prefix = pincode.slice(0, 2);
  const info = PINCODE_DATA[prefix] || {
    city: 'Tier-2 City / Town',
    state: 'India',
    days: '3-5 Business Days',
  };

  return res.json({
    success: true,
    pincode,
    serviceable: true,
    codAvailable: true,
    expressAvailable: ['11', '40', '56', '16'].includes(prefix),
    estimatedDelivery: info.days,
    location: `${info.city}, ${info.state}`,
    shippingFee: 0, // Free Pan-India
  });
});
