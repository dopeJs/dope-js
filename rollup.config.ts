import { babel } from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import typescript, { RollupTypescriptOptions } from '@rollup/plugin-typescript'
import { resolve } from 'path'
import { defineConfig, OutputOptions, Plugin } from 'rollup'
import peerDepsExternal from 'rollup-plugin-peer-deps-external'
import { terser } from 'rollup-plugin-terser'
import { getPackages, IPkgInfo } from './scripts/get-packages'
import { typingPlugin } from './scripts/typing-plugin'

function getPkgRoot(info: IPkgInfo) {
  return resolve(__dirname, 'packages', info.name)
}

function getPlugins(info: IPkgInfo, isProduction: boolean) {
  const tsOpts: RollupTypescriptOptions = {
    tsconfig: info.typing
      ? resolve(getPkgRoot(info), 'tsconfig.base.json')
      : resolve(getPkgRoot(info), 'tsconfig.json'),
    sourceMap: !isProduction,
    declaration: true,
    lib: ['ESNext', 'DOM'],
  }

  if (info.typing) {
    tsOpts.declarationDir = resolve(getPkgRoot(info), 'lib', '.typing.temp')
  } else {
    tsOpts.declarationDir = resolve(getPkgRoot(info), 'lib')
  }

  if (info.react) {
    tsOpts.jsx = 'react-jsx'
  }

  const plugins: Array<Plugin> = [
    peerDepsExternal() as Plugin,
    nodeResolve({ preferBuiltins: true }),
    typescript(tsOpts),
    commonjs({
      extensions: ['.js'],
      ignoreDynamicRequires: true,
    }),
    json(),
    terser(),
  ]

  if (info.typing) {
    plugins.push(typingPlugin(info.name, resolve(__dirname)))
  }

  if (info.react) {
    plugins.push(
      babel({
        babelHelpers: 'runtime',
        exclude: 'node_modules/**',
        presets: [
          '@babel/preset-env',
          [
            '@babel/preset-react',
            {
              runtime: 'automatic',
            },
          ],
        ],
        plugins: [
          '@babel/plugin-transform-runtime',
          [
            'babel-plugin-styled-components',
            { namespace: `dope-${info.name}`, preprocess: false, fileName: false, displayName: false },
          ],
        ],
      })
    )
  }

  return plugins
}

function getGlobals(info: IPkgInfo): Record<string, string> | undefined {
  return info.react ? { react: 'React', 'styled-components': 'styled' } : undefined
}

function getExternals(info: IPkgInfo, isProduction: boolean) {
  const set = new Set([
    ...Object.keys(info.pkg.dependencies),
    ...(isProduction ? [] : Object.keys(info.pkg.devDependencies)),
  ])

  return Array.from(set)
}

function getInput(info: IPkgInfo) {
  return Object.keys(info.entry).reduce((acc, curr) => {
    acc[curr] = resolve(getPkgRoot(info), info.entry[curr])

    return acc
  }, {} as Record<string, string>)
}

function getOutput(info: IPkgInfo, isProduction: boolean): Array<OutputOptions> {
  return info.formats.map((item) => {
    const conf: OutputOptions = {
      name: `dopejs-${info.name}`,
      dir: resolve(getPkgRoot(info), 'lib'),
      entryFileNames: `[name].${item}.js`,
      format: item,
      globals: getGlobals(info),
      sourcemap: !isProduction,
      extend: info.name === 'design',
    }

    if (info.name === 'design') {
      conf.chunkFileNames = `[name].${item}.[chunk].js`
    }

    return conf
  })
}

function createBundleConfig(info: IPkgInfo, isProduction: boolean) {
  return defineConfig({
    // treeshake: {
    //   moduleSideEffects: 'no-external',
    //   propertyReadSideEffects: false,
    //   tryCatchDeoptimization: false,
    // },
    input: getInput(info),
    output: getOutput(info, isProduction),
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
    plugins: getPlugins(info, isProduction),
  })
}

export default (args: { watch: boolean }) => {
  const isProduction = !args.watch
  return getPackages(process.cwd()).map((info) => createBundleConfig(info, isProduction))
}
