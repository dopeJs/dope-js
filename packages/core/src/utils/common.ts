import { existsSync, readFileSync, statSync } from 'fs'
import { platform } from 'os'
import { dirname, join, posix } from 'path'

export function slash(p: string): string {
  return p.replace(/\\/g, '/')
}

export const isWindows = platform() === 'win32'

export function isObject(value: unknown): value is Record<string, unknown> {
  return Object.prototype.toString.call(value) === '[object Object]'
}

export function normalizePath(id: string): string {
  return posix.normalize(isWindows ? slash(id) : id)
}

export function arraify<T>(target: T | T[]): T[] {
  return Array.isArray(target) ? target : [target]
}

export interface LookupFileOptions {
  pathOnly?: boolean
  rootDir?: string
  predicate?: (file: string) => boolean
}

export function lookupFile(dir: string, formats: string[], options?: LookupFileOptions): string | undefined {
  for (const format of formats) {
    const fullPath = join(dir, format)
    if (existsSync(fullPath) && statSync(fullPath).isFile()) {
      const result = options?.pathOnly ? fullPath : readFileSync(fullPath, 'utf-8')
      if (!options?.predicate || options.predicate(result)) {
        return result
      }
    }
  }
  const parentDir = dirname(dir)
  if (parentDir !== dir && (!options?.rootDir || parentDir.startsWith(options?.rootDir))) {
    return lookupFile(parentDir, formats, options)
  }
}
