import { IBuildOptions, IDevOptions } from '@/types'
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
    .option('-h --host <port>', 'assign dev host')
    .option('-p --port <port>', 'assign dev port')
    .option('-c --config <configPath>', 'assign a melon.config file')
    .option('--cwd <cwd>', 'assign workspace root')
    .description('start a unbundle esm development server powered by vite.')
    .action(async ({ host, port, config, cwd }: IDevOptions) => {
      const { startDevServer } = await import('./commands/start')

      startDevServer({
        host,
        port,
        config,
        cwd,
      })
    })

  program
    .command('build')
    .alias('b')
    .description('build esm output.')
    .option('-c --config <configPath>', 'assign a melon.config file')
    .option('--cwd <cwd>', 'assign workspace root')
    .action(async ({ config, cwd }: IBuildOptions) => {
      const { build } = await import('./commands/build')

      build({ config, cwd })
    })

  program
    .command('preview')
    .description('build esm output.')
    .option('-h --host <port>', 'assign dev host')
    .option('-p --port <port>', 'assign dev port')
    .option('-c --config <configPath>', 'assign a melon.config file')
    .option('--cwd <cwd>', 'assign workspace root')
    .action(async ({ host, port, config, cwd }: IDevOptions) => {
      const { preview } = await import('./commands/preview')

      preview({ host, port, config, cwd })
    })

  const args = process.argv
  if (args.length < 3 || args[2] === 'help' || args[2] === '-h') {
    console.log(chalk.yellowBright(getLogo()))
  }

  // handle fe install
  program.parseAsync(args)
}

main()
