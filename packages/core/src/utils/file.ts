import { PkgJson } from '@/types';
import { existsSync, mkdirSync, readFileSync, rmSync, statSync } from 'fs';
import { dirname, join } from 'path/posix';
import { arraify } from './common';
import { logger } from './logger';

export interface LookupFileOptions {
  pathOnly?: boolean;
  rootDir?: string;
  predicate?: (file: string) => boolean;
}

export function lookupFile(dir: string, files: string | string[], options?: LookupFileOptions): string | undefined {
  for (const file of arraify(files)) {
    const fullPath = join(dir, file);
    if (existsSync(fullPath) && statSync(fullPath).isFile()) {
      const result = options?.pathOnly ? fullPath : readFileSync(fullPath, 'utf-8');
      if (!options?.predicate || options.predicate(result)) {
        return result;
      }
    }
  }

  const parentDir = dirname(dir);
  if (parentDir !== dir && (!options?.rootDir || parentDir.startsWith(options?.rootDir))) {
    return lookupFile(parentDir, files, options);
  }
}

export function loadPkgJson(root: string): PkgJson | undefined {
  const file = lookupFile(root, 'package.json');

  if (file) {
    try {
      const obj = JSON.parse(file);
      return obj;
    } catch (err) {
      logger.error((err as Error).message);
    }
  }
}

export function prepareDir(path: string) {
  if (existsSync(path) && statSync(path).isFile()) {
    throw new Error(`${path} is file`);
  }

  rmSync(path, { recursive: true, force: true });
  mkdirSync(path, { recursive: true });
}
