import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  clean: true,
  dts: true,
  format: ['esm'],
  banner: {
    js: '#!/usr/bin/env node'
  },
  sourcemap: true,
  target: 'node22'
});
