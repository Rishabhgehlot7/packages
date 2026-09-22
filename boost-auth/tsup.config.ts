import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    client: 'src/client/index.ts',
    adapters: 'src/adapters/index.ts',
    providers: 'src/providers/index.ts',
    agent: 'src/agent.ts',
  },
  format: ['cjs', 'esm'],
  dts: true,
  clean: false,
  sourcemap: true,
  splitting: false,
  treeshake: true,
  target: 'es2020',
  outDir: 'dist',
  outExtension({ format }) {
    return {
      js: format === 'cjs' ? '.cjs' : '.mjs',
    };
  },
});
