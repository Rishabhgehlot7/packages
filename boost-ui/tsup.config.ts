import { defineConfig } from 'tsup';
import fs from 'fs';
import path from 'path';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'hooks/index': 'src/hooks/index.ts',
    'utils/index': 'src/utils/index.ts',
    'tokens/index': 'src/tokens/index.ts',
    'next/index': 'src/next/index.tsx',
    'web/index': 'src/web/index.ts',
    'vite/index': 'src/vite/index.ts',
    'vue/index': 'src/vue/index.ts',
    'svelte/index': 'src/svelte/index.ts',
    'solid/index': 'src/solid/index.ts',
    'angular/index': 'src/angular/index.ts',
    'qwik/index': 'src/qwik/index.ts',
    'native/index': 'src/native/index.ts',
  },
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  sourcemap: false,
  splitting: true,
  treeshake: true,
  target: 'es2020',
  external: [
    'react',
    'react-dom',
    'next',
    'vue',
    'svelte',
    'solid-js',
    '@angular/core',
    'rxjs',
    'rxjs/operators',
    '@builder.io/qwik',
    'react-native',
    'vite',
  ],
  outDir: 'dist',
  outExtension({ format }) {
    return { js: format === 'cjs' ? '.cjs' : '.mjs' };
  },
  async onSuccess() {
    // Copy static styles.css and tokens.json to dist
    const srcCss = path.resolve(__dirname, 'src/styles.css');
    const distCss = path.resolve(__dirname, 'dist/styles.css');
    if (fs.existsSync(srcCss)) fs.copyFileSync(srcCss, distCss);
    const srcTokens = path.resolve(__dirname, 'src/tokens.json');
    const distTokens = path.resolve(__dirname, 'dist/tokens.json');
    if (fs.existsSync(srcTokens)) fs.copyFileSync(srcTokens, distTokens);

    function processDir(dir: string) {
      if (!fs.existsSync(dir)) return;
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          processDir(full);
        } else if (entry.name.endsWith('.cjs') || entry.name.endsWith('.mjs')) {
          if (!full.includes('utils') && !full.includes('tokens') && !full.includes('vite')) {
            const content = fs.readFileSync(full, 'utf8');
            if (!content.startsWith('"use client"') && !content.startsWith("'use client'")) {
              fs.writeFileSync(full, `'use client';\n` + content);
            }
          }
        }
      }
    }
    processDir(path.resolve(__dirname, 'dist'));
  },
});


