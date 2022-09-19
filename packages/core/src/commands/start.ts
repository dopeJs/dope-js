import { IDevOptions } from '@/types'
import { logger } from '@/utils'
import { createServer } from 'vite'

export const startDevServer = async (options: IDevOptions = {}) => {
  try {
    const { port, config, verbose, force, cwd } = options

    const server = await createServer()
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
