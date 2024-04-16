/// <reference types="node" />

import { exec } from 'node:child_process'
import { defineConfig } from 'tsup'

const env = process.env.NODE_ENV

const isDev = env === 'development'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'ui/device': 'src/ui/device.ts',
    'ui/filedrop': 'src/ui/filedrop.ts',
    'ui/pointer': 'src/ui/pointer.ts',
    'ui/screen': 'src/ui/screen.ts',
    'ui/keycommands': 'src/ui/keycommands.ts',
    'ui/minimap': 'src/ui/minimap.ts'
  },
  dts: true,
  splitting: false,
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
