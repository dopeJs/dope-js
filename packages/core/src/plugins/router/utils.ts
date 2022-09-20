import Debug from 'debug'

export const dynamicRouteRE = /^\[(.+)\]$/
export const cacheAllRouteRE = /^\[\.{3}(.*)\]$/
export const replaceDynamicRouteRE = /^\[(?:\.{3})?(.*)\]$/
export const countSlashRE = /\//g

export const debug = {
  hmr: Debug('@melon-js/router-plugin:hmr'),
  routeBlock: Debug('@melon-js/router-plugin:routeBlock'),
  options: Debug('@melon-js/router-plugin:options'),
  pages: Debug('@melon-js/router-plugin:pages'),
  search: Debug('@melon-js/router-plugin:search'),
  env: Debug('@melon-js/router-plugin:env'),
  cache: Debug('@melon-js/router-plugin:cache'),
  resolver: Debug('@melon-js/router-plugin:resolver'),
}

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
  return extensions.length > 1
    ? `{${extensions.join(',')}}`
    : extensions[0] || ''
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
