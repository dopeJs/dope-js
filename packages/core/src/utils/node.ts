import { execSync } from 'child_process'
import { delimiter, resolve } from 'path'
import { stdout } from 'process'

export const normolizeNodePath = (): string => {
  const nodePathArr: string[] = []
  // default node path
  if (process.env.NODE_PATH) {
    nodePathArr.push(process.env.NODE_PATH)
  }

  // @TODO 实际上 runtime 这个包应该引用 views 中的依赖，所以上线后会有所不同
  // 需要发包后进行验证和调试
  nodePathArr.push(resolve(__dirname, '..', '..', '..', '..', 'node_modules'))

  // global npm node_modules
  const npmGlobalPath = execSync('npm root -g').toString().trim()
  if (npmGlobalPath) {
    nodePathArr.push(npmGlobalPath)
  }

  // global yarn node_modules
  let yarnPath = execSync('yarn global dir').toString()
  ;(() => {
    if (yarnPath) {
      const start = yarnPath.indexOf('/')
      yarnPath = yarnPath.substring(start)
    }
  })()
  if (yarnPath) nodePathArr.push(resolve(yarnPath, 'node_modules'))

  const newNodePath = nodePathArr
    .map((item) => item.replace('\n', ''))
    .join(delimiter)

  process.env.NODE_PATH = newNodePath

  // execSync(`export NODE_PATH="${newNodePath}"`)

  return newNodePath
}

export const clearConsole = () => {
  stdout.write(
    process.platform === 'win32' ? '\x1B[2J\x1B[0f' : '\x1B[2J\x1B[3J\x1B[H'
  )
}
