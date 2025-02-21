import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    io: 'src/io.ts'
  },
  format: ['esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  treeshake: true,
  bundle: true,
  outDir: 'dist',
  external: ['effect', '@standard-schema/spec', '@figureland/kit', 'nanoid']
})
