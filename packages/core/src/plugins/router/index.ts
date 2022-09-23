import { Plugin } from 'vite'
import { displayId, moduleId } from './constant'
import { RouterContext } from './context'
import { RouterOptions } from './types'

export function dopeRouter(options?: RouterOptions): Plugin {
  let ctx: RouterContext

  return {
    name: '@dope-js/router-plugin',
    enforce: 'pre',
    configResolved(config) {
      ctx = new RouterContext(options || {}, config.root)
      ctx.setLogger(config.logger)
      ctx.searchGlob()
    },
    configureServer(server) {
      ctx.setupViteServer(server)
    },
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
