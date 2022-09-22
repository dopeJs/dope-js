import chalk from 'chalk'
import { extname, join, resolve } from 'path'
import type { FSWatcher, Logger, ModuleNode, ViteDevServer } from 'vite'
import { moduleId } from './constant'
import { getPageFiles } from './files'
import { resolveOptions } from './options'
import { ResolvedOptions, RouterOptions } from './types'
import { isTarget, slash, toArray } from './utils'

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
    this.options = resolveOptions(options, this.root)
  }

  setLogger(logger: Logger) {
    this.logger = logger
  }

  setupViteServer(server: ViteDevServer) {
    if (this._server === server) return

    this._server = server
    this.setupWatcher(server.watcher)
  }

  getPagesRoot() {
    return join(this.options.root, this.options.pagesRoot, '**/*{.tsx,.jsx,.md,.mdx}')
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
      this.addPage(path, this.options.pagesRoot)
      this.onUpdate()
    })
  }

  getRoute(path: string, pageDir: string) {
    const pageDirPath = slash(resolve(this.root, pageDir))
    let route = '/' + slash(path.replace(`${pageDirPath}/`, '').replace(extname(path), ''))
    if (route.endsWith('/index')) route = route.slice(0, -6)
    route = route.trim()
    if (route.length === 0) route = '/'

    const regex = /\[([A-Za-z0-9]+)\]/g
    if (regex.test(route)) {
      route = route.replace(regex, ':$1')
    }

    return route
  }

  addPage(paths: string | string[], pageDir: string) {
    this.logger?.info(chalk.green.bold('new page found'))

    for (const p of toArray(paths)) {
      const route = this.getRoute(p, pageDir)

      this.logger?.info(`${chalk.bold.bgBlue.white(`${route}`)} - ${chalk.gray.italic(p)}`)

      const path = p.slice(this.root.length)
      this._pageRouteMap.set(p, {
        path,
        route,
      })
    }
  }

  removePage(path: string) {
    this.logger?.info(`${chalk.red.bold('page deleted')} - ${chalk.gray.italic(path)}`)
    this._pageRouteMap.delete(path)
  }

  onUpdate() {
    if (!this._server) return

    const { moduleGraph } = this._server
    const mods = moduleGraph.getModulesByFile(moduleId)
    if (mods) {
      const seen = new Set<ModuleNode>()
      mods.forEach((mod) => {
        moduleGraph.invalidateModule(mod, seen)
      })
    }

    this.logger?.info(`Reload pages...`)
    this._server.ws.send({
      type: 'full-reload',
    })
  }

  resolveRoutes() {
    const routes = Array.from(this._pageRouteMap.values())
    return routes || []
  }

  searchGlob() {
    const pagesDirPath = slash(resolve(this.options.root, this.options.pagesRoot))
    const files = getPageFiles(pagesDirPath, this.options)

    const page = {
      dir: pagesDirPath,
      files: files.map((file) => slash(file)),
    }

    this.addPage(page.files, pagesDirPath)
  }

  get pageRouteMap() {
    return this._pageRouteMap
  }

  getFileContent() {
    const routes = this.resolveRoutes()
    return `export const routes = ${JSON.stringify(routes)}`
  }
}
