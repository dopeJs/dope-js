import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import nodeResolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import * as path from 'path';
import { defineConfig } from 'rollup';
import pkg from './package.json';

function createPlugins(isProduction) {
  return [
    nodeResolve({ preferBuiltins: true }),
    typescript({
      sourceMap: !isProduction,
      declaration: true,
      declarationDir: path.resolve(__dirname, 'lib'),
      lib: ['ESNext', 'DOM'],
    }),
    commonjs({
      extensions: ['.js'],
      ignoreDynamicRequires: true,
    }),
    json(),
  ];
}

function createConfig(isProduction) {
  return defineConfig({
    treeshake: {
      moduleSideEffects: 'no-external',
      propertyReadSideEffects: false,
      tryCatchDeoptimization: false,
    },
    input: 'src/index.ts',
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
        return;
      }
      // we use the eval('require') trick to deal with optional deps
      if (warning.message.includes('Use of eval')) {
        return;
      }
      if (warning.message.includes('Circular dependency')) {
        return;
      }
      warn(warning);
    },
    external: ['fsevents', ...(isProduction ? [] : Object.keys(pkg.devDependencies))],
    plugins: createPlugins(isProduction),
  });
}

export default (commandLineArgs) => {
  const isProduction = !commandLineArgs.watch;
  return defineConfig(createConfig(isProduction));
};
