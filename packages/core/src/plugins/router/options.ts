import { resolve } from 'path'
import { getPageDirs } from './files'
import { PageOptions, ResolvedOptions, RouterOptions } from './types'
import { slash, toArray } from './utils'

function resolvePageDirs(dirs: string | (string | PageOptions)[], root: string, exclude: string[]) {
  dirs = toArray(dirs)

  return dirs.flatMap((dir) => {
    const option = typeof dir === 'string' ? { dir, baseRoute: '' } : dir

    option.dir = slash(resolve(root, option.dir)).replace(`${root}/`, '')
    option.baseRoute = option.baseRoute.replace(/^\//, '').replace(/\/$/, '')

    return getPageDirs(option, root, exclude)
  })
}

export function resolveOptions(options: RouterOptions, root: string): ResolvedOptions {
  const extensions = options.extensions || ['.tsx', '.mdx', '.md']
  const exclude = options.exclude || ['.tsx', '.mdx', '.md']
  const caseSensitive = !!options.caseSensitive

  const pagesDir = options.pagesDir || ['src/pages']
  const dirs = resolvePageDirs(pagesDir, root, exclude)

  const extensionsRE = new RegExp(`\\.(${extensions.join('|')})$`)

  return {
    root,
    extensions,
    exclude,
    dirs,
    caseSensitive,
    extensionsRE,
  }
}
