import { defineConfig } from 'tsup';

export default defineConfig([
  {
    // Main entry: exports core + AI
    entry: ['src/index.ts'],
    format: ['cjs', 'esm'],
    dts: true,
    clean: true,
    sourcemap: true,
    splitting: false,
    treeshake: true,
    target: 'es2020',
    outDir: 'dist',
    outExtension({ format }) {
      return { js: format === 'cjs' ? '.cjs' : '.mjs' };
    },
  },
  {
    // React entry: exports React components & hooks with 'use client' directive.
    // NOTE: treeshake is disabled here because tsup's treeshake path (ESM-first +
    // rollup CJS conversion) strips the `'use client'` directive from the output.
    // React is already external, so the bundle is tiny and tree-shaking is a no-op.
    entry: { 'react/index': 'src/react/index.ts' },
    format: ['cjs', 'esm'],
    dts: true,
    sourcemap: true,
    splitting: false,
    treeshake: false,
    external: ['react'],
    target: 'es2020',
    outDir: 'dist',
    outExtension({ format }) {
      return { js: format === 'cjs' ? '.cjs' : '.mjs' };
    },
  },
  {
    // AI entry: standalone AI module
    entry: { 'ai/index': 'src/ai/index.ts' },
    format: ['cjs', 'esm'],
    dts: true,
    sourcemap: true,
    splitting: false,
    treeshake: true,
    target: 'es2020',
    outDir: 'dist',
    outExtension({ format }) {
      return { js: format === 'cjs' ? '.cjs' : '.mjs' };
    },
  },
]);
