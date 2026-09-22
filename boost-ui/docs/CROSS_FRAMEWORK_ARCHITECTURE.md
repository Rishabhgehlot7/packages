# BoostEngine Cross-Framework Architecture

## 🎯 Vision

**"One token system — Every framework, Every platform"**

## 🏗 Architecture Overview

```
┌──────────────────────────────────────────────────────────────────┐
│                   @boostengine/tokens (Pure)                     │
│                                                                  │
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────────┐ │
│  │  CSS Variables   │  │  JS Token Map    │  │  Theme Engine    │ │
│  │  :root { ... }   │  │  { primary:      │  │  light/dark/    │ │
│  │  @media (dark)   │  │    "#2563eb" }    │  │  system resolve │ │
│  └─────────────────┘  └─────────────────┘  └──────────────────┘ │
│         ↕                      ↕                     ↕           │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │              Framework Adapter Layer                        │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐ │  │
│  │  │ React    │ │ Vue      │ │ Svelte   │ │ Solid        │ │  │
│  │  │ v18/19  │ │ 3/4      │ │ 5        │ │ 1.x          │ │  │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────────┘ │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐ │  │
│  │  │ Preact   │ │ Angular  │ │ Lit      │ │ Web          │ │  │
│  │  │          │ │ 17/18    │ │          │ │ Components   │ │  │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────────┘ │  │
│  └────────────────────────────────────────────────────────────┘  │
│         ↕                      ↕                     ↕           │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │              Platform-Specific Optimizations                │  │
│  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────────┐   │  │
│  │  │ @boostengine │ │ @boostengine │ │ @boostengine      │   │  │
│  │  │ /next        │ │ /vite        │ │ /native           │   │  │
│  │  │ RSC, SSR     │ │ HMR, Plugin │ │ RN, Expo         │   │  │
│  │  └──────────────┘ └──────────────┘ └──────────────────┘   │  │
│  └────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
```
## 📦 Package Structure

```
@boostengine/
├── tokens/                  # Core — Framework-independent
│   ├── index.ts             # JS token map + types
│   ├── colors.ts            # Color scales (50..900)
│   ├── spacing.ts           # Spacing scale
│   ├── shadows.ts           # Shadow definitions
│   └── css/                 # Static CSS files
│       ├── tokens.css       # :root variables
│       ├── tokens-dark.css  # [data-theme="dark"] vars
│       └── presets.css      # Style preset CSS
│
├── react/                   # React adapter (current package)
│   ├── components/          # React components
│   ├── hooks/               # useTheme, useDesignTokens, etc.
│   └── index.ts
│
├── vue/                     # Vue adapter (future)
│   ├── components/
│   ├── composables/
│   │   ├── useTheme.ts
│   │   ├── useTokens.ts
│   │   └── usePreset.ts
│   └── index.ts
│
├── svelte/                  # Svelte adapter (future)
│   ├── components/
│   ├── stores/
│   │   ├── theme.ts
│   │   ├── tokens.ts
│   │   └── preset.ts
│   └── index.ts
│
├── solid/                   # Solid adapter (future)
│   ├── components/
│   ├── signals/
│   └── index.ts
│
├── next/                    # Next.js optimization (future)
│   ├── providers/
│   │   ├── BoostProvider.tsx         # 'use client' wrapper
│   │   └── BoostProvider.server.tsx  # RSC-compatible
│   ├── plugins/
│   │   └── inject-tokens.js          # Webpack/RSC plugin
│   └── index.ts
│
├── vite/                    # Vite optimization (future)
│   ├── plugin.ts            # Vite plugin for CSS injection
│   └── index.ts
│
└── native/                  # React Native (future)
    ├── tokens.ts            # Platform-specific values
    ├── components/          # Native components
    └── index.ts
```

## 🔄 Theme Flow (All Frameworks)

```
User App → Theme Engine (resolves mode) → Framework Adapter → Components → var(--boost-*)
```

**React:** Context API | **Vue:** `provide()` / `inject()` | **Svelte:** Writable store | **Solid:** Signals | **Web:** data-attributes

## 🧩 Web Components Path

For universal cross-framework support, core components can use **Lit** Web Components:

```html
<!-- Works in any framework -->
<boost-button variant="primary">Click</boost-button>
<boost-card hoverable>
  <boost-card-title>Hello</boost-card-title>
</boost-card>
```

## 📱 React Native Path

CSS variables don't exist in React Native → use JS token context instead:

```tsx
const { tokens } = useDesignTokens();
return <View style={{ backgroundColor: tokens.surface }} />;
```

## 🚀 Migration Priority

| Phase | Package | Effort | Timeline |
|-------|---------|--------|----------|
| 1 | `@boostengine/tokens` (extract) | Small | Week 1 |
| 2 | Vue adapter (`@boostengine/vue`) | Medium | Week 2-3 |
| 3 | Svelte adapter (`@boostengine/svelte`) | Medium | Week 3-4 |
| 4 | Next.js plugin (`@boostengine/next`) | Small | Week 4 |
| 5 | React Native (`@boostengine/native`) | Large | Week 5-6 |
| 6 | Web Components (`@boostengine/web`) | Large | Week 6-8 |
| 7 | Vite plugin (`@boostengine/vite`) | Small | Week 8 |
| 8 | Solid / Preact adapters | Medium | Week 9-10 |

## 💡 Key Principles

1. **CSS Variables First** — Zero runtime cost, every framework can use them
2. **Thin Adapters** — ~2KB gzip per framework adapter
3. **Tree-shakeable** — Import only what you use
4. **SSR-safe** — Works with Next.js, Nuxt, SvelteKit, Remix
5. **Zero Dependencies** — Tokens package has 0 npm dependencies
6. **Backward Compatible** — Current `@boostengine/ui` users don't need changes