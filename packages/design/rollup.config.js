import { babel } from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import nodeResolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import { resolve } from 'path'
import { defineConfig } from 'rollup'
import pkg from './package.json'

function createPlugins(isProduction) {
  return [
    nodeResolve({ preferBuiltins: true }),
    typescript({
      sourceMap: !isProduction,
      declaration: true,
      declarationDir: resolve(__dirname, 'lib'),
      lib: ['ESNext', 'DOM'],
      jsx: 'react-jsx',
    }),
    babel({
      babelHelpers: 'runtime',
      plugins: ['@babel/plugin-transform-runtime'],
    }),
    commonjs({
      extensions: ['.js'],
      ignoreDynamicRequires: true,
    }),
    json(),
  ]
}

const globals = { react: 'React' }
const formats = ['cjs', 'es', 'umd']

function getExternals(isProduction) {
  const set = new Set([
    ...Object.keys(globals),
    'fsevents',
    // ...Object.keys(pkg.dependencies),
    ...(isProduction ? [] : Object.keys(pkg.devDependencies)),
  ])

  return Array.from(set)
}

function createConfig(isProduction) {
  return defineConfig({
    treeshake: {
      moduleSideEffects: 'no-external',
      propertyReadSideEffects: false,
      tryCatchDeoptimization: false,
    },
    input: 'src/index.ts',
    output: formats.map((item) => ({
      file: `lib/design.${item}.js`,
      format: item,
      name: 'MelonJS-design',
      globals,
      sourcemap: !isProduction,
    })),
    onwarn(warning, warn) {
      // node-resolve complains a lot about this but seems to still work?
      if (warning.message.includes('Package subpath')) {
        return
      }
      // we use the eval('require') trick to deal with optional deps
      if (warning.message.includes('Use of eval')) {
        return
      }
      if (warning.message.includes('Circular dependency')) {
        return
      }
      warn(warning)
    },
    external: getExternals(isProduction),
    plugins: createPlugins(isProduction),
  })
}

export default (commandLineArgs) => {
  const isProduction = !commandLineArgs.watch
  return defineConfig(createConfig(isProduction))
}
