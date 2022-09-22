import { existsSync } from 'fs'
import { mkdir, rm, stat } from 'fs/promises'

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
