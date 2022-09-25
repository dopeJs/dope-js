import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import { resolve } from 'path'
import { defineConfig, Plugin } from 'rollup'
import peerDepsExternal from 'rollup-plugin-peer-deps-external'
import { terser } from 'rollup-plugin-terser'
import { getPkgs, IPkgInfo } from './scripts/get-pkgs'
import { typingPlugin } from './scripts/typing-plugin'

function getPkgRoot(info: IPkgInfo) {
  return resolve(__dirname, 'packages', info.name)
}

function getPlugins(info: IPkgInfo) {
  const plugins: Array<Plugin> = [
    peerDepsExternal() as Plugin,
    nodeResolve({ preferBuiltins: true }),
    typescript({
      tsconfig: info.typing
        ? resolve(getPkgRoot(info), 'tsconfig.base.json')
        : resolve(getPkgRoot(info), 'tsconfig.json'),
      sourceMap: true,
      declaration: true,
      declarationDir: info.typing ? resolve(getPkgRoot(info), 'lib', '.typing.temp') : resolve(getPkgRoot(info), 'lib'),
      lib: ['ESNext', 'DOM'],
      ...(info.tsOpts || {}),
    }),
    commonjs({
      extensions: ['.js'],
    }),
    json(),
    terser(),
    ...(info.typing ? [typingPlugin(info.name, resolve(__dirname))] : []),
    ...(info.plugins || []),
  ]

  return plugins
}

function getExternals(info: IPkgInfo, isProduction: boolean) {
  const set = new Set([
    ...Object.keys(info.pkg.dependencies),
    ...(isProduction ? [] : Object.keys(info.pkg.devDependencies)),
    'react',
    'styled-components',
  ])

  return Array.from(set)
}

function createBundleConfig(info: IPkgInfo, isProduction: boolean) {
  return defineConfig({
    treeshake: {
      moduleSideEffects: 'no-external',
      propertyReadSideEffects: false,
      tryCatchDeoptimization: false,
    },
    input: info.input,
    output: info.output,
    onwarn(warning, warn) {
      if (warning.message.includes('Package subpath')) {
        return
      }
      if (warning.message.includes('Use of eval')) {
        return
      }
      if (warning.message.includes('Circular dependency')) {
        return
      }
      warn(warning)
    },
    external: getExternals(info, isProduction),
    plugins: getPlugins(info),
  })
}

export default async (args: { watch: boolean }) => {
  const isProduction = !args.watch
  const pkgs = await getPkgs(process.cwd())
  return pkgs.map((info) => createBundleConfig(info, isProduction))
}
