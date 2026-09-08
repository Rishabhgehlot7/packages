import fs from 'fs';
import path from 'path';
import {
  PostmanCollection,
  PostmanEnvironment,
  CollectionName,
  CollectionSummary,
} from './types';

// Inlined or required JSON objects for zero runtime path fragility
import razorpayCollectionJson from '../collections/razorpay.collection.json';
import cashfreeCollectionJson from '../collections/cashfree.collection.json';
import phonepeCollectionJson from '../collections/phonepe.collection.json';
import paytmCollectionJson from '../collections/paytm.collection.json';
import stripeCollectionJson from '../collections/stripe.collection.json';
import easyecomCollectionJson from '../collections/easyecom.collection.json';
import shiprocketCollectionJson from '../collections/shiprocket.collection.json';
import delhiveryCollectionJson from '../collections/delhivery.collection.json';
import shopifyCollectionJson from '../collections/shopify.collection.json';

import razorpayEnvironmentJson from '../environments/razorpay.env.json';
import cashfreeEnvironmentJson from '../environments/cashfree.env.json';
import phonepeEnvironmentJson from '../environments/phonepe.env.json';
import paytmEnvironmentJson from '../environments/paytm.env.json';
import stripeEnvironmentJson from '../environments/stripe.env.json';
import easyecomEnvironmentJson from '../environments/easyecom.env.json';
import shiprocketEnvironmentJson from '../environments/shiprocket.env.json';
import delhiveryEnvironmentJson from '../environments/delhivery.env.json';
import shopifyEnvironmentJson from '../environments/shopify.env.json';

export * from './types';

export const razorpayCollection: PostmanCollection = razorpayCollectionJson as unknown as PostmanCollection;
export const cashfreeCollection: PostmanCollection = cashfreeCollectionJson as unknown as PostmanCollection;
export const phonepeCollection: PostmanCollection = phonepeCollectionJson as unknown as PostmanCollection;
export const paytmCollection: PostmanCollection = paytmCollectionJson as unknown as PostmanCollection;
export const stripeCollection: PostmanCollection = stripeCollectionJson as unknown as PostmanCollection;
export const easyecomCollection: PostmanCollection = easyecomCollectionJson as unknown as PostmanCollection;
export const shiprocketCollection: PostmanCollection = shiprocketCollectionJson as unknown as PostmanCollection;
export const delhiveryCollection: PostmanCollection = delhiveryCollectionJson as unknown as PostmanCollection;
export const shopifyCollection: PostmanCollection = shopifyCollectionJson as unknown as PostmanCollection;

export const razorpayEnvironment: PostmanEnvironment = razorpayEnvironmentJson as unknown as PostmanEnvironment;
export const cashfreeEnvironment: PostmanEnvironment = cashfreeEnvironmentJson as unknown as PostmanEnvironment;
export const phonepeEnvironment: PostmanEnvironment = phonepeEnvironmentJson as unknown as PostmanEnvironment;
export const paytmEnvironment: PostmanEnvironment = paytmEnvironmentJson as unknown as PostmanEnvironment;
export const stripeEnvironment: PostmanEnvironment = stripeEnvironmentJson as unknown as PostmanEnvironment;
export const easyecomEnvironment: PostmanEnvironment = easyecomEnvironmentJson as unknown as PostmanEnvironment;
export const shiprocketEnvironment: PostmanEnvironment = shiprocketEnvironmentJson as unknown as PostmanEnvironment;
export const delhiveryEnvironment: PostmanEnvironment = delhiveryEnvironmentJson as unknown as PostmanEnvironment;
export const shopifyEnvironment: PostmanEnvironment = shopifyEnvironmentJson as unknown as PostmanEnvironment;

const registry: Record<
  CollectionName,
  {
    collection: PostmanCollection;
    environment: PostmanEnvironment;
    provider: string;
    docsUrl: string;
  }
> = {
  razorpay: {
    collection: razorpayCollection,
    environment: razorpayEnvironment,
    provider: 'Razorpay Payments',
    docsUrl: 'https://razorpay.com/docs/api',
  },
  cashfree: {
    collection: cashfreeCollection,
    environment: cashfreeEnvironment,
    provider: 'Cashfree Payments',
    docsUrl: 'https://docs.cashfree.com/reference',
  },
  phonepe: {
    collection: phonepeCollection,
    environment: phonepeEnvironment,
    provider: 'PhonePe PG',
    docsUrl: 'https://developer.phonepe.com/v1/reference',
  },
  paytm: {
    collection: paytmCollection,
    environment: paytmEnvironment,
    provider: 'Paytm Payment Gateway',
    docsUrl: 'https://developer.paytm.com/docs/api',
  },
  stripe: {
    collection: stripeCollection,
    environment: stripeEnvironment,
    provider: 'Stripe Global',
    docsUrl: 'https://stripe.com/docs/api',
  },
  easyecom: {
    collection: easyecomCollection,
    environment: easyecomEnvironment,
    provider: 'EasyEcom WMS & ERP',
    docsUrl: 'https://api.easyecom.com/documentation',
  },
  shiprocket: {
    collection: shiprocketCollection,
    environment: shiprocketEnvironment,
    provider: 'Shiprocket Logistics',
    docsUrl: 'https://apidocs.shiprocket.in',
  },
  delhivery: {
    collection: delhiveryCollection,
    environment: delhiveryEnvironment,
    provider: 'Delhivery Express',
    docsUrl: 'https://delhivery.com/developer',
  },
  shopify: {
    collection: shopifyCollection,
    environment: shopifyEnvironment,
    provider: 'Shopify Admin REST',
    docsUrl: 'https://shopify.dev/docs/api/admin-rest',
  },
};

/**
 * List all available collections with endpoint counts and folders.
 */
export function listCollections(): CollectionSummary[] {
  return (Object.keys(registry) as CollectionName[]).map((key) => {
    const entry = registry[key];
    const folders = entry.collection.item.map((item) => item.name);
    let requestCount = 0;
    for (const folder of entry.collection.item) {
      if (folder.item) {
        requestCount += folder.item.length;
      } else if (folder.request) {
        requestCount += 1;
      }
    }

    return {
      id: key,
      name: entry.collection.info.name,
      provider: entry.provider,
      requestCount,
      folders,
      docsUrl: entry.docsUrl,
    };
  });
}

/**
 * Get a specific Postman Collection by name.
 */
export function getCollection(name: CollectionName): PostmanCollection {
  const entry = registry[name];
  if (!entry) {
    throw new Error(`Collection "${name}" not found. Available: ${Object.keys(registry).join(', ')}`);
  }
  return entry.collection;
}

/**
 * Get a specific Postman Environment by name.
 */
export function getEnvironment(name: CollectionName): PostmanEnvironment {
  const entry = registry[name];
  if (!entry) {
    throw new Error(`Environment "${name}" not found. Available: ${Object.keys(registry).join(', ')}`);
  }
  return entry.environment;
}

/**
 * Export collection and environment files to a specified directory.
 */
export function exportToDirectory(name: CollectionName | 'all', targetDir: string = process.cwd()): string[] {
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const exportedFiles: string[] = [];
  const targets: CollectionName[] = name === 'all' ? (Object.keys(registry) as CollectionName[]) : [name];

  for (const item of targets) {
    const entry = registry[item];
    if (!entry) continue;

    const colFile = path.join(targetDir, `${item}.collection.json`);
    const envFile = path.join(targetDir, `${item}.env.json`);

    fs.writeFileSync(colFile, JSON.stringify(entry.collection, null, 2), 'utf8');
    fs.writeFileSync(envFile, JSON.stringify(entry.environment, null, 2), 'utf8');

    exportedFiles.push(colFile, envFile);
  }

  return exportedFiles;
}
