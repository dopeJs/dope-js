import { cwd as getCwd } from 'process'
import { createServer, loadConfigFromFile, mergeConfig, UserConfig } from 'vite'
import { IDevOptions } from '../types'
import { findConfigFile, getDefaultConfig, logger } from '../utils'

export const startDevServer = async (options: IDevOptions = {}) => {
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
