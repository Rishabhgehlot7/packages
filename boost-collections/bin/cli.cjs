#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const collectionsDir = path.join(__dirname, '..', 'collections');
const envsDir = path.join(__dirname, '..', 'environments');

const collections = {
  razorpay: {
    name: 'Razorpay eCommerce API Collection',
    collectionFile: path.join(collectionsDir, 'razorpay.collection.json'),
    envFile: path.join(envsDir, 'razorpay.env.json'),
    docs: 'https://razorpay.com/docs/api',
    description: 'Orders, Payments, Refunds & Webhook Simulator',
  },
  cashfree: {
    name: 'Cashfree Payments API Collection',
    collectionFile: path.join(collectionsDir, 'cashfree.collection.json'),
    envFile: path.join(envsDir, 'cashfree.env.json'),
    docs: 'https://docs.cashfree.com/reference',
    description: 'Payment Gateway PG v2023-08-01 Orders, Payments, Refunds, Webhooks',
  },
  phonepe: {
    name: 'PhonePe Payment Gateway Collection',
    collectionFile: path.join(collectionsDir, 'phonepe.collection.json'),
    envFile: path.join(envsDir, 'phonepe.env.json'),
    docs: 'https://developer.phonepe.com/v1/reference',
    description: 'Standard Pay, Order Status Check, Refunds & S2S Webhooks',
  },
  paytm: {
    name: 'Paytm Payment Gateway Collection',
    collectionFile: path.join(collectionsDir, 'paytm.collection.json'),
    envFile: path.join(envsDir, 'paytm.env.json'),
    docs: 'https://developer.paytm.com/docs/api',
    description: 'Initiate Transaction, Status Check, Refunds & S2S Callback',
  },
  stripe: {
    name: 'Stripe Global Payments Collection',
    collectionFile: path.join(collectionsDir, 'stripe.collection.json'),
    envFile: path.join(envsDir, 'stripe.env.json'),
    docs: 'https://stripe.com/docs/api',
    description: 'Checkout Sessions, PaymentIntents, Customers & Refunds',
  },
  easyecom: {
    name: 'EasyEcom eCommerce & Warehouse API Collection',
    collectionFile: path.join(collectionsDir, 'easyecom.collection.json'),
    envFile: path.join(envsDir, 'easyecom.env.json'),
    docs: 'https://api.easyecom.com/documentation',
    description: 'Orders, Multi-Warehouse Inventory, Catalog & Shipping Manifests',
  },
  shiprocket: {
    name: 'Shiprocket Logistics API Collection',
    collectionFile: path.join(collectionsDir, 'shiprocket.collection.json'),
    envFile: path.join(envsDir, 'shiprocket.env.json'),
    docs: 'https://apidocs.shiprocket.in',
    description: 'Auth, Pincode Serviceability, Order Creation, AWB & Live Tracking',
  },
  delhivery: {
    name: 'Delhivery Express Shipping Collection',
    collectionFile: path.join(collectionsDir, 'delhivery.collection.json'),
    envFile: path.join(envsDir, 'delhivery.env.json'),
    docs: 'https://delhivery.com/developer',
    description: 'Pin-codes Serviceability, Waybill Creation & Live Package Tracking',
  },
  shopify: {
    name: 'Shopify Admin REST API Collection',
    collectionFile: path.join(collectionsDir, 'shopify.collection.json'),
    envFile: path.join(envsDir, 'shopify.env.json'),
    docs: 'https://shopify.dev/docs/api/admin-rest',
    description: 'Storefront Products, Orders, Inventory Levels & Webhooks',
  },
};

const args = process.argv.slice(2);
const command = args[0] || 'help';

console.log('\n📦 \x1b[1m\x1b[34m@boostengine/collections\x1b[0m - Indian eCommerce Postman Collections CLI\n');

switch (command) {
  case 'list': {
    console.log('Available Production-Ready Collections:\n');
    Object.keys(collections).forEach((key) => {
      const item = collections[key];
      console.log(`  \x1b[32m● ${key}\x1b[0m - \x1b[1m${item.name}\x1b[0m`);
      console.log(`    Description: ${item.description}`);
      console.log(`    Docs:        \x1b[36m${item.docs}\x1b[0m\n`);
    });
    console.log('💡 Run: \x1b[33mnpx @boostengine/collections export <name>\x1b[0m to dump JSON files.\n');
    break;
  }

  case 'export': {
    const target = (args[1] || 'all').toLowerCase();
    const destDir = args[2] ? path.resolve(process.cwd(), args[2]) : process.cwd();

    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    const exportKeys = target === 'all' ? Object.keys(collections) : [target];

    if (!collections[target] && target !== 'all') {
      console.error(`\x1b[31m❌ Unknown collection "${target}".\x1b[0m`);
      console.log(`Available: ${Object.keys(collections).join(', ')} or "all"\n`);
      process.exit(1);
    }

    console.log(`🚀 Exporting collections to: \x1b[36m${destDir}\x1b[0m\n`);

    exportKeys.forEach((key) => {
      const item = collections[key];
      const colDest = path.join(destDir, `${key}.collection.json`);
      const envDest = path.join(destDir, `${key}.env.json`);

      fs.copyFileSync(item.collectionFile, colDest);
      fs.copyFileSync(item.envFile, envDest);

      console.log(`  ✅ \x1b[32m${key}\x1b[0m:`);
      console.log(`     ├── Collection: \x1b[33m${path.basename(colDest)}\x1b[0m`);
      console.log(`     └── Environment: \x1b[33m${path.basename(envDest)}\x1b[0m`);
    });

    console.log('\n✨ Export complete! How to import into Postman:');
    console.log('  1. Open Postman / Insomnia / Bruno.');
    console.log('  2. Click "Import" and select the generated *.collection.json and *.env.json files.');
    console.log('  3. Set your API credentials in the Environment variables & start testing!\n');
    break;
  }

  case 'info': {
    const target = (args[1] || '').toLowerCase();
    if (!collections[target]) {
      console.error(`\x1b[31m❌ Please specify a valid collection: ${Object.keys(collections).join(', ')}\x1b[0m\n`);
      process.exit(1);
    }
    const item = collections[target];
    const colJson = JSON.parse(fs.readFileSync(item.collectionFile, 'utf8'));

    console.log(`\x1b[1mCollection:\x1b[0m   ${item.name}`);
    console.log(`\x1b[1mDocs:\x1b[0m         ${item.docs}`);
    console.log(`\x1b[1mFolders:\x1b[0m`);
    colJson.item.forEach((f) => {
      console.log(`  📁 ${f.name} (${f.item ? f.item.length : 0} requests)`);
      if (f.item) {
        f.item.forEach((req) => {
          const method = req.request?.method || 'GET';
          console.log(`     • [${method}] ${req.name}`);
        });
      }
    });
    console.log('');
    break;
  }

  default: {
    console.log('Commands:');
    console.log('  \x1b[33mnpx @boostengine/collections list\x1b[0m                  List all available API collections');
    console.log('  \x1b[33mnpx @boostengine/collections export <name>\x1b[0m        Export collection (razorpay, easyecom, all)');
    console.log('  \x1b[33mnpx @boostengine/collections export <name> <dir>\x1b[0m  Export into custom directory');
    console.log('  \x1b[33mnpx @boostengine/collections info <name>\x1b[0m          Inspect folders and endpoints in collection\n');
    break;
  }
}
