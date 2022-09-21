import type { RouterContext } from './context'
import { generateClientCode } from './stringify'
import type { PageResolver, PageRoute, PageRouteBase, ResolvedOptions } from './types'
import { buildRoutePath, countSlash, normalizeCase } from './utils'

function prepareRoutes(routes: PageRoute[], options: ResolvedOptions, parent?: PageRoute) {
  for (const route of routes) {
    if (parent) route.path = route.path?.replace(/^\//, '')

    if (route.children) route.children = prepareRoutes(route.children, options, route)

    delete route.rawRoute
  }

  return routes
}

async function computeRoutes(ctx: RouterContext): Promise<PageRoute[]> {
  const { caseSensitive } = ctx.options

  const pageRoutes = [...ctx.pageRouteMap.values()]
    // sort routes for HMR
    .sort((a, b) => countSlash(a.route) - countSlash(b.route))

  const routes: PageRouteBase[] = []

  pageRoutes.forEach((page) => {
    const pathNodes = page.route.split('/')
    const element = page.path.replace(ctx.root, '')
    let parentRoutes = routes

    for (let i = 0; i < pathNodes.length; i++) {
      const node = pathNodes[i]

      const route: PageRouteBase = {
        caseSensitive,
        path: '',
        rawRoute: pathNodes.slice(0, i + 1).join('/'),
      }

      if (i === pathNodes.length - 1) route.element = element

      const isIndexRoute = normalizeCase(node, caseSensitive).endsWith('index')

      if (!route.path && isIndexRoute) {
        route.path = '/'
      } else if (!isIndexRoute) {
        route.path = buildRoutePath(node)
      }

      // Check parent exits
      const parent = parentRoutes.find((parent) => {
        return pathNodes.slice(0, i).join('/') === parent.rawRoute
      })

      if (parent) {
        // Make sure children exits in parent
        parent.children = parent.children || []
        // Append to parent's children
        parentRoutes = parent.children
      }

      const exits = parentRoutes.some((parent) => {
        return pathNodes.slice(0, i + 1).join('/') === parent.rawRoute
      })
      if (!exits) parentRoutes.push(route)
    }
  })

  // sort by dynamic routes
  return prepareRoutes(routes, ctx.options)
}

async function resolveReactRoutes(ctx: RouterContext) {
  const finalRoutes = await computeRoutes(ctx)
  return generateClientCode(finalRoutes, ctx.options)
}

export function resolver(): PageResolver {
  return {
    resolveModuleIds() {
      return ['~react-pages', 'virtual:generated-pages-react']
    },
    resolveExtensions() {
      return ['tsx', 'jsx', 'ts', 'js']
    },
    async resolveRoutes(ctx) {
      return resolveReactRoutes(ctx)
    },
    async getComputedRoutes(ctx) {
      return computeRoutes(ctx)
    },
    stringify: {
      component: (path) => `React.createElement(${path})`,
      dynamicImport: (path) => `React.lazy(() => import("${path}"))`,
      final: (code) => `import React from "react";\n${code}`,
    },
  }
}
