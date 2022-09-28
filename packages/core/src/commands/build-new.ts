import { dopeEntry } from '@/plugins'
import { babel, getBabelOutputPlugin } from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import { resolve } from 'path'
import { rollup, Plugin } from 'rollup'

export const build = async () => {
  // const { cwd: _cwd, config: _config } = options
  // const config = new Config()
  // const userConfig = await config.loadConfig({ command: 'build', mode: 'production' }, _config)

  rollup({
    input: resolve(process.cwd(), 'index.tsx'),
    plugins: [
      dopeEntry(resolve(process.cwd(), 'src', 'pages')) as Plugin,
      nodeResolve(),
      commonjs(),
      typescript({ tsconfig: resolve(process.cwd(), 'tsconfig.json'), jsx: 'preserve' }),
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
    },
  })
}
