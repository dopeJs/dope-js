import fg from 'fast-glob';
import { join } from 'path';
import type { ResolvedOptions } from './types';
import { extsToGlob, slash } from './utils';

/**
 * Resolves the page dirs for its for its given globs
 */
export function getPageDirs(pagesRoot: string, root: string, exclude: Array<string>): Array<string> {
  const dirs = fg.sync(slash(pagesRoot), {
    ignore: exclude,
    onlyDirectories: true,
    dot: true,
    unique: true,
    cwd: root,
  });

  return dirs;
}

/**
 * Resolves the files that are valid pages for the given context.
 */
export function getPageFiles(path: string, options: ResolvedOptions): string[] {
  const { exclude, extensions } = options;

  const ext = extsToGlob(extensions);

  const files = fg.sync(slash(join(path, `**/*${ext}`)), {
    ignore: [...exclude, '**/_app.tsx'],
    onlyFiles: true,
  });

  return files;
}
