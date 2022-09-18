import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import { defineConfig } from 'rollup'

const globals = { react: 'React' }

const formats = ['cjs', 'es', 'umd']

const rollupConfig = defineConfig({
  input: 'src/index.ts',
  output: formats.map((item) => ({
    file: `lib/md.${item}.js`,
    format: item,
    name: 'Melon-design',
    globals,
    sourcemap: true,
  })),
  external: globals,
  plugins: [
    commonjs(),
    resolve(),
    typescript({
      compilerOptions: {
        declaration: true,
        jsx: 'react-jsx',
      },
    }),
  ],
})

export default rollupConfig
