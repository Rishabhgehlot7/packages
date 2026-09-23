# @boostengine/currency

Enterprise Multi-Currency Switching, Real-Time FX Exchange Rates, Geo-IP Auto-Detection, and Psychological Price Rounding Engine for the BoostEngine ecosystem.

---

## 🌟 Key Features

- **Global Currency Engine**: Built-in definitions, ISO symbols, separators, and rules for 160+ currencies (USD, INR, EUR, GBP, AED, SAR, CAD, AUD, SGD, JPY, etc.).
- **Automatic Geo-IP & Timezone Detection**: Automatically detects visitor's country and switches to local currency without latency.
- **Dynamic FX Exchange Rates**: Flexible rate configuration, base currency switching, custom rate overrides, and live provider sync.
- **Psychological Price Rounding**: Smart charm pricing (`round_up_99`, `round_up_95`, `round_up_49`, `round_nearest_99`, `round_integer`).
- **Market & Country Pricing Overrides**: Country-specific markup buffers (e.g. +3% FX risk protection) and market rounding rules.
- **React Hooks**: `useCurrency()` for full store currency state, instant switcher dropdowns, and localized price formatting.
- **AI Agent Tools**: Convert currencies, look up exchange rates, and localize pricing inside customer chatbots.
- **CLI Utility**: `boost-currency` for running conversions, checking rates, and testing country detection.

---

## 📦 Installation

```bash
npm install @boostengine/currency
```

---

## 🚀 Quick Start

### 1. Backend / Node.js Usage

```typescript
import { CurrencyEngine } from '@boostengine/currency';

const engine = new CurrencyEngine({
  baseCurrency: 'INR',
  defaultRounding: 'round_up_99'
});

// Convert 2499 INR to USD with .99 charm rounding
const converted = engine.convert(2499, 'INR', 'USD', {
  rounding: 'round_up_99'
});

console.log(converted.formatted); // "$30.99"
console.log(converted.convertedAmount); // 30.99
```

### 2. React Storefront Hook

```tsx
import { useCurrency } from '@boostengine/currency/react';

function HeaderCurrencySwitcher() {
  const {
    currentCurrency,
    switchCurrency,
    availableCurrencies,
    formatPrice,
    convertPrice
  } = useCurrency({
    baseCurrency: 'INR',
    autoDetectGeo: true
  });

  return (
    <select
      value={currentCurrency}
      onChange={(e) => switchCurrency(e.target.value)}
    >
      {availableCurrencies.map((c) => (
        <option key={c.code} value={c.code}>
          {c.code} ({c.symbol})
        </option>
      ))}
    </select>
  );
}
```

---

## 🛠️ CLI Usage

```bash
# Interactive demo
npx boost-currency demo

# Convert price
npx boost-currency convert 2499 --from INR --to USD

# Country detection
npx boost-currency detect AE
```

---

## 📄 License

MIT © BoostEngine Team
