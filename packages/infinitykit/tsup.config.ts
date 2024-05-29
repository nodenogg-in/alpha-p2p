/// <reference types="node" />

import { exec } from 'node:child_process'
import { defineConfig } from 'tsup'

const env = process.env.NODE_ENV
const isDev = env === 'development'

export default defineConfig({
  entry: {
    index: 'src/index.ts'
  },
  dts: true,
  splitting: false,
  format: ['esm'],
  sourcemap: true,
  target: 'es2022',
  watch: isDev,
  clean: true,
  external: ['@figureland/statekit', '@figureland/mathkit', 'superjson', '@figureland/typekit', '@figureland/toolkit'],
  onSuccess: async () => {
    if (isDev) {
      exec('tsc --emitDeclarationOnly --declaration')
    }
  }
})
