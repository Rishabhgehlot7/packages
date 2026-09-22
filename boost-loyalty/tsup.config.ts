import { defineConfig } from 'tsup';

export default defineConfig([
  // Entry 1: Main (Node + universal)
  {
    entry:       { index: 'src/index.ts' },
    format:      ['cjs', 'esm'],
    dts:         true,
    clean:       true,
    sourcemap:   false,
    external:    ['react'],
  },
  // Entry 2: React suite
  {
    entry:       { react: 'src/react/index.tsx' },
    format:      ['cjs', 'esm'],
    dts:         true,
    sourcemap:   false,
    external:    ['react'],
  },
  // Entry 3: AI Agent Toolkit
  {
    entry:       { agent: 'src/agent.ts' },
    format:      ['cjs', 'esm'],
    dts:         true,
    sourcemap:   false,
    external:    ['react'],
  },
]);
