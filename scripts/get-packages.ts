import { existsSync, readdirSync, readFileSync, statSync } from 'fs'
import { resolve } from 'path'
import { ModuleFormat } from 'rollup'

export interface IPkgMeta {
  private: boolean
  dependencies: Record<string, string>
  devDependencies: Record<string, string>
}

export interface IDopeRc {
  react: boolean
  typing: boolean
  entry: Record<string, string>
  formats: Array<ModuleFormat>
}

export interface IPkgInfo extends IDopeRc {
  name: string
  pkg: IPkgMeta
}

function readJSON<T>(path: string): T {
  const text = readFileSync(path, { encoding: 'utf8' })
  return JSON.parse(text)
}

function fileExists(path: string) {
  if (!existsSync(path)) return false
  return statSync(path).isFile()
}

function isQualifiedPackage(pkgMeta: IPkgMeta) {
  if (pkgMeta.private) return false
  // if (pkgMeta.scripts && pkgMeta.scripts.build) return false
  return true
}

export function getPackages(cwd?: string): Array<IPkgInfo> {
  if (!cwd) cwd = process.cwd()

  const pkgNames = readdirSync(resolve(cwd, 'packages'), 'utf8')

  if (!Array.isArray(pkgNames) || pkgNames.length === 0) return []

  const packages: Array<IPkgInfo> = []
  pkgNames.forEach((name) => {
    const pkgMetaPath = resolve(cwd!, 'packages', name, 'package.json')
    const dopeRcPath = resolve(cwd!, 'packages', name, '.doperc')
    if (fileExists(pkgMetaPath) && fileExists(dopeRcPath)) {
      const pkgMeta = readJSON<IPkgMeta>(pkgMetaPath)
      const dopeRc = readJSON<IDopeRc>(dopeRcPath)

      if (isQualifiedPackage(pkgMeta)) {
        packages.push({ name, pkg: pkgMeta, ...dopeRc })
      }
    }
  })

  return packages
}

if (require.main === module) {
  console.log(getPackages())
}
