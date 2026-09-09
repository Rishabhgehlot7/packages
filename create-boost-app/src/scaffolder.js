const fs = require('fs');
const path = require('path');

/**
 * Recursively copy a directory and its files
 */
function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();

  const IGNORE_LIST = ['node_modules', '.next', '.git', 'dist', '.turbo'];

  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach((childItemName) => {
      if (IGNORE_LIST.includes(childItemName)) return;
      copyRecursiveSync(
        path.join(src, childItemName),
        path.join(dest, childItemName)
      );
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

/**
 * Scaffolder Engine for create-boost-app / create-boost-store
 */
function scaffoldProject(targetDir, options = {}) {
  const storeName = options.storeName || path.basename(targetDir);
  const brandTitle = options.brandTitle || 'Boost D2C Store';
  const templateDir = path.resolve(__dirname, '../template');

  if (!fs.existsSync(templateDir)) {
    throw new Error(`Template directory not found at ${templateDir}`);
  }

  // 1. Copy the complete template
  copyRecursiveSync(templateDir, targetDir);

  // 2. Personalize package.json
  const packageJsonPath = path.join(targetDir, 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    pkg.name = storeName.toLowerCase().replace(/[^a-z0-9-_]/g, '-');
    fs.writeFileSync(packageJsonPath, JSON.stringify(pkg, null, 2));
  }

  // 3. Create .env.local from .env.example
  const envExamplePath = path.join(targetDir, '.env.example');
  const envLocalPath = path.join(targetDir, '.env.local');
  if (fs.existsSync(envExamplePath)) {
    let envContent = fs.readFileSync(envExamplePath, 'utf8');
    envContent = envContent.replace(
      'NEXT_PUBLIC_STORE_NAME="Boost D2C Store"',
      `NEXT_PUBLIC_STORE_NAME="${brandTitle}"`
    );
    fs.writeFileSync(envLocalPath, envContent);
  }

  // 4. Generate custom README.md
  const readme = `# ${brandTitle}

⚡ Generated with \`npx create-boost-app\`

A complete, production-ready D2C eCommerce store built with:
- **Next.js 15 & React 18**
- **15 Modular @boostengine Micro-Packages**
- **Shopify/WordPress-Style Admin Panel (\`/admin\`)**
- **WordPress-Style Hot-Pluggable Extension Engine**
- **Indian GST Compliance & HSN Calculation**
- **Razorpay, PhonePe & COD Multi-Gateway Support**

---

## 🚀 Quick Start

1. Install dependencies:
\`\`\`bash
npm install
\`\`\`

2. Run development server:
\`\`\`bash
npm run dev
\`\`\`

3. Open your browser:
- **Storefront**: [http://localhost:3000](http://localhost:3000)
- **Admin Panel**: [http://localhost:3000/admin](http://localhost:3000/admin)
- **Plugins Hub**: [http://localhost:3000/admin/plugins](http://localhost:3000/admin/plugins)
- **Product Catalog**: [http://localhost:3000/admin/products](http://localhost:3000/admin/products)
- **Orders Management**: [http://localhost:3000/admin/orders](http://localhost:3000/admin/orders)

---

## 🧩 Active Plugins

Manage extensions directly in the Admin Panel without touching code:
- **Smart Coupons**: Auto-apply cart discounts
- **Logistics & Shipping**: Live Pincode checker & COD validator
- **Customer Reviews**: Rating breakdown & verified badges
- **GST Invoicing**: Instant PDF Tax Invoices & Thermal Shipping Labels
- **WhatsApp Alerts**: Automated order confirmations
- **Universal Payments**: Razorpay, UPI & COD integration

---

© ${new Date().getFullYear()} ${brandTitle}. Powered by BoostEngine.
`;
  fs.writeFileSync(path.join(targetDir, 'README.md'), readme);

  return { success: true, targetDir, storeName, brandTitle };
}

module.exports = { scaffoldProject };
