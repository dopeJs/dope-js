import { Plugin } from 'vite'
import { RouterContext } from './context'
import { RouterOptions } from './types'

const moduleId = '/@vite-plugin-pages/melonJS-pages'

export function melonRouter(options?: RouterOptions): Plugin {
  let ctx: RouterContext

  return {
    name: '@melon-js/router-plugin',
    enforce: 'pre',
    async configResolved(config) {
      ctx = new RouterContext(options || {}, config.root)
      ctx.setLogger(config.logger)
      await ctx.searchGlob()
    },
    configureServer(server) {
      ctx.setupViteServer(server)
    },
    api: {
      // getResolvedRoutes() {
      //   return ctx.options.resolver.getComputedRoutes(ctx)
      // },
    },
    resolveId(id) {
      if (id == '~pages') return moduleId
      return null
    },
    async load(id) {
      if (id === moduleId) {
        const routes = ctx.resolveRoutes()
        console.log('routes', routes)
        return `export default ${JSON.stringify({ routes })};`
      }

      return null
    },
  }
}

export * from './types'
