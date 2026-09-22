import { PackageDoc } from '../../types';

export const checkoutPackages: PackageDoc[] = [
  {
    id: 'boost-cart',
    name: '@boostengine/cart',
    categoryId: 'checkout',
    version: '1.1.0',
    description: 'High-precision eCommerce cart calculation engine featuring native Indian GST (CGST/SGST/IGST), free shipping threshold progress, and MRP savings math.',
    badge: 'Indian GST Core',
    npmInstall: 'npm i @boostengine/cart',
    bundleSize: '6.8 KB',
    useCase: 'Accurately calculates line items, intra-state CGST + SGST vs inter-state IGST, HSN tax rates, discounts, and shipping delivery fees.',
    features: [
      'Intra-State vs Inter-State Indian GST automatic detection',
      'Multi-rate GST handling (0%, 5%, 12%, 18%, 28%) with HSN support',
      'Dynamic Free Shipping threshold progress bar meter',
      'Total MRP Savings calculation to highlight customer discounts'
    ],
    apiMethods: [
      {
        name: 'calculateCart',
        signature: 'calculateCart(cart: CartInput, options: CartOptions): CartResult',
        description: 'Executes complete pricing, discounts, shipping, and GST breakdown for cart items.',
        params: [
          { name: 'cart', type: 'CartInput', description: 'Items array with quantity, mrp, price, and gstRate', required: true },
          { name: 'options', type: 'CartOptions', description: 'Shipping state, warehouse state, coupon discount', required: true }
        ],
        returns: 'CartResult with subtotal, cgst, sgst, igst, shippingFee, mrpSavings, and grandTotal'
      }
    ],
    examples: [
      {
        title: 'Multi-Entry Imports: Root Engine + ./react Hooks',
        language: 'typescript',
        code: `import { calculateCart } from '@boostengine/cart';
import { useBoostCart, createCartHookBindings } from '@boostengine/cart/react';

// Headless engine on the server
const result = calculateCart(cart, { warehouseState: 'Maharashtra', shippingState: 'Karnataka' });

// React bindings on the client
export function CartSummary() {
  const { items, subtotal, gst, shippingFee, grandTotal } = useBoostCart();
  return <div>Total: {grandTotal}</div>;
}`
      },
      {
        title: 'Intra-State vs Inter-State GST Calculation',
        language: 'typescript',
        code: `import { calculateCart } from '@boostengine/cart';

const cart = {
  items: [
    { id: 'p1', name: 'Cotton Kurta', price: 999, mrp: 1999, quantity: 2, gstRate: 12, hsn: '6204' },
    { id: 'p2', name: 'Leather Belt', price: 499, mrp: 999, quantity: 1, gstRate: 18, hsn: '4203' }
  ]
};

// Seller in Maharashtra, Buyer in Maharashtra -> Intra-State (CGST + SGST)
const resultIntra = calculateCart(cart, {
  warehouseState: 'Maharashtra',
  shippingState: 'Maharashtra',
  freeShippingThreshold: 1500
});

console.log(resultIntra);
// Output:
// {
//   subtotal: 2497,
//   isInterState: false,
//   cgst: 144.38,
//   sgst: 144.38,
//   igst: 0,
//   shippingFee: 0, // Free shipping unlocked (subtotal > 1500)
//   mrpSavings: 2500,
//   grandTotal: 2497
// }`
      }
    ]
  },
  {
    id: 'boost-payments',
    name: '@boostengine/payments',
    categoryId: 'checkout',
    version: '1.1.0',
    description: 'Unified Indian & Global Payment Gateway Switch supporting Razorpay, Cashfree, PhonePe, Paytm, Stripe, and Cash on Delivery (COD) with subunit normalization.',
    badge: 'Payment Switch',
    npmInstall: 'npm i @boostengine/payments',
    bundleSize: '9.2 KB',
    useCase: 'Switch between Razorpay, Cashfree, and PhonePe with zero code changes in your UI checkout flow.',
    features: [
      'Subunit automatic conversion (Rupees to Paise, USD to Cents)',
      '1-line Webhook signature verification for Razorpay, Cashfree & PhonePe',
      'COD fraud prevention with OTP pre-validation verification',
      'Smart fallback routing if primary gateway goes down'
    ],
    apiMethods: [
      {
        name: 'createOrderSession',
        signature: 'createOrderSession(payload: PaymentOrderRequest): Promise<PaymentOrderResponse>',
        description: 'Creates a checkout session with the selected payment provider.',
        params: [
          { name: 'payload', type: 'PaymentOrderRequest', description: 'gateway, amount, currency, orderId, customer details', required: true }
        ],
        returns: 'Promise with gatewayOrderId, key, and redirect/sdk payload'
      },
      {
        name: 'verifyWebhookSignature',
        signature: 'verifyWebhookSignature(gateway: string, rawBody: string, signature: string, secret: string): boolean',
        description: 'Cryptographically verifies incoming webhook payload from payment provider.',
        params: [
          { name: 'gateway', type: 'string', description: 'razorpay | cashfree | phonepe', required: true },
          { name: 'rawBody', type: 'string', description: 'Raw incoming request body', required: true },
          { name: 'signature', type: 'string', description: 'Gateway signature header', required: true },
          { name: 'secret', type: 'string', description: 'Webhook secret key', required: true }
        ],
        returns: 'boolean - true if webhook is authentic'
      }
    ],
    examples: [
      {
        title: 'Multi-Entry Imports: Root Gateway Switch + ./react',
        language: 'typescript',
        code: `import { createOrderSession, verifyWebhookSignature } from '@boostengine/payments';
import { openPaymentModal, useBoostPayment } from '@boostengine/payments/react';

// Server side: create session, verify webhooks
const session = await createOrderSession({
  gateway: 'razorpay',
  amount: 1499,
  currency: 'INR',
  orderId: 'ORD_90821',
  customer: { email: 'customer@gmail.com', phone: '+919876543210' }
});

// Client side: open gateway modal inline
openPaymentModal(session, { onSuccess: () => console.log('Paid!') });`
      },
      {
        title: 'Create Order Session & Verify Webhook',
        language: 'typescript',
        code: `import { createOrderSession, verifyWebhookSignature } from '@boostengine/payments';

// 1. Create Checkout Session (e.g. Next.js Route Handler)
export async function POST(req: Request) {
  const { amount, orderId } = await req.json();

  const session = await createOrderSession({
    gateway: 'razorpay', // or 'phonepe' | 'cashfree'
    amount: 1499, // In rupees (automatically converted to 149900 paise)
    currency: 'INR',
    orderId: 'ORD_90821',
    customer: { email: 'customer@gmail.com', phone: '+919876543210' }
  });

  return Response.json(session);
}`
      }
    ]
  },
  {
    id: 'boost-coupons',
    name: '@boostengine/coupons',
    categoryId: 'checkout',
    version: '1.1.0',
    description: 'High-conversion promotions engine with FLAT discounts, percentage offers, BOGO (Buy X Get Y), tiered spend ladders, and automatic best coupon recommendation.',
    badge: 'Promotions',
    npmInstall: 'npm i @boostengine/coupons',
    bundleSize: '5.6 KB',
    useCase: 'Maximizes checkout conversion by auto-applying the most profitable discount for the customer with zero manual guessing.',
    features: [
      'Rule types: FLAT, PERCENTAGE, BOGO, TIERED_SPEND, FREE_SHIPPING',
      'autoApplyBestCoupon algorithm to find highest savings coupon',
      'First-order only & category/product restrictions',
      'Maximum discount caps on percentage coupons'
    ],
    apiMethods: [
      {
        name: 'validateCoupon',
        signature: 'validateCoupon(coupon: Coupon, cart: Cart, customerId?: string): CouponValidationResult',
        description: 'Validates minimum spend, usage limits, user eligibility, and computes discount.',
        params: [
          { name: 'coupon', type: 'Coupon', description: 'Coupon configuration object', required: true },
          { name: 'cart', type: 'Cart', description: 'Current cart payload', required: true }
        ],
        returns: 'CouponValidationResult with isValid, discountAmount, and failureReason'
      },
      {
        name: 'autoApplyBestCoupon',
        signature: 'autoApplyBestCoupon(coupons: Coupon[], cart: Cart): BestCouponResult',
        description: 'Evaluates all public coupons against current cart and returns the one with the maximum savings.',
        params: [
          { name: 'coupons', type: 'Coupon[]', description: 'List of active store coupons', required: true },
          { name: 'cart', type: 'Cart', description: 'Current cart payload', required: true }
        ],
        returns: 'BestCouponResult with bestCoupon and totalSavings'
      }
    ],
    examples: [
      {
        title: 'Multi-Entry Imports: Root Promo Engine + ./react',
        language: 'typescript',
        code: `import { validateCoupon, autoApplyBestCoupon } from '@boostengine/coupons';
import { useCoupon } from '@boostengine/coupons/react';

// Headless on server
const { bestCoupon, discountAmount } = autoApplyBestCoupon(activeCoupons, cart);

// React form binding for the checkout page
export function CouponField() {
  const { code, apply, applied, savings, error } = useCoupon();
  return <input value={code} onChange={(e) => apply(e.target.value)} placeholder="Apply coupon" />;
}`
      },
      {
        title: 'Auto-Apply Best Coupon',
        language: 'typescript',
        code: `import { autoApplyBestCoupon } from '@boostengine/coupons';

const activeCoupons = [
  { code: 'FLAT100', type: 'FLAT', value: 100, minOrderValue: 500 },
  { code: 'FESTIVE20', type: 'PERCENT', value: 20, maxDiscount: 300, minOrderValue: 999 },
  { code: 'MEGA500', type: 'FLAT', value: 500, minOrderValue: 2999 }
];

const cart = { subtotal: 1800, items: [] };

const { bestCoupon, discountAmount } = autoApplyBestCoupon(activeCoupons, cart as any);
console.log(\`Best Coupon: \${bestCoupon.code}, You saved: ₹\${discountAmount}\`);
// Best Coupon: FESTIVE20, You saved: ₹300`
      }
    ]
  },
  {
    id: 'boost-invoicing',
    name: '@boostengine/invoicing',
    categoryId: 'checkout',
    version: '1.1.0',
    description: 'Legal Indian GST Tax Invoice & 4x6 Thermal Shipping Label Generator with HSN summary tables, SVG barcodes, and printable vector layouts.',
    badge: 'Legal GST Invoice',
    npmInstall: 'npm i @boostengine/invoicing',
    bundleSize: '11.5 KB',
    useCase: 'Generates compliant Tax Invoices and thermal shipping labels for dispatch parcels without needing paid SaaS tools.',
    features: [
      'Govt-compliant Indian GST Tax Invoice layout (CGST, SGST, IGST columns)',
      'Item-wise HSN codes, tax rates, and taxable amount summaries',
      '4x6 Thermal Shipping Label with SVG Code128 barcode generator',
      'Direct HTML-to-print & headless PDF pipeline support'
    ],
    apiMethods: [
      {
        name: 'generateTaxInvoiceHtml',
        signature: 'generateTaxInvoiceHtml(invoiceData: InvoiceData): string',
        description: 'Returns clean, inline-styled printable HTML invoice matching Indian GST guidelines.',
        params: [
          { name: 'invoiceData', type: 'InvoiceData', description: 'Order details, buyer GSTIN, seller GSTIN, line items', required: true }
        ],
        returns: 'string - Ready-to-print HTML document'
      },
      {
        name: 'generateThermalShippingLabel',
        signature: 'generateThermalShippingLabel(labelData: ShippingLabelData): string',
        description: 'Generates standardized 4x6 inch thermal shipping label with AWB barcode and return address.',
        params: [
          { name: 'labelData', type: 'ShippingLabelData', description: 'AWB, courier name, destination address, barcode data', required: true }
        ],
        returns: 'string - 4x6 inch thermal printable HTML'
      }
    ],
    examples: [
      {
        title: 'Multi-Entry Imports: Root Generator + ./react',
        language: 'typescript',
        code: `import { generateTaxInvoiceHtml, generateThermalShippingLabel } from '@boostengine/invoicing';
import { useInvoice } from '@boostengine/invoicing/react';

// Server: generate printable GST invoice HTML
const invoiceHtml = generateTaxInvoiceHtml(invoiceData);

// Client: reactive invoice state for the admin panel
const { invoice, status, regenerate } = useInvoice(orderId);`
      },
      {
        title: 'Generate Legal Tax Invoice HTML',
        language: 'typescript',
        code: `import { generateTaxInvoiceHtml } from '@boostengine/invoicing';

const invoiceHtml = generateTaxInvoiceHtml({
  invoiceNumber: 'INV-2026-0891',
  invoiceDate: '2026-09-18',
  seller: {
    legalName: 'Boost Commerce India Pvt Ltd',
    gstin: '27AAAAA0000A1Z5',
    state: 'Maharashtra',
    stateCode: '27',
    address: 'Andheri East, Mumbai, Maharashtra 400069'
  },
  buyer: {
    name: 'Rahul Sharma',
    shippingAddress: 'Koramangala, Bengaluru, Karnataka 560034',
    state: 'Karnataka',
    stateCode: '29'
  },
  items: [
    { description: 'Smart Fitness Tracker', hsn: '8517', qty: 1, rate: 2999, gstRate: 18, amount: 2999 }
  ],
  isInterState: true
});`
      }
    ]
  }
];
