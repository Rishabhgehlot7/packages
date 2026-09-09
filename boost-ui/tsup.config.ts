import { defineConfig } from 'tsup';
import fs from 'fs';
import path from 'path';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  sourcemap: true,
  splitting: false,
  treeshake: true,
  target: 'es2020',
  external: ['react', 'react-dom'],
  outDir: 'dist',
  outExtension({ format }) {
    return {
      js: format === 'cjs' ? '.cjs' : '.mjs',
    };
  },
  async onSuccess() {
    const files = ['dist/index.cjs', 'dist/index.mjs'];
    for (const f of files) {
      const fullPath = path.resolve(__dirname, f);
      if (fs.existsSync(fullPath)) {
        const content = fs.readFileSync(fullPath, 'utf8');
        if (!content.startsWith('"use client"') && !content.startsWith("'use client'")) {
          fs.writeFileSync(fullPath, `'use client';\n` + content);
        }
      }
    }
  },
});
