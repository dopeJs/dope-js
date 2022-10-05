import { dopeEntry, dopeRouter } from '@/plugins'
import { IBuildOptions } from '@/types'
import { logger, prepareDir } from '@/utils'
import { babel } from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import chalk from 'chalk'
import { Command } from 'commander'
import * as path from 'path/posix'
import { cwd as getCwd } from 'process'
import { rollup } from 'rollup'

async function goBuild(options: IBuildOptions) {
  try {
    const { cwd: _cwd } = options
    const cwd = _cwd || getCwd()
    // const configFile = _config || (await findConfigFile(cwd))

    // const userConfig = await loadConfigFromFile({ command: 'build', mode: 'production' }, configFile)
    // const defaultConfig = await getDefaultConfig(cwd, true)
    // const mergedConfig = mergeConfig(defaultConfig, userConfig?.config || {})

    // await viteBuild(mergedConfig)

    logger.info(chalk.cyan(`dopeJs ${chalk.green(`building for production...`)}`))
    const resolve = (...paths: Array<string>) => path.resolve(cwd, ...paths)

    prepareDir(resolve('dist'))

    const bundle = await rollup({
      context: 'globalThis',
      input: 'index.tsx',
      plugins: [
        dopeEntry(resolve('src', 'pages'), cwd),
        dopeRouter(cwd),
        nodeResolve({ rootDir: cwd, preferBuiltins: true }),
        commonjs(),
        typescript({ jsx: 'react-jsx', tsconfig: resolve('tsconfig.json') }),
        babel({
          presets: ['@babel/preset-env', '@babel/preset-react'],
          babelHelpers: 'bundled',
          extensions: ['.js', '.jsx', '.es6', '.es', '.mjs', '.ts', '.tsx'],
        }),
      ],
      preserveEntrySignatures: false,
    })

    await bundle.write({
      dir: resolve('dist'),
      format: 'esm',
      exports: 'auto',
      generatedCode: 'es2015',
      sourcemap: true,
      entryFileNames: path.join('assets', '[name].js'),
      chunkFileNames: path.join('assets', '[name].[hash].js'),
      inlineDynamicImports: true,
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

export function registerBuild(program: Command) {
  program
    .command('build')
    .alias('b')
    .description('build output.')
    .option('-c --config <configPath>', 'Specify a dope.config file')
    .option('--cwd <cwd>', 'Specify workspace root')
    .action((options: IBuildOptions) => {
      goBuild(options)
    })
}
