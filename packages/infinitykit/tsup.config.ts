/// <reference types="node" />

import { exec } from 'node:child_process'
import { defineConfig } from 'tsup'

const env = process.env.NODE_ENV

const isDev = env === 'development'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    device: 'src/ui/device.ts',
    filedrop: 'src/ui/filedrop.ts',
    pointer: 'src/ui/pointer.ts',
    screen: 'src/ui/screen.ts',
    keycommands: 'src/ui/keycommands.ts',
    minimap: 'src/ui/minimap.ts'
  },
  dts: true,
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
