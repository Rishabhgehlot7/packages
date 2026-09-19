import { defineConfig } from 'tsup';
import fs from 'fs';
import path from 'path';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'hooks/index': 'src/hooks/index.ts',
    'utils/index': 'src/utils/index.ts',
  },
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
    function processDir(dir: string) {
      if (!fs.existsSync(dir)) return;
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          processDir(full);
        } else if (entry.name.endsWith('.cjs') || entry.name.endsWith('.mjs')) {
          // Add 'use client' for index and hooks
          if (!full.includes('utils')) {
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
