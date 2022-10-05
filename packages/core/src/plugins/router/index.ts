import { resolve } from 'path/posix'
import { Plugin } from 'rollup'
import { displayId, moduleId as _moduleId } from './constant'
import { RouterContext } from './context'
import { RouterOptions } from './types'

export function dopeRouter(root: string, options?: RouterOptions): Plugin {
  let ctx: RouterContext
  const moduleId = resolve(root, _moduleId)

  return {
    name: '@dope-js/plugin-router',
    options() {
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
