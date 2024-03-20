const env = process.env.NODE_ENV

import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    views: 'src/views/index.ts',
  },
  dts: true,
  format: ['esm'],
  splitting: true,
  sourcemap: true,
  target: 'es2020',
  watch: env === 'development',
  clean: true
})
