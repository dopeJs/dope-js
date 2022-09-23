import { resolve } from 'path'
import { IDopeRc } from '../../@types'

const root = resolve(__dirname)

const config: IDopeRc = {
  typing: true,
  input: {
    index: resolve(root, 'src/index.ts'),
    cli: resolve(root, 'src/cli.ts'),
  },
  output: {
    name: `dopejs-core`,
    dir: resolve(root, 'lib'),
    entryFileNames: `[name].js`,
    format: 'cjs',
    sourcemap: true,
  },
}

export default config
