import { RouterContext } from './context'

export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>

export interface PageRouteBase {
  caseSensitive?: boolean
  children?: PageRouteBase[]
  element?: string
  index?: boolean
  path?: string
  rawRoute: string
}

export interface PageRoute extends Omit<Optional<PageRouteBase, 'rawRoute' | 'path'>, 'children'> {
  children?: PageRoute[]
}

export interface PageOptions {
  dir: string
  baseRoute: string
}

export interface Options {
  pagesDir?: string | (string | PageOptions)[]
  extensions: string[]
  exclude: string[]
  caseSensitive: boolean
}

export type RouterOptions = Partial<Options>

export type Awaitable<T> = T | PromiseLike<T>

export interface PageResolver {
  resolveExtensions: () => string[]
  resolveRoutes: (ctx: RouterContext) => Awaitable<string>
  getComputedRoutes: (ctx: RouterContext) => Awaitable<PageRoute[]>
  stringify?: {
    dynamicImport?: (importPath: string) => string
    component?: (importName: string) => string
    final?: (code: string) => string
  }
  hmr?: {
    added?: (ctx: RouterContext, path: string) => Awaitable<void>
    removed?: (ctx: RouterContext, path: string) => Awaitable<void>
    changed?: (ctx: RouterContext, path: string) => Awaitable<void>
  }
}

export interface ResolvedOptions extends Omit<Options, 'pagesDir'> {
  root: string
  dirs: Array<PageOptions>
  extensionsRE: RegExp
}
