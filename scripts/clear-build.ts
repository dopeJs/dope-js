import { readdirSync } from 'fs'
import { resolve } from 'path'
import rimraf from 'rimraf'

const cwd = process.cwd()
const pkgNames = readdirSync(resolve(cwd, 'packages'), 'utf8')
pkgNames.forEach((pkg) => {
  rimraf.sync(resolve(cwd, 'packages', pkg, 'lib'))
  rimraf.sync(resolve(cwd, 'packages', pkg, '.typing.temp'))
})
