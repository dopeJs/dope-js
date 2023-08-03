import { resolve } from 'path';
import { IDopeRc } from '../../@types';

const root = resolve(__dirname);

const config: IDopeRc = {
  typing: false,
  input: {
    index: resolve(root, 'src/index.ts'),
  },
  output: {
    name: `dopejs-eslint`,
    dir: resolve(root, 'lib'),
    entryFileNames: `[name].js`,
    format: 'cjs',
    sourcemap: true,
  },
};

export default config;
