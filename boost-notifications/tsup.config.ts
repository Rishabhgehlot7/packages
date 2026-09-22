import { defineConfig } from 'tsup';
export default defineConfig([
  { entry: { index: 'src/index.ts' }, format: ['cjs','esm'], dts: true, clean: true, external: ['react'] },
  { entry: { react: 'src/react/index.tsx' }, format: ['cjs','esm'], dts: true, external: ['react'] },
  { entry: { agent: 'src/notif-agent.ts' }, format: ['cjs','esm'], dts: true, external: ['react'] },
]);

