import alias from '@rollup/plugin-alias'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import nodeResolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import * as path from 'path'
import { defineConfig } from 'rollup'
import pkg from './package.json'

const projectRootDir = path.resolve(__dirname)

function createNodePlugins(isProduction, declarationDir) {
  const sourceMap = !isProduction

  return [
    alias({
      entries: [
        { find: '@', replacement: path.resolve(projectRootDir, 'src') },
      ],
    }),
    nodeResolve({ preferBuiltins: true }),
    typescript({
      tsconfig: path.resolve(__dirname, 'src/tsconfig.json'),
      sourceMap,
      declaration: declarationDir !== false,
      declarationDir: declarationDir !== false ? declarationDir : undefined,
    }),
    commonjs({
      extensions: ['.js'],
      ignoreDynamicRequires: true,
    }),
    json(),
  ]
}

function createNodeConfig(isProduction) {
  return defineConfig({
    treeshake: {
      moduleSideEffects: 'no-external',
      propertyReadSideEffects: false,
      tryCatchDeoptimization: false,
    },
    input: {
      index: path.resolve(__dirname, 'src/index.ts'),
      cli: path.resolve(__dirname, 'src/cli.ts'),
    },
    output: {
      dir: path.resolve(__dirname, 'lib'),
      entryFileNames: `[name].js`,
      exports: 'named',
      format: 'cjs',
      externalLiveBindings: false,
      freeze: false,
      sourcemap: !isProduction,
    },
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
    external: [
      'fsevents',
      ...Object.keys(pkg.dependencies),
      ...(isProduction ? [] : Object.keys(pkg.devDependencies)),
    ],
    plugins: createNodePlugins(
      isProduction,
      isProduction ? false : path.resolve(__dirname, 'lib')
    ),
  })
}

export default (commandLineArgs) => {
  const isProduction = !commandLineArgs.watch
  return defineConfig(createNodeConfig(isProduction))
}
