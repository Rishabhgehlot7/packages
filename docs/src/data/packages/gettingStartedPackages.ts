import { PackageDoc } from '../../types';

export const gettingStartedPackages: PackageDoc[] = [
  {
    id: 'getting-started',
    name: 'BoostEngine Overview',
    categoryId: 'getting-started',
    version: '1.1.0',
    description: 'The 10-Minute Enterprise eCommerce Suite for India & Global D2C Brands. Assemble modern, high-converting eCommerce stores in minutes with decoupled, zero-bloat, tree-shakable micro-packages.',
    badge: 'Guide',
    npmInstall: 'npx create-boost-app my-d2c-store',
    bundleSize: 'Modular',
    useCase: 'Eliminates Shopify 2% transaction fee tax and bloated monolithic codebases. Assemble decoupled micro-services with native Indian GST, Razorpay, and Shiprocket support.',
    features: [
      'Decoupled Micro-Package Ecosystem: Install only what you need (cart, payments, returns, etc.)',
      'Native Indian GST Tax Engine: Intra-state CGST + SGST vs Inter-state IGST compliant',
      'Unified Payment Switch: Razorpay, PhonePe, Cashfree, Paytm, COD with 1 single API',
      'Reverse Logistics Ready: Shiprocket, Delhivery doorstep return & automated QC pickup',
      'Framework Agnostic: Seamless in Next.js 14/15, Vite, Remix, Node.js, and React Native Expo'
    ],
    apiMethods: [
      {
        name: 'npx create-boost-app',
        signature: 'npx create-boost-app <project-name> [--template <name>]',
        description: 'Bootstraps a complete Next.js 15 D2C storefront + admin panel with all 24 packages pre-wired.',
        params: [
          { name: 'project-name', type: 'string', description: 'Directory name for your new eCommerce project', required: true },
          { name: '--template', type: 'string', description: 'Template variant (d2c-fashion, electronics, grocery)', required: false }
        ],
        returns: 'Scaffolded production-ready Next.js project with Tailwind and BoostEngine'
      }
    ],
    examples: [
      {
        title: 'Instant 60-Second Store Setup',
        language: 'bash',
        code: `# 1. Generate full-featured Next.js D2C store
npx create-boost-app my-brand-store

# 2. Navigate to project
cd my-brand-store

# 3. Start local development
npm run dev`
      },
      {
        title: 'Micro-Package Composition Example',
        language: 'typescript',
        code: `import { calculateCartGST } from '@boostengine/cart';
import { createPaymentSession } from '@boostengine/payments';
import { autoApplyBestCoupon } from '@boostengine/coupons';

// Compose packages freely without monolithic lock-in
const optimizedCart = autoApplyBestCoupon(cart, availableCoupons);
const taxBreakdown = calculateCartGST(optimizedCart, { buyerState: 'Maharashtra', sellerState: 'Karnataka' });
const orderSession = await createPaymentSession({ gateway: 'razorpay', amount: taxBreakdown.grandTotal });`
      }
    ],
    notes: [
      'Dual ESM (.mjs) and CommonJS (.cjs) builds provided for every package.',
      '100% strict TypeScript types included out of the box.'
    ]
  },
  {
    id: 'create-boost-app',
    name: 'create-boost-app',
    categoryId: 'getting-started',
    version: '1.1.0',
    description: '1-command production CLI generator for launching high-converting Next.js D2C store & admin dashboard with pre-integrated BoostEngine micro-packages.',
    badge: 'CLI Tool',
    npmInstall: 'npx create-boost-app@latest',
    bundleSize: '32 KB',
    useCase: 'Jumpstarts new D2C brands with battle-tested architecture, SEO schemas, Indian GST cart, and payment routes pre-configured.',
    features: [
      'Next.js 15 App Router + React 19 + Tailwind CSS',
      'Pre-configured Razorpay, PhonePe & Cashfree checkout routes',
      'Built-in Indian Pincode serviceability & Shiprocket tracking',
      'Ready-to-use Admin Panel for orders, products, coupons & returns'
    ],
    apiMethods: [
      {
        name: 'cli',
        signature: 'npx create-boost-app [target-dir]',
        description: 'Interactive terminal wizard asking for brand name, primary payment gateway, and logistics provider.',
        params: [
          { name: 'target-dir', type: 'string', description: 'Path to folder', required: false }
        ],
        returns: 'Complete project folder with .env.example'
      }
    ],
    examples: [
      {
        title: 'Interactive CLI Execution',
        language: 'bash',
        code: `npx create-boost-app luxury-perfumes
# ? Select Primary Gateway: Razorpay
# ? Select Courier Partner: Shiprocket
# ? Enable Loyalty Rewards (Flipkart SuperCoins style)? Yes
# -> Creating luxury-perfumes with 24 micro-packages... Done in 18s!`
      }
    ]
  }
];
