import { cwd as getCwd } from 'process'
import { build as viteBuild, loadConfigFromFile, mergeConfig } from 'vite'
import { IBuildOptions } from '../types'
import { findConfigFile, getDefaultConfig, logger } from '../utils'

export const build = async (options: IBuildOptions = {}) => {
  try {
    const { cwd: _cwd, config: _config } = options
    const cwd = _cwd || getCwd()
    const configFile = _config || (await findConfigFile(cwd))

    const userConfig = await loadConfigFromFile({ command: 'build', mode: 'production' }, configFile)
    const defaultConfig = await getDefaultConfig(cwd, true)
    const mergedConfig = mergeConfig(defaultConfig, userConfig?.config || {})

    await viteBuild(mergedConfig)
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
