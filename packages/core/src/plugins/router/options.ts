import { ResolvedOptions, RouterOptions } from './types'

export function resolveOptions(options: RouterOptions, root: string): ResolvedOptions {
  const extensions = options.extensions || ['.tsx', '.mdx', '.md']
  const exclude = options.exclude || []
  const caseSensitive = !!options.caseSensitive

  const pagesRoot = options.pagesRoot || 'src/pages'

  const extensionsRE = new RegExp(`\\.(${extensions.join('|')})$`)

  return {
    root,
    extensions,
    exclude,
    pagesRoot,
    caseSensitive,
    extensionsRE,
  }
}
