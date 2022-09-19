import { logger } from '@/utils'
import { build as viteBuild } from 'vite'

export const build = async () => {
  try {
    await viteBuild({})
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
