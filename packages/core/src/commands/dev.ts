import { runtime } from '@/core/runtime'
import { IDevOptions } from '@/types'

export const startDevServer = async (options: IDevOptions = {}) => {
  const { port, config, verbose, force, cwd } = options

  const theRuntime = await runtime.getRuntime({
    NODE_ENV: 'development',
    config,
    verbose,
    force,
    cwd,
  })
}
