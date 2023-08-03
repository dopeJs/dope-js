import { babel } from '@rollup/plugin-babel';
import { resolve } from 'path';
import { IDopeRc } from '../../@types';

const root = resolve(__dirname);
const globals = { react: 'React' };

const config: IDopeRc = {
  typing: true,
  input: { index: resolve(root, 'src/index.ts') },
  output: [
    {
      name: `dopejs-router`,
      dir: resolve(root, 'lib'),
      entryFileNames: `[name].cjs.js`,
      format: 'cjs',
      globals,
      sourcemap: true,
    },
    {
      name: `dopejs-router`,
      dir: resolve(root, 'lib'),
      entryFileNames: `[name].es.js`,
      format: 'es',
      globals,
      sourcemap: true,
    },
    {
      name: `dopejs-router`,
      dir: resolve(root, 'lib'),
      entryFileNames: `[name].umd.js`,
      format: 'umd',
      globals,
      sourcemap: true,
    },
  ],
  tsOpts: { jsx: 'react-jsx' },
  plugins: [
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
        ['babel-plugin-styled-components', { namespace: `dope-design`, preprocess: false, fileName: false, displayName: false }],
      ],
    }),
  ],
};

export default config;
