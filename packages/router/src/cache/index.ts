/**
 * @cache
 * render element cache store
 */

import { useRef } from 'react';

export interface IRouterCache {
  setPreserveParams(key: string, value: string): void;

  getPreserveParams(): Record<string, string>;
  getPreserveParams(key: string): string | undefined;
  getPreserveParams(key?: string): string | undefined | Record<string, string>;
}

export class RouterCache implements IRouterCache {
  private preserveParams: Record<string, string> = {};

  setPreserveParams = (key: string, value: string) => {
    Reflect.set(this.preserveParams, key, value);
  };

  getPreserveParams(): Record<string, string>;
  getPreserveParams(key: string): string | undefined;
  getPreserveParams(key?: string): string | undefined | Record<string, string> {
    if (key === undefined) return this.preserveParams;
    return Reflect.get(this.preserveParams, key);
  }
}

export const useRouterCache = () => {
  const cacheRef = useRef<RouterCache | null>(null);

  if (!cacheRef.current) {
    cacheRef.current = new RouterCache();
  }

  return cacheRef.current;
};
