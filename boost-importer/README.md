# @boostengine/importer

> Enterprise high-throughput CSV, XLSX & JSON catalog importer/exporter with auto-schema detection for Shopify, WooCommerce, Magento, and custom feeds.

[![npm version](https://img.shields.io/npm/v/@boostengine/importer.svg)](https://www.npmjs.com/package/@boostengine/importer)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## ⚡ Features

- **🔄 Multi-Platform Auto-Detection**:
  - Automatically identifies **Shopify CSV**, **WooCommerce CSV**, **Magento CSV**, or generic CSV based on column headers.
- **📦 Complex Variant Matrix Reconstruction**:
  - Automatically groups multi-row variant handles (e.g. Size `S`, `M`, `L` × Color `Black`, `Navy`) into unified parent products with variant matrices.
- **🚀 RFC 4180 Compliant Stream Parsing**:
  - Safely handles escaped quotes, embedded commas, and multiline HTML product descriptions.
- **📤 Export Engine**:
  - Export database products to standard Shopify-compatible CSV format for seamless multi-channel catalog syncing.
- **🤖 Autonomous AI Agent Tools**:
  - Pre-built LLM tools to parse uploaded catalog files and validate schema errors before inserting into database.

---

## 📦 Installation

```bash
npm install @boostengine/importer
# or
pnpm add @boostengine/importer
# or
yarn add @boostengine/importer
```

---

## 🚀 Quick Start (Node.js / Express / Next.js API)

```typescript
import { importCatalogFromCsv, exportCatalogToCsv } from '@boostengine/importer';

// 1. Import from CSV
const csvData = `Handle,Title,Body (HTML),Type,Variant SKU,Variant Price,Variant Inventory Qty,Option1 Name,Option1 Value
oversized-tee,Oversized Tee,<p>100% Pure Cotton</p>,Apparel,TEE-BLK-M,999.00,50,Size,M
oversized-tee,Oversized Tee,<p>100% Pure Cotton</p>,Apparel,TEE-BLK-L,999.00,30,Size,L`;

const result = importCatalogFromCsv(csvData);

console.log(result.platform);        // "shopify"
console.log(result.productsCreated); // 1 parent product
console.log(result.variantsCreated); // 2 child variants

// 2. Export to CSV
const exportedCsv = exportCatalogToCsv(result.products);
console.log(exportedCsv);
```

---

## 📄 License

MIT © [BoostEngine Team](https://github.com/boostengine)
