# Theming & Design Tokens Guide

`@boostengine/ui` ships with a comprehensive, production-grade token system designed for total flexibility. You can use it out of the box with zero configuration, synchronize with Figma via standard Design Tokens JSON, or integrate directly with Tailwind CSS.

---

## 1. Design Tokens Export

### Design Tokens JSON (`tokens.json`)
The token structure is fully compatible with [Tokens Studio for Figma](https://tokens.studio/) and [Style Dictionary](https://amzn.github.io/style-dictionary/).

```json
{
  "color": {
    "primary": { "value": "hsl(221.2 83.2% 53.3%)", "type": "color" },
    "background": { "value": "hsl(0 0% 100%)", "type": "color" }
  },
  "spacing": {
    "4": { "value": "1rem", "type": "spacing" }
  },
  "borderRadius": {
    "md": { "value": "0.375rem", "type": "borderRadius" }
  }
}
```

You can import the raw token JSON directly in your tooling or pipelines:

```typescript
import tokens from '@boostengine/ui/tokens.json';
// Or TypeScript object:
import { boostTokens } from '@boostengine/ui';
```

---

## 2. Tailwind CSS Integration

`@boostengine/ui` provides a dedicated preset generator `createTailwindPreset()` that maps our CSS variables directly into Tailwind utility classes (`bg-boost-primary`, `text-boost-card-foreground`, etc.):

### `tailwind.config.js`
```javascript
const { createTailwindPreset } = require('@boostengine/ui');

/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [createTailwindPreset()],
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/@boostengine/ui/dist/**/*.{js,mjs}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

This gives you full access to tokens in utility classes:
- Backgrounds: `bg-boost-background`, `bg-boost-card`, `bg-boost-primary`, `bg-boost-muted`
- Text: `text-boost-foreground`, `text-boost-primary`, `text-boost-destructive`
- Borders: `border-boost-border`, `border-boost-input`
- Radii: `rounded-boost-sm`, `rounded-boost-md`, `rounded-boost-lg`, `rounded-boost-full`

---

## 3. BoostProvider & Dynamic Theming

Wrap your app with `BoostProvider` to manage color modes (`light`, `dark`, `system`) and custom brand tokens:

```tsx
import React from 'react';
import { BoostProvider } from '@boostengine/ui';

export function App() {
  return (
    <BoostProvider
      defaultTheme="system"
      storageKey="my-app-theme"
      theme={{
        colors: {
          primary: 'hsl(262.1 83.3% 57.8%)', // Custom purple brand color
          primaryHover: 'hsl(262.1 83.3% 50%)',
          primaryForeground: 'hsl(210 40% 98%)',
        },
        radius: {
          md: '0.75rem',
        },
      }}
    >
      <MainContent />
    </BoostProvider>
  );
}
```

### Theme Switching Hook: `useTheme`
```tsx
import { useTheme } from '@boostengine/ui';

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  return (
    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      Current mode: {resolvedTheme}
    </button>
  );
}
```

---

## 4. CSS Variables Reference

All CSS variables are prefixed with `--boost-` to prevent collisions with existing stylesheets:

| CSS Variable | Light Default | Dark Default | Purpose |
|---|---|---|---|
| `--boost-background` | `hsl(0 0% 100%)` | `hsl(222.2 84% 4.9%)` | Root application background |
| `--boost-foreground` | `hsl(222.2 84% 4.9%)` | `hsl(210 40% 98%)` | Primary body typography |
| `--boost-card` | `hsl(0 0% 100%)` | `hsl(222.2 84% 4.9%)` | Card & container surfaces |
| `--boost-card-foreground` | `hsl(222.2 84% 4.9%)` | `hsl(210 40% 98%)` | Text inside card surfaces |
| `--boost-primary` | `hsl(221.2 83.2% 53.3%)` | `hsl(217.2 91.2% 59.8%)` | Primary action color |
| `--boost-primary-foreground`| `hsl(210 40% 98%)` | `hsl(222.2 47.4% 11.2%)`| Text on primary buttons |
| `--boost-destructive` | `hsl(0 84.2% 60.2%)` | `hsl(0 62.8% 30.6%)` | Errors & danger actions |
| `--boost-border` | `hsl(214.3 31.8% 91.4%)`| `hsl(217.2 32.6% 17.5%)`| Component border lines |
| `--boost-ring` | `hsl(221.2 83.2% 53.3%)` | `hsl(224.3 76.3% 48%)` | Keyboard focus ring |
| `--boost-radius` | `0.375rem` | `0.375rem` | Default border radius |

---

## 5. Style Overrides & Customization

You can override component styling at three different levels of specificity:

1. **Global CSS Variables**:
   ```css
   :root {
     --boost-radius: 0.75rem;
     --boost-primary: 142 76% 36%; /* Forest Green */
   }
   ```
2. **Provider Theme Prop**:
   Pass a typed `theme` object to `<BoostProvider theme={...} />`.
3. **Component `className` and `style` Props**:
   All components accept standard `className` and `style` props with merging priority.
