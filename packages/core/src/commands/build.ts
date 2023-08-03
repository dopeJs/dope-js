import { dopeEntry, dopeEntry1, dopeRouter } from '@/plugins';
import { IBuildOptions } from '@/types';
import { logger, prepareDir } from '@/utils';
import { babel } from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import html from '@rollup/plugin-html';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import chalk from 'chalk';
import { Command } from 'commander';
import { build } from 'esbuild';
import * as path from 'path/posix';
import { cwd as getCwd } from 'process';
import { rollup } from 'rollup';
import { terser } from 'rollup-plugin-terser';

async function goBuild(options: IBuildOptions) {
  try {
    const { cwd: _cwd } = options;
    const cwd = _cwd || getCwd();
    // const configFile = _config || (await findConfigFile(cwd))

    // const userConfig = await loadConfigFromFile({ command: 'build', mode: 'production' }, configFile)
    // const defaultConfig = await getDefaultConfig(cwd, true)
    // const mergedConfig = mergeConfig(defaultConfig, userConfig?.config || {})

    // await viteBuild(mergedConfig)

    logger.info(chalk.cyan(`dopeJs ${chalk.green(`building for production...`)}`));
    const resolve = (...paths: Array<string>) => path.resolve(cwd, ...paths);

    prepareDir(resolve('dist'));

    // await build({
    //   sourceRoot: cwd,
    //   entryPoints: ['index.tsx'],
    //   minify: true,
    //   bundle: true,
    //   outdir: path.join('dist', 'assets'),
    //   plugins: [dopeEntry1(cwd)],
    //   format: 'esm',
    //   splitting: true,
    // })

    const bundle = await rollup({
      context: 'globalThis',
      input: 'index.tsx',
      plugins: [
        dopeEntry(cwd),
        dopeRouter(cwd),
        terser({ ecma: 2015, compress: true, mangle: true }),
        html({
          title: 'DopeJs',
          attributes: { link: { href: '/favicon.ico' } },
          meta: [{ viewport: 'width=device-width, initial-scale=1.0' }],
        }),
        nodeResolve({ rootDir: cwd, preferBuiltins: true, browser: true }),
        commonjs(),
        typescript({ jsx: 'react-jsx', tsconfig: resolve('tsconfig.json') }),
        babel({
          presets: ['@babel/preset-env', '@babel/preset-react'],
          babelHelpers: 'bundled',
          extensions: ['.js', '.jsx', '.es6', '.es', '.mjs', '.ts', '.tsx'],
          compact: false,
        }),
      ],
      preserveEntrySignatures: false,
    });

    await bundle.write({
      dir: resolve('dist'),
      format: 'esm',
      exports: 'auto',
      generatedCode: 'es2015',
      sourcemap: true,
      entryFileNames: path.join('assets', 'index.[hash].js'),
      chunkFileNames: path.join('assets', '[name].[hash].js'),
      assetFileNames: path.join('assets', '[name].[hash].[ext]'),
      inlineDynamicImports: false,
      minifyInternalExports: true,
      manualChunks(id) {
        if (id.includes('node_modules')) {
          return 'vendor';
        }
      },
    });
  } catch (e) {
    if (e instanceof Error) {
      logger.error(e.message);
      if (e.stack) {
        logger.error(`error during build:\n${e.stack}`);
      }
    }

    process.exit(1);
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
      goBuild(options);
    });
}
