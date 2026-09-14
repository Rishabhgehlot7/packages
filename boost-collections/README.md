# @boostengine/collections 📮

[![npm version](https://img.shields.io/npm/v/@boostengine/collections.svg?style=flat-square&color=blue)](https://www.npmjs.com/package/@boostengine/collections)
[![npm downloads](https://img.shields.io/npm/dm/@boostengine/collections.svg?style=flat-square&color=green)](https://www.npmjs.com/package/@boostengine/collections)
[![license](https://img.shields.io/npm/l/@boostengine/collections.svg?style=flat-square)](https://github.com/boostengine/boostengine/blob/main/LICENSE)
[![Postman](https://img.shields.io/badge/Postman%20Schema-v2.1.0-orange.svg?style=flat-square)](https://www.postman.com/)

> **Pre-built, production-ready Postman Collections (Schema v2.1.0) and Environments for Indian and global eCommerce APIs: Razorpay, Cashfree, PhonePe, Paytm, Stripe, EasyEcom WMS, Shiprocket, Delhivery, and Shopify.**

Test endpoints, simulate webhook payloads, and verify signatures in Postman with zero manual JSON schema authoring.

---

## 📸 Postman Workspace Hierarchy Preview

```text
  Postman Collections (@boostengine/collections)
  ├── 💳 Payment Gateways
  │   ├── [POST] Cashfree - Create Order Token (UPI / Intent)
  │   ├── [POST] Razorpay - Create Standard Order
  │   ├── [POST] PhonePe - Check Payment Status
  │   ├── [POST] Stripe - Create PaymentIntent
  │   └── [POST] Webhooks - Simulate PAYMENT_SUCCESS
  ├── 🚚 Logistics & Courier APIs
  │   ├── [GET]  Shiprocket - Pincode Serviceability & Rate Check
  │   ├── [POST] Delhivery - Generate AWB & Schedule Pickup
  │   └── [GET]  Unified Tracking - Multi-Hub Checkpoints
  └── 📦 WMS & Multi-Channel Inventory
      ├── [POST] EasyEcom - Stock Sync by SKU
      └── [GET]  Shopify Storefront - Catalog Graph Query
```

---

## 🌟 Key Highlights

- **🎯 1-Click Postman Import**: Import pre-configured collections with dynamic test scripts and pre-request HMAC hashing scripts.
- **🔐 Environment Variables**: Includes `.postman_environment.json` templates with sandboxes and production endpoints.
- **⚡ Webhook Simulators**: Pre-configured mock payloads for simulating real-world gateway events.
- **🛠️ Programmatic Access**: Inspect and export schemas directly inside Node.js scripts or CI/CD pipelines.

---

## 📦 Installation

```bash
# npm
npm install @boostengine/collections

# pnpm
pnpm add @boostengine/collections

# yarn
yarn add @boostengine/collections
```

---

## 🚀 Quickstart Guide

### 1. Export Collections to Your Local Workspace via CLI

```bash
# Export all collections into a ./postman folder
npx @boostengine/collections export ./postman

# List all available collection schemas
npx @boostengine/collections list
```

---

### 2. Programmatic Node.js Usage

```typescript
import { getCollection, getEnvironment, listCollections } from '@boostengine/collections';

// List all available API collections
console.log(listCollections()); 
// ['razorpay', 'cashfree', 'phonepe', 'shiprocket', 'delhivery', 'easyecom']

// Get the Cashfree Postman JSON
const cashfreeCollection = getCollection('cashfree');
console.log(cashfreeCollection.info.name); // "Cashfree Payment Gateway"
```

---

## 📄 License

MIT © [Boost Engine](https://github.com/boostengine)
