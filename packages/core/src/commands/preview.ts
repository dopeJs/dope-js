import { IDevOptions } from '@/types'
import { findConfigFile, getDefaultConfig, logger } from '@/utils'
import { cwd as getCwd } from 'process'
import { loadConfigFromFile, mergeConfig, preview as vitePreview, UserConfig } from 'vite'

export const preview = async (options: IDevOptions = {}) => {
  try {
    const { cwd: _cwd, config: _config, host, port } = options
    const cwd = _cwd || getCwd()
    const configFile = _config || (await findConfigFile(cwd))

    const userConfig = await loadConfigFromFile({ command: 'build', mode: 'production' }, configFile)
    const defaultConfig = await getDefaultConfig(cwd, true, { host, port })
    const mergedConfig: UserConfig = mergeConfig(defaultConfig, userConfig?.config || {})

    const server = await vitePreview(mergedConfig)
    if (!server.httpServer) {
      throw new Error('HTTP server not available')
    }

    server.printUrls()
  } catch (e) {
    if (e instanceof Error) {
      logger.error(e.message)
      if (e.stack) {
        logger.error(`error during build:\n${e.stack}`)
      }
    }

    process.exit(1)
  }
}
