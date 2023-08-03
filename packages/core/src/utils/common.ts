import { platform } from 'os'
import { posix } from 'path'

export const countSlashRE = /\//g

export function countSlash(value: string) {
  return (value.match(countSlashRE) || []).length
}

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
