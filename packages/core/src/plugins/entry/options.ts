import { EntryOptions, ResolvedEntryOptions } from './types';

export function resolveOptions(root: string, options?: EntryOptions): ResolvedEntryOptions {
  const extensions = options?.extensions || ['.tsx', '.mdx', '.md'];
  const exclude = options?.exclude || [];
  const caseSensitive = !!options?.caseSensitive;
  const pagesRoot = options?.pagesRoot || 'src/pages';

  const extensionsRE = new RegExp(`\\.(${extensions.join('|')})$`);

  return {
    root: root.replace(/\\/g, '/'),
    extensions,
    exclude,
    pagesRoot: pagesRoot
      .replace(/^\/+/g, '')
      .replace(/\/$/g, '')
      .replace(/\/{2,}/g, '/'),
    caseSensitive,
    extensionsRE,
  };
}
