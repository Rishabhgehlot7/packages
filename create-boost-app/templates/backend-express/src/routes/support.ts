import { Router, Request, Response } from 'express';

export const supportRouter = Router();

// POST /api/contact
supportRouter.post('/contact', (req: Request, res: Response) => {
  const { name, email, phone, subject, message } = req.body || {};
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, error: 'Name, email, and message are required.' });
  }

  const ticketId = 'TKT-' + Math.floor(100000 + Math.random() * 900000);
  return res.json({
    success: true,
    message: 'Thank you for reaching out! Our team will respond to your query within 24 hours.',
    ticketId,
  });
});

// POST /api/warranty/register
supportRouter.post('/warranty/register', (req: Request, res: Response) => {
  const { fullName, email, phone, orderNumber, productPurchased } = req.body || {};
  if (!fullName || !email || !orderNumber) {
    return res.status(400).json({ success: false, error: 'Full name, email, and order number are required.' });
  }

  return res.json({
    success: true,
    registrationId: 'WR-' + Date.now(),
    message: 'Warranty successfully registered for ' + (productPurchased || 'your item') + '!',
  });
});

// POST /api/warranty/claim
supportRouter.post('/warranty/claim', (req: Request, res: Response) => {
  const { fullName, email, orderNumber, issueDescription } = req.body || {};
  if (!fullName || !email || !orderNumber || !issueDescription) {
    return res.status(400).json({ success: false, error: 'Please provide full details and issue description.' });
  }

  return res.json({
    success: true,
    claimId: 'CLM-' + Date.now(),
    message: 'Warranty claim received! Our inspection team will contact you within 24–48 hours.',
  });
});

// GET /api/policies/:type
supportRouter.get('/policies/:type', (req: Request, res: Response) => {
  const { type } = req.params;
  const brand = process.env.BUSINESS_NAME || '{{BRAND_TITLE}}';

  const policies: Record<string, { title: string; content: string }> = {
    privacy: {
      title: 'Privacy Policy',
      content: `${brand} respects your privacy. We only collect essential customer data (Name, Phone, Shipping Address) strictly for processing orders and dispatching through logistics partners.`,
    },
    terms: {
      title: 'Terms of Service',
      content: `By purchasing from ${brand}, you agree that all orders are processed in accordance with Indian e-commerce consumer protection regulations.`,
    },
    refund: {
      title: 'Return & Refund Policy',
      content: `We offer a hassle-free 7-day doorstep replacement or exchange for defective or incorrectly sized products.`,
    },
    shipping: {
      title: 'Shipping Policy',
      content: `Prepaid and COD orders are dispatched within 24 hours. Standard transit time across Tier-1/Tier-2 Indian cities is 2–4 business days.`,
    },
  };

  const policy = policies[type.toLowerCase()];
  if (!policy) {
    return res.status(404).json({ success: false, error: 'Policy not found' });
  }
  return res.json({ success: true, ...policy });
});
