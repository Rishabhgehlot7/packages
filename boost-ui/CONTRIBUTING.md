# Contributing to @boostengine/ui

Thank you for considering contributing to `@boostengine/ui`! This is an open, community-driven component library and we welcome all kinds of contributions — from bug reports and feature requests to documentation improvements and new components.

---

## Table of Contents
- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Adding a New Component](#adding-a-new-component)
- [Component Standards](#component-standards)
- [Testing](#testing)
- [Submitting a Pull Request](#submitting-a-pull-request)

---

## Code of Conduct

Be respectful, inclusive, and constructive. We are building a tool that developers across the world rely on.

---

## Getting Started

### Prerequisites
- Node.js >= 18
- npm >= 9 or pnpm >= 8

### Setup
```bash
# Clone the repo
git clone https://github.com/boostengine/boostengine.git
cd boostengine/packages/boost-ui

# Install dependencies
npm install

# Build the package
npm run build

# Run tests
npm test
```

---

## Development Workflow

```bash
# Build (watch mode not yet available, run manually)
npm run build

# Run test suite against built output
npm test

# Build + test (runs prepublishOnly)
npm run prepublishOnly
```

All build output goes to the `dist/` directory. The build pipeline:
1. **TypeScript compilation** via `tsup` → generates CJS + ESM + type declarations
2. **`'use client'` banner** injected into both CJS and ESM outputs (for Next.js App Router compatibility)

---

## Adding a New Component

### 1. Create the component file
Place new components in `src/components/YourComponent.tsx`:

```tsx
'use client';

import * as React from 'react';

export interface YourComponentProps {
  // Props here — use consistent naming conventions (see below)
}

/**
 * YourComponent — Brief description of what it does.
 *
 * @example
 * <YourComponent prop="value" />
 */
export const YourComponent: React.FC<YourComponentProps> = ({ ...props }) => {
  return (
    <div>
      {/* Implementation */}
    </div>
  );
};
```

### 2. Export from `src/index.ts`
Add to the appropriate category section in `src/index.ts`:

```ts
export { YourComponent } from './components/YourComponent';
export type { YourComponentProps } from './components/YourComponent';
```

### 3. Document in `llms-full.txt`
Add a usage example and prop table to `llms-full.txt`.

### 4. Update `llms.txt`
Add the component name to the appropriate category list in `llms.txt`.

### 5. Add a test
Add a `assertExport('YourComponent')` check in the relevant test section of `test-suite.cjs`.

### 6. Update CLI list
Add the component to the appropriate category in `bin/cli.cjs`.

### 7. Update `CHANGELOG.md`
Add an entry under the next `[Unreleased]` section.

---

## Component Standards

### Naming Conventions
All components must follow these naming conventions to ensure zero-hallucination by AI coding agents:

| Type | Convention |
|------|-----------|
| Open/visible state | `isOpen` (NOT `open`, `show`, `visible`) |
| Loading state | `isLoading` or `loading` |
| Disabled | `disabled` (standard HTML attribute) |
| Close callback | `onClose` |
| Select callback | `onSelect` |
| Submit callback | `onSubmit` |
| Change callback | `onChange` |
| Variants | `'primary' \| 'secondary' \| 'outline' \| 'ghost' \| 'destructive'` |
| Sizes | `'sm' \| 'md' \| 'lg' \| 'xl'` |
| Action objects | `{ label: string, onClick?: () => void, href?: string }` |
| Brand name prop | `brandName` |

### Architecture Requirements
1. **Zero external CSS** — No Tailwind, PostCSS, or any CSS file imports.
2. **Inline styles + CSS variables** — Use `var(--boost-*)` tokens from `BoostProvider`.
3. **SSR compatible** — Wrap browser-only code in `useEffect` or check `typeof window`.
4. **`'use client'` directive** — Add to the top of every file that uses React hooks or event handlers.
5. **`React.forwardRef`** — All form elements and interactive wrappers must support `ref` forwarding.
6. **TypeScript strict** — All props must be explicitly typed. No `any`.
7. **displayName** — Set `ComponentName.displayName = 'ComponentName'` on all components.

### Styling Pattern
```tsx
// ✅ Correct — CSS variable + inline style
const styles: React.CSSProperties = {
  backgroundColor: 'var(--boost-surface)',
  color: 'var(--boost-text)',
  borderRadius: 'var(--boost-radius)',
  border: '1px solid var(--boost-border)',
};

// ❌ Wrong — hardcoded colors or Tailwind classes
const styles = { backgroundColor: '#ffffff' };
<div className="bg-white rounded-lg border" />
```

---

## Testing

Tests run against the **built** output (`dist/index.cjs`), not source files.

```bash
# Build first, then test
npm run build
npm test
```

The test suite (`test-suite.cjs`) covers:
- Build artifact existence (CJS, ESM, DTS)
- `'use client'` banner presence
- TypeScript declaration exports
- All 113 component exports
- All 11 utility hooks
- All 18 utility functions (with functional assertions)
- Export count sanity check
- Package.json field validation

**All 20 test suites must pass before submitting a PR.**

---

## Submitting a Pull Request

1. **Fork** the repository and create a feature branch: `feat/your-component-name`
2. **Implement** your changes following the Component Standards above
3. **Build** the package: `npm run build`
4. **Test** your changes: `npm test`
5. **Update** `CHANGELOG.md` under `[Unreleased]`
6. **Open a PR** with a clear description of what was added/changed and why

### PR Checklist
- [ ] Component follows naming conventions
- [ ] Exported from `src/index.ts` (component + types)
- [ ] Documented in `llms-full.txt`
- [ ] Added to `llms.txt` category list
- [ ] Test added to `test-suite.cjs`
- [ ] CLI list updated in `bin/cli.cjs`
- [ ] `CHANGELOG.md` updated
- [ ] `npm run build && npm test` passes ✅

---

## Reporting Issues

Open an issue on [GitHub Issues](https://github.com/boostengine/boostengine/issues) with:
- A clear description of the bug or feature request
- A minimal code reproduction (for bugs)
- Expected vs. actual behavior

---

Thank you for helping make `@boostengine/ui` the best universal React component library! 🚀
