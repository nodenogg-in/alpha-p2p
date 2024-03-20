const env = process.env.NODE_ENV

import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  dts: true,
  format: ['esm'],
  splitting: true,
  sourcemap: true,
  target: 'es2020',
  watch: env === 'development',
  clean: true
})
