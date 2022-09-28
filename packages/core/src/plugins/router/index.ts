import { logger } from '@/utils'
import { Plugin } from 'rollup'
import { displayId, moduleId } from './constant'
import { RouterContext } from './context'
import { RouterOptions } from './types'

export function dopeRouter(options?: RouterOptions): Plugin {
  let ctx: RouterContext

  return {
    name: '@dope-js/plugin-router',
    options(opts) {
      ctx = new RouterContext(options || {}, process.cwd())
      // ctx.setLogger(logger)
      ctx.searchGlob()
    },
    // configureServer(server) {
    //   ctx.setupViteServer(server)
    // },
    resolveId(id) {
      if (id == displayId) return moduleId
      return null
    },
    load(id) {
      if (id === moduleId) return ctx.getFileContent()
      return null
    },
  }
}

export * from './types'
