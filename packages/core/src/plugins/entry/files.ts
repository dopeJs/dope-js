import { slash } from '@/utils'
import fg from 'fast-glob'
import { join } from 'path'
import { ResolvedEntryOptions } from './types'
import { extsToGlob } from './utils'

/**
 * Resolves the files that are valid pages for the given context.
 */
export function getPageFiles(path: string, options: ResolvedEntryOptions): string[] {
  const { exclude, extensions } = options

  const ext = extsToGlob(extensions)

  const files = fg.sync(slash(join(path, `**/*${ext}`)), {
    ignore: [...exclude, '**/_app.tsx', '**/_error.tsx', '**/_404.tsx'],
    onlyFiles: true,
  })

  return files
}
