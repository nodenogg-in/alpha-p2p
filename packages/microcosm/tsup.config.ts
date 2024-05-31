/// <reference types="node" />

import { exec } from 'node:child_process'
import { defineConfig } from 'tsup'

const env = process.env.NODE_ENV

const isDev = env === 'development'

export default defineConfig({
  entry: {
    index: 'src/index.ts'
  },
  splitting: false,
  dts: true,
  format: ['esm'],
  sourcemap: true,
  target: 'es2022',
  watch: isDev,
  clean: true,
  external: ['@figureland/infinitykit', '@figureland/statekit', '@figureland/typekit'],
  onSuccess: async () => {
    if (isDev) {
      exec('tsc --emitDeclarationOnly --declaration')
    }
  }
})
