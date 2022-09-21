import { Plugin } from 'vite'
import { moduleId } from './constant'
import { RouterContext } from './context'
import { RouterOptions } from './types'

export function melonRouter(options?: RouterOptions): Plugin {
  let ctx: RouterContext

  return {
    name: '@melon-js/router-plugin',
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
      if (id == '~pages') return moduleId
      return null
    },
    async load(id) {
      if (id === moduleId) {
        const routes = ctx.resolveRoutes()
        return `export default ${JSON.stringify({ routes })};`
      }

      return null
    },
  }
}

export * from './types'
