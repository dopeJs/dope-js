import { DefaultConfigFiles } from '@/constants'
import { createDebugger, DopeDebugger } from '@/debug'
import { ConfigEnv, UserConfig } from '@/types'
import { isObject, logger, normalizePath } from '@/utils'
import chalk from 'chalk'
import findUp from 'find-up'
import { resolve } from 'path'
import { getDefaultConfig } from './defaults'
import { mergeConfig } from './merge'
import { bundleConfigFile, loadConfigFromBundledFile, lookupFile } from './transpile'

export class Config {
  private cwd: string
  private findFileCache: Record<string, string>
  private debugger: DopeDebugger

  constructor(cwd = process.cwd()) {
    this.cwd = cwd
    this.findFileCache = {}
    this.debugger = createDebugger('dope:config')
  }

  private getFindFileCacheKey = (files: string | string[]) => {
    const afterKey = Array.isArray(files) ? files.join('&') : typeof files === 'string' ? files : ''
    return `${this.cwd}?${afterKey}`
  }

  /**
   * 从用户目录访问公共目录会增加一个 privite 前缀
   */
  private handlePrivate(path: string) {
    if (path.startsWith('/private')) {
      return path.replace(/^\/private/, '')
    }
    return path
  }

  public async findConfigFile(): Promise<string> {
    const cacheKey = this.getFindFileCacheKey(DefaultConfigFiles)
    if (Reflect.has(this.findFileCache, cacheKey)) {
      return this.findFileCache[cacheKey]
    }

    let result: string | undefined

    for (const fileName of DefaultConfigFiles) {
      result = await findUp(fileName, { cwd: this.cwd })
      if (result) break
    }

    result = result ? this.handlePrivate(result) : result

    if (result) {
      this.findFileCache[cacheKey] = result
    }

    return result || ''
  }

  private async loadConfigFromFile(
    configEnv: ConfigEnv,
    configFile?: string
  ): Promise<{ path: string; config: UserConfig; dependencies: Array<string> } | null> {
    const start = performance.now()
    const getTime = () => `${(performance.now() - start).toFixed(2)}ms`

    let resolvedPath: string | undefined
    if (configFile) {
      resolvedPath = resolve(configFile)
    } else {
      resolvedPath = resolve(await this.findConfigFile())
    }

    if (!resolvedPath) {
      this.debugger('no config file found.')
      return null
    }

    let isESM = false
    if (/\.m[jt]s$/.test(resolvedPath)) {
      isESM = true
    } else if (/\.c[jt]s$/.test(resolvedPath)) {
      isESM = false
    } else {
      // check package.json for type: "module" and set `isESM` to true
      try {
        const pkg = lookupFile(this.cwd, ['package.json'])
        isESM = !!pkg && JSON.parse(pkg).type === 'module'
      } catch (e) {
        logger.error((e as Error).message)
        return null
      }
    }

    try {
      const bundled = await bundleConfigFile(resolvedPath, isESM)
      const userConfig = await loadConfigFromBundledFile(resolvedPath, bundled.code, isESM)
      console.log('userConfig', userConfig)
      this.debugger(`bundled config file loaded in ${getTime()}`)

      const config = await (typeof userConfig === 'function' ? userConfig(configEnv) : userConfig)
      if (!isObject(config)) {
        throw new Error(`config must export or return an object.`)
      }
      return {
        path: normalizePath(resolvedPath!),
        config,
        dependencies: bundled.dependencies,
      }
    } catch (err) {
      logger.error(chalk.red(`failed to load config from ${resolvedPath}`))
      logger.error((err as Error).message)
      if ((err as Error).stack) {
        logger.error((err as Error).stack!)
      }
    }

    return null
  }

  public async loadConfig(configEnv: ConfigEnv, configFile?: string): Promise<UserConfig> {
    const configFromFile = await this.loadConfigFromFile(configEnv, configFile)
    const defaultConfig = getDefaultConfig()
    return mergeConfig(defaultConfig, configFromFile?.config || {})
  }
}
