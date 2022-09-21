import { extname, join, resolve } from 'path'
import type { FSWatcher, Logger, ModuleNode, ViteDevServer } from 'vite'
import { getPageFiles } from './files'
import { resolveOptions } from './options'
import { PageOptions, ResolvedOptions, RouterOptions } from './types'
import { debug, isTarget, slash, toArray } from './utils'
// import type { FSWatcher } from 'fs'
// import { extname, join, resolve } from 'path'
// import { MelonRouterOptions } from '.'
// import { getPageFiles } from './files'
// import { resolveOptions } from './options'

export interface PageRoute {
  path: string
  route: string
}

export class RouterContext {
  private _server: ViteDevServer | undefined
  private _pageRouteMap = new Map<string, PageRoute>()

  rawOptions: RouterOptions
  root: string
  options: ResolvedOptions
  logger?: Logger

  constructor(options: RouterOptions, viteRoot: string = process.cwd()) {
    this.rawOptions = options
    this.root = slash(viteRoot)
    debug.env('root', this.root)
    this.options = resolveOptions(options, this.root)
    debug.options(this.options)
  }

  setLogger(logger: Logger) {
    this.logger = logger
  }

  setupViteServer(server: ViteDevServer) {
    if (this._server === server) return

    this._server = server
    this.setupWatcher(server.watcher)
  }

  setupWatcher(watcher: FSWatcher) {
    watcher.on('unlink', (path) => {
      path = slash(path)
      if (!isTarget(path, this.options)) return
      this.removePage(path)
      this.onUpdate()
    })

    watcher.on('add', (path) => {
      path = slash(path)
      if (!isTarget(path, this.options)) return
      const page = this.options.dirs.find((i) => path.startsWith(slash(resolve(this.root, i.dir))))!
      this.addPage(path, page)
      this.onUpdate()
    })
  }

  getRoute(path: string, pageDir: PageOptions) {
    const pageDirPath = slash(resolve(this.root, pageDir.dir))
    let route = '/' + slash(join(pageDir.baseRoute, path.replace(`${pageDirPath}/`, '').replace(extname(path), '')))
    if (route.endsWith('/index')) route = route.slice(0, -6)
    route = route.trim()
    if (route.length === 0) route = '/'

    const regex = /\[([A-Za-z0-9]+)\]/g
    if (regex.test(route)) {
      route = route.replace(regex, ':$1')
    }

    return route
  }

  addPage(path: string | string[], pageDir: PageOptions) {
    debug.pages('add', path)
    for (const p of toArray(path)) {
      const route = this.getRoute(p, pageDir)

      this._pageRouteMap.set(p, {
        path: p,
        route,
      })
    }
  }

  removePage(path: string) {
    debug.pages('remove', path)
    this._pageRouteMap.delete(path)
  }

  onUpdate() {
    if (!this._server) return

    const { moduleGraph } = this._server
    const mods = moduleGraph.getModulesByFile('/@vite-plugin-pages/generated-pages')
    if (mods) {
      const seen = new Set<ModuleNode>()
      mods.forEach((mod) => {
        moduleGraph.invalidateModule(mod, seen)
      })
    }

    debug.hmr('Reload generated pages.')
    this._server.ws.send({
      type: 'full-reload',
    })
  }

  resolveRoutes() {
    const routes = Array.from(this._pageRouteMap.values())
    return routes || []
  }

  searchGlob() {
    const pageDirFiles = this.options.dirs.map((page) => {
      const pagesDirPath = slash(resolve(this.options.root, page.dir))
      const files = getPageFiles(pagesDirPath, this.options)

      debug.search(page.dir, files)
      return {
        ...page,
        files: files.map((file) => slash(file)),
      }
    })
    for (const page of pageDirFiles) this.addPage(page.files, page)
    debug.cache(this.pageRouteMap)
  }

  get debug() {
    return debug
  }

  get pageRouteMap() {
    return this._pageRouteMap
  }
}
