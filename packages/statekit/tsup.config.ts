/// <reference types="node" />

import { exec } from 'node:child_process'
import { defineConfig } from 'tsup'

const env = process.env.NODE_ENV

const isDev = env === 'development'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'vue/index': 'src/vue.ts',
    'react/index': 'src/react.ts',
    'svelte/index': 'src/svelte.ts'
  },
  external: ['@nodenogg.in/toolkit'],
  splitting: true,
  dts: false,
  format: ['esm'],
  sourcemap: true,
  target: 'es2022',
  watch: isDev,
  clean: true,
  onSuccess: async () => {
    if (isDev) {
      exec('tsc --emitDeclarationOnly --declaration')
    }
  }
})
