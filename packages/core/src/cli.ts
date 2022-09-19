import { IDevOptions } from '@/types'
import { getLogo } from '@/utils'
import chalk from 'chalk'
import { Command } from 'commander'
import { resolve } from 'path'

export async function main() {
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
    .alias('s')
    .option('-p --port <port>', 'assign dev port')
    .option('-c --config <configPath>', 'assign a melon.config file')
    .option('--cwd <cwd>', 'assign workspace root')
    .description('start a unbundle esm development server powered by vite.')
    .action(async ({ port, config, cwd }: IDevOptions) => {
      const { startDevServer } = await import('./commands/start')

      startDevServer({
        port,
        config,
        cwd,
      })
    })

  program
    .command('build')
    .description('build esm output.')
    .action(async () => {
      const { build } = await import('./commands/build')

      build()
    })

  const args = process.argv
  if (args.length < 3 || args[2] === 'help' || args[2] === '-h') {
    console.log(chalk.yellowBright(getLogo()))
  }

  // handle fe install
  program.parseAsync(args)
}

main()
