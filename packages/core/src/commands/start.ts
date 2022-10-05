import { IDevOptions } from '@/types'
import { findConfigFile, getDefaultConfig, logger } from '@/utils'
import { Command } from 'commander'
import { cwd as getCwd } from 'process'
import { createServer, loadConfigFromFile, mergeConfig, UserConfig } from 'vite'

async function startDevServer(options: IDevOptions) {
  try {
    const { host, port, config: _config, cwd: _cwd } = options

    const cwd = _cwd || getCwd()

    const configFile = _config || (await findConfigFile(cwd))

    const userConfig = await loadConfigFromFile({ command: 'serve', mode: 'development' }, configFile)
    const defaultConfig = await getDefaultConfig(cwd, false, { host, port })
    const mergedConfig: UserConfig = mergeConfig(defaultConfig, userConfig?.config || {})

    const server = await createServer(mergedConfig)
    if (!server.httpServer) {
      throw new Error('HTTP server not available')
    }

    await server.listen()

    server.printUrls()
  } catch (e) {
    if (e instanceof Error) {
      logger.error(e.message)
      if (e.stack) {
        logger.error(`error when starting dev server:\n${e.stack}`)
      }
    }

    process.exit(1)
  }
}

export function registerStart(program: Command) {
  program
    .command('start')
    .alias('s')
    .description('start a unbundle esm development server.')
    .option('-h --host <host>', 'Specify dev host')
    .option('-p --port <port>', 'Specify dev port')
    .option('-c --config <configPath>', 'Specify a dope.config file')
    .option('--cwd <cwd>', 'Specify workspace root')
    .action(startDevServer)
}
