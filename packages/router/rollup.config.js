import alias from '@rollup/plugin-alias'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import * as path from 'path'
import { defineConfig } from 'rollup'

const globals = { react: 'React' }

const formats = ['cjs', 'es', 'umd']

const projectRootDir = path.resolve(__dirname)

const rollupConfig = defineConfig({
  input: 'src/index.ts',
  output: formats.map((item) => ({
    file: `lib/design.${item}.js`,
    format: item,
    name: 'MelonJS-design',
    globals,
    sourcemap: true,
  })),
  external: globals,
  plugins: [
    alias({
      entries: [{ find: '@', replacement: path.resolve(projectRootDir, 'src') }],
    }),
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
