import { dopeEntry, dopeRouter } from '@/plugins'
import { IBuildOptions } from '@/types'
import { logger } from '@/utils'
import { babel, getBabelOutputPlugin } from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import * as path from 'path'
import { cwd as getCwd } from 'process'
import { rollup } from 'rollup'
// import { build as viteBuild, loadConfigFromFile, mergeConfig } from 'vite'

export const build = async (options: IBuildOptions = {}) => {
  try {
    const { cwd: _cwd } = options
    const cwd = _cwd || getCwd()
    // const configFile = _config || (await findConfigFile(cwd))

    // const userConfig = await loadConfigFromFile({ command: 'build', mode: 'production' }, configFile)
    // const defaultConfig = await getDefaultConfig(cwd, true)
    // const mergedConfig = mergeConfig(defaultConfig, userConfig?.config || {})

    // await viteBuild(mergedConfig)

    const resolve = (...paths: Array<string>) => path.resolve(cwd, ...paths)

    return rollup({
      input: resolve('index.tsx'),
      plugins: [
        dopeEntry(resolve('src', 'pages'), cwd),
        dopeRouter(),
        nodeResolve(),
        commonjs(),
        typescript({ tsconfig: resolve('tsconfig.json'), jsx: 'preserve' }),
        babel({
          presets: ['@babel/preset-react'],
          babelHelpers: 'bundled',
          extensions: ['.js', '.jsx', '.es6', '.es', '.mjs', '.ts', '.tsx'],
        }),
      ],
      output: {
        file: resolve(process.cwd(), 'dist', 'assets', 'index.js'),
        format: 'esm',
        plugins: [getBabelOutputPlugin({ presets: ['@babel/preset-env'] })],
        sourcemap: true,
      },
    })
  } catch (e) {
    if (e instanceof Error) {
      logger.error(e.message)
      if (e.stack) {
        logger.error(`error during build:\n${e.stack}`)
      }
    }

    process.exit(1)
  }
}
