import { Alias, AliasOptions } from '@/types';
import { isObject } from '@/utils';

export function mergeAlias(a?: AliasOptions, b?: AliasOptions): AliasOptions | undefined {
  if (!a) return b;
  if (!b) return a;
  if (isObject(a) && isObject(b)) {
    return { ...a, ...b };
  }
  return [...normalizeAlias(b), ...normalizeAlias(a)];
}

export function normalizeAlias(o: AliasOptions = []): Alias[] {
  return Array.isArray(o)
    ? o.map(normalizeSingleAlias)
    : Object.keys(o).map((find) =>
        normalizeSingleAlias({
          find,
          replacement: (o as { [find: string]: string })[find],
        })
      );
}

function normalizeSingleAlias({ find, replacement, customResolver }: Alias): Alias {
  if (typeof find === 'string' && find.endsWith('/') && replacement.endsWith('/')) {
    find = find.slice(0, find.length - 1);
    replacement = replacement.slice(0, replacement.length - 1);
  }

  const alias: Alias = {
    find,
    replacement,
  };
  if (customResolver) {
    alias.customResolver = customResolver;
  }
  return alias;
}
