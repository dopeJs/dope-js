import chalk from 'chalk'
import { Command } from 'commander'
import { resolve } from 'path'
import { getLogo } from './utils'

async function main() {
  const program = new Command()
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const packageInfo = require(resolve(__dirname, '..', 'package.json'))

  const version = packageInfo.version
  program.version(version)

  program
    .command('init [projectName]')
    .description('create a new project powered by melon.')
    .action((projectName) => {
      console.log(projectName)
    })

  program
    .command('start')
    .description('start a unbundle esm development server powered by vite.')
    .action(() => {
      console.log('start')
    })

  program
    .command('build')
    .description('build esm output.')
    .action(() => {
      console.log('build')
    })

  const args = process.argv
  if (args.length < 3 || args[2] === 'help' || args[2] === '-h') {
    console.log(chalk.yellowBright(getLogo()))
  }

  // handle fe install
  program.parseAsync(args)
}

main()
