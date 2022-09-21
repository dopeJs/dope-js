import { Key, pathToRegexp } from 'path-to-regexp'

export const defaultMatchOptions: MatchOptions = {
  strict: false,
  sensitive: false,
  exact: true,
}

export type CustomMatch = (path: string, pathname: string) => MatchReturn | boolean

export type MatchReturn = [boolean, Record<string, string>]

export interface MatchOptions {
  strict: boolean
  sensitive: boolean
  exact: boolean
  customMatch?: CustomMatch
}

export const computeMatch = (pathname: string, path: string, options: MatchOptions): MatchReturn => {
  const { strict, sensitive, exact, customMatch } = options

  if (typeof customMatch === 'function') {
    const customResult = customMatch(path, pathname)
    if (typeof customResult === 'boolean') return [customResult, {}]
    return customResult
  }

  if (path === '*') {
    return [true, {}]
  }

  const keys: Key[] = []

  const matchReg = pathToRegexp(path, keys, {
    ...defaultMatchOptions,
    end: exact,
    sensitive,
    strict,
    start: false,
  })

  const matchResult = matchReg.exec(pathname)

  if (matchResult === null) {
    return [false, {}]
  }

  const params: Record<string, string> = {}

  if (keys.length > 0) {
    keys.forEach((key, index) => {
      params[String(key.name)] = matchResult[index + 1]
    })
    return [true, params]
  } else {
    return [true, {}]
  }
}
