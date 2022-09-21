import { resolve } from 'path'
import { ResolvedOptions } from './types'

export const dynamicRouteRE = /^\[(.+)\]$/
export const cacheAllRouteRE = /^\[\.{3}(.*)\]$/
export const replaceDynamicRouteRE = /^\[(?:\.{3})?(.*)\]$/
export const countSlashRE = /\//g

export function countSlash(value: string) {
  return (value.match(countSlashRE) || []).length
}

export function slash(str: string) {
  return str.replace(/\\/g, '/')
}

type Nullable<T> = T | null | undefined
type Arrayable<T> = T | Array<T>

export function toArray<T>(array?: Nullable<Arrayable<T>>): Array<T> {
  array = array || []
  if (Array.isArray(array)) return array
  return [array]
}

export function normalizeCase(str: string, caseSensitive: boolean) {
  if (!caseSensitive) return str.toLocaleLowerCase()
  return str
}

export function extsToGlob(extensions: string[]) {
  return extensions.length > 1 ? `{${extensions.join(',')}}` : extensions[0] || ''
}

export function isDynamicRoute(routePath: string) {
  return dynamicRouteRE.test(routePath)
}

export function isCatchAllRoute(routePath: string) {
  return cacheAllRouteRE.test(routePath)
}

export function normalizeName(name: string, isDynamic: boolean) {
  if (!isDynamic) return name

  return name.replace(replaceDynamicRouteRE, '$1')
}

export function buildRoutePath(node: string): string | undefined {
  const isDynamic = isDynamicRoute(node)
  const isCatchAll = isCatchAllRoute(node)
  const normalizedName = normalizeName(node, isDynamic)

  if (isDynamic) {
    if (isCatchAll) return '*'

    return `:${normalizedName}`
  }

  return `${normalizedName}`
}

function isPagesDir(path: string, options: ResolvedOptions) {
  for (const page of options.dirs) {
    const dirPath = slash(resolve(options.root, page.dir))
    if (path.startsWith(dirPath)) return true
  }
  return false
}

export function isTarget(path: string, options: ResolvedOptions) {
  return isPagesDir(path, options) && options.extensionsRE.test(path)
}
