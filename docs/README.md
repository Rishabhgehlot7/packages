# ⚡ BoostEngine Ecosystem Documentation Portal

A high-performance, Mintlify/Stripe-inspired documentation portal for all 24+ **@boostengine** decoupled micro-packages and **@boostengine/ui** v2.0.0 universal component suite.

Built with **Vite + React 19 + TypeScript** with zero external UI bloat.

---

## 📦 Installed Official Packages

All components are imported directly from the official NPM package:
- [`@boostengine/ui` on NPM](https://www.npmjs.com/package/@boostengine/ui)

```json
"dependencies": {
  "@boostengine/ui": "^2.0.0",
  "lucide-react": "^1.16.0",
  "react": "^19.2.0",
  "react-dom": "^19.2.0"
}
```

---

## 🚀 Quickstart

1. Navigate to the `docs` directory:
   ```bash
   cd docs
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the local development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ✨ Features Included

- **Universal Multi-Theme Presets Engine (7 Presets)**:
  - System-wide switching across `minimal`, `glassmorphism`, `neumorphism`, `neo-brutalism`, `dark-first`, `gradient-glow`, and `material-you`.
  - Interactive `PresetSwitcher` dropdown and pill selector widgets.
- **Component Suite (121+ Components)**:
  - Live interactive rendering of `CartDrawer`, `DataTable`, `PresetSwitcher`, `PincodeChecker`, `ProductCard`, `FrequentlyBoughtTogether`, `AssuredBadge`, `OrderTimeline`, and 110+ more.
  - Interactive state controls, live previews, and desktop vs mobile canvas toggles.
  - 1-Click copy-paste ready TypeScript/JSX code snippets.
  - Component CLI commands: `npx boost-ui add <component>`.
  - Props specification tables with defaults and types.
- **Enterprise Data Grid**:
  - `DataTable` with multi-row checkbox selection, column sorting, sticky headers, and 1-click CSV export.
- **Design Tokens & Tailwind Integration**:
  - Full compatibility with Figma Tokens Studio & Style Dictionary via `tokens.json` and `createTailwindPreset()`.
- **Asynchronous Toast Lifecycle**:
  - `toast.promise` support transitioning smoothly from loading spinner to success or error alerts.
- **Complete Documentation for all 24 Micro-Packages**: Full API signatures, TypeScript interfaces, and Next.js / React copy-paste examples.
- **Global Instant Search (`Ctrl + K` / `Cmd + K`)**: Fuzzy search across packages, UI components, methods, and topics.
- **Live D2C Interactive Playground**:
  - Intra-State vs Inter-State Indian GST Tax Calculator (CGST + SGST vs IGST).
  - Best Coupon auto-evaluator (`@boostengine/coupons`).
  - Flipkart SuperCoins style loyalty reward simulator (`@boostengine/loyalty`).
- **Shopper Journey Architecture View**: Interactive 6-stage blueprint connecting discovery, cart, payments, logistics, and post-purchase returns.
