import chalk from 'chalk'
import { Command } from 'commander'
import { getLogo, loadPkgJson, logger } from './utils'

const program = new Command()
const pkgJson = loadPkgJson(__dirname)
program.version(pkgJson?.version || '0.0.1')

async function loadCommands() {
  const { registerStart } = await import(`./commands/start`)
  registerStart(program)

  const { registerBuild } = await import(`./commands/build`)
  registerBuild(program)

  const { registerPreview } = await import(`./commands/preview`)
  registerPreview(program)
}

loadCommands()
  .then(() => {
    const args = process.argv
    if (args.length < 3 || args[2] === 'help' || args[2] === '-h') {
      console.log(chalk.yellowBright(getLogo()))
    }

    program.parseAsync(args)
  })
  .catch((err: Error) => {
    logger.error(err.message)
    process.exit(1)
  })
