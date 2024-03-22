import type { Options } from 'tsup'

const env = process.env.NODE_ENV

export const tsup: Options = {
  splitting: true,
  clean: true,
  dts: true,
  format: ['esm'],
  minify: false,
  skipNodeModulesBundle: true,
  watch: env === 'development',
  target: 'es2022',
  outDir: 'dist',
  entry: ['src/**/*.ts']
}
