import { AliasOptions, UserConfig } from '@/types';
import { arraify, isObject } from '@/utils';
import { mergeAlias } from './alias';

export function mergeConfigRecursively(defaults: Record<string, unknown>, overrides: Record<string, unknown>, rootPath: string) {
  const merged: Record<string, unknown> = { ...defaults };
  for (const key in overrides) {
    const value = overrides[key];
    if (value == null) {
      continue;
    }

    const existing = merged[key];

    if (existing == null) {
      merged[key] = value;
      continue;
    }

    // fields that require special handling
    if (key === 'alias' && (rootPath === 'resolve' || rootPath === '')) {
      merged[key] = mergeAlias(existing as AliasOptions, value as AliasOptions);
      continue;
    } else if (key === 'assetsInclude' && rootPath === '') {
      merged[key] = [...((existing as Array<unknown>) || []), value];
      continue;
    } else if (key === 'noExternal' && rootPath === 'ssr' && (existing === true || value === true)) {
      merged[key] = true;
      continue;
    }

    if (Array.isArray(existing) || Array.isArray(value)) {
      merged[key] = [...arraify(existing ?? []), ...arraify(value ?? [])];
      continue;
    }
    if (isObject(existing) && isObject(value)) {
      merged[key] = mergeConfigRecursively(existing, value, rootPath ? `${rootPath}.${key}` : key);
      continue;
    }

    merged[key] = value;
  }
  return merged;
}

export function mergeConfig(defaults: UserConfig, overrides: UserConfig, isRoot = true): UserConfig {
  return mergeConfigRecursively(defaults, overrides, isRoot ? '' : '.');
}
