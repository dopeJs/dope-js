import { Plugin } from 'vite'
import { RouterContext } from './context'
import { RouterOptions } from './types'

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
    // configureServer(server) {
    //   ctx.setupViteServer(server)
    // },
    // resolveId(id) {
    //   if (ctx.options.moduleIds.includes(id))
    //     return `${MODULE_ID_VIRTUAL}?id=${id}`

    //   if (routeBlockQueryRE.test(id)) return ROUTE_BLOCK_ID_VIRTUAL

    //   return null
    // },
    //   async load(id) {
    //     const { moduleId, pageId } = parsePageRequest(id)

    //     if (
    //       moduleId === MODULE_ID_VIRTUAL &&
    //       pageId &&
    //       ctx.options.moduleIds.includes(pageId)
    //     )
    //       return ctx.resolveRoutes()

    //     if (id === ROUTE_BLOCK_ID_VIRTUAL) {
    //       return {
    //         code: 'export default {};',
    //         map: null,
    //       }
    //     }

    //     return null
    //   },
  }
}

export * from './types'
