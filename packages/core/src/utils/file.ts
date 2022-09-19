import { findUp } from 'find-up'

const findFileCache: Record<string, string> = {}
const getFindFileCacheKey = (cwd: string, files: string | string[]) => {
  const afterKey = Array.isArray(files)
    ? files.join('&')
    : typeof files === 'string'
    ? files
    : ''
  return `${cwd}?${afterKey}`
}

/**
 * 从用户目录访问公共目录会增加一个 privite 前缀
 */
export function handlePrivate(path: string) {
  if (path.startsWith('/private')) {
    return path.replace(/^\/private/, '')
  }
  return path
}

export const findFile = async (cwd: string, files: string | string[]) => {
  const cacheKey = getFindFileCacheKey(cwd, files)
  if (Reflect.has(findFileCache, cacheKey)) {
    return findFileCache[cacheKey]
  }

  let result: string | undefined

  if (typeof files === 'string') {
    result = await findUp(files, { cwd })
  } else {
    for (const fileName of files) {
      result = await findUp(fileName, { cwd })
      if (result) break
    }
  }

  result = result ? handlePrivate(result) : result

  if (result) {
    findFileCache[cacheKey] = result
  }
  return result || ''
}
