import chalk from 'chalk'
import { existsSync } from 'fs'
import { resolve } from 'path'
import { Plugin } from 'rollup'
import { replaceTscAliasPaths } from 'tsc-alias'
import { extract } from './extractor'

export function typingPlugin(pkgName: string, cwd: string): Plugin {
  return {
    name: 'typing-plugin',
    buildStart(opts) {
      // console.log(opts.plugins.find((item) => item.name === 'babel')?.options)
    },
    async closeBundle() {
      const pkgPath = resolve(cwd, 'packages', pkgName)
      if (existsSync(resolve(pkgPath, 'lib', '.typing.temp'))) {
        const configFile = resolve(pkgPath, 'tsconfig.json')
        console.log(`${chalk.bold.green(`Run tsc-alias... in ${pkgPath}`)}`)

        await replaceTscAliasPaths({
          configFile,
          verbose: true,
        })

        extract(pkgName, cwd)
      }
    },
  }
}
