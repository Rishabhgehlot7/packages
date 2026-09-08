import { defineConfig } from 'tsup';
import fs from 'fs';
import path from 'path';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  minify: true,
  sourcemap: true,
  treeshake: true,
  external: ['react', 'react-dom'],
  outExtension({ format }) {
    return {
      js: format === 'cjs' ? '.cjs' : '.mjs',
    };
  },
  async onSuccess() {
    const distDir = path.resolve(__dirname, 'dist');
    for (const file of ['index.cjs', 'index.mjs', 'index.js']) {
      const p = path.join(distDir, file);
      if (fs.existsSync(p)) {
        const content = fs.readFileSync(p, 'utf8');
        if (!content.startsWith("'use client';") && !content.startsWith('"use client";')) {
          fs.writeFileSync(p, `'use client';\n` + content);
        }
      }
    }
  },
});
