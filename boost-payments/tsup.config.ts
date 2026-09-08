import { defineConfig } from 'tsup';
import fs from 'fs';
import path from 'path';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    react: 'src/react/index.ts',
  },
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  sourcemap: true,
  splitting: false,
  treeshake: true,
  external: ['react', 'react-dom'],
  target: 'es2020',
  outDir: 'dist',
  outExtension({ format }) {
    return {
      js: format === 'cjs' ? '.cjs' : '.mjs',
    };
  },
  async onSuccess() {
    const distDir = path.resolve(__dirname, 'dist');
    for (const file of ['react.cjs', 'react.mjs']) {
      const p = path.join(distDir, file);
      if (fs.existsSync(p)) {
        const content = fs.readFileSync(p, 'utf8');
        if (!content.startsWith("'use client';") && !content.startsWith('"use client";')) {
          fs.writeFileSync(p, `'use client';\n${content}`, 'utf8');
        }
      }
    }
  },
});
