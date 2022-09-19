import { CONFIG_NAME } from '@/constant'
import { MelonRuntime } from '@/types/runtime'
import { findFile } from '@/utils/file'
import { cwd as getCwd } from 'process'

export interface RuntimeOptions {
  NODE_ENV?: 'development' | 'production'
  cwd?: string
  config?: string
  force?: boolean
  verbose?: boolean
}

class Runtime {
  private static instance: Runtime

  private runtimeMap: Map<string, MelonRuntime>

  private constructor() {
    this.runtimeMap = new Map()
  }

  public static getInstance() {
    if (!Runtime.instance) {
      Runtime.instance = new Runtime()
    }

    return Runtime.instance
  }

  private async initRuntime(
    options: RuntimeOptions
  ): Promise<MelonRuntime | null> {
    const {
      cwd: _cwd,
      NODE_ENV = 'development',
      verbose = false,
      config,
      force = false,
    } = options

    if (verbose) {
      process.env.FE_VERBOSE = 'true'
    }

    if (!process.env.NODE_ENV) {
      process.env.NODE_ENV = NODE_ENV
    }

    const cwd = _cwd || getCwd()

    let melonConf = ''
    if (!config) {
      melonConf = await findFile(cwd, [
        `${CONFIG_NAME}.ts`,
        `${CONFIG_NAME}.js`,
      ])
    }

    console.log(melonConf)

    return null
  }

  /**
   * @description fetch runtime asyncrously
   */
  public async getRuntime(
    options: RuntimeOptions
  ): Promise<MelonRuntime | null> {
    const cwd = options.cwd || getCwd()
    console.log(cwd)

    if (options.force || !this.runtimeMap.has(cwd)) {
      const runtime = await this.initRuntime(options)
      if (runtime === null) {
        return null
      }
      this.runtimeMap.set(cwd, runtime)
      return runtime
    }

    return this.runtimeMap.get(cwd) || null
  }
}

export const runtime = Runtime.getInstance()
