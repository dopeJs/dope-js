import { existsSync } from 'fs'
import { mkdir, rm, stat } from 'fs/promises'

type Nullable<T> = T | null | undefined
type Arrayable<T> = T | Array<T>

export function toArray<T>(array?: Nullable<Arrayable<T>>): Array<T> {
  array = array || []
  if (Array.isArray(array)) return array
  return [array]
}

export function extsToGlob(extensions: string[]) {
  return extensions.length > 1 ? `{${extensions.join(',')}}` : extensions[0] || ''
}

export async function isFile(path: string) {
  if (!existsSync(path)) return false
  const fileStat = await stat(path)
  return fileStat.isFile()
}

export async function mkdirForce(path: string) {
  if (!existsSync(path)) {
    await mkdir(path, { recursive: true })
  } else {
    const fileStat = await stat(path)

    if (!fileStat.isDirectory()) {
      await rm(path, { force: true })
      await mkdir(path, { recursive: true })
    }
  }
}
