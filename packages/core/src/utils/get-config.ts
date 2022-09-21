import { IServerOption } from '@/types'
import react from '@vitejs/plugin-react'
import findUp from 'find-up'
import { join } from 'path'
import { PluginOption, UserConfig } from 'vite'
import eslint from 'vite-plugin-eslint'

const findFileCache: Record<string, string> = {}
const getFindFileCacheKey = (cwd: string, files: string | string[]) => {
  const afterKey = Array.isArray(files) ? files.join('&') : typeof files === 'string' ? files : ''
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

export async function findConfigFile(cwd: string) {
  const files = ['melon.config.ts', 'melon.config.js']

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

export async function getDefaultConfig(cwd: string, isProduction: boolean, server?: IServerOption) {
  const plugins: Array<PluginOption> = [
    react({
      babel: {
        plugins: ['@babel/plugin-transform-runtime'],
        presets: [
          [
            '@babel/preset-react',
            {
              runtime: 'automatic',
            },
          ],
        ],
      },
    }),
    eslint(),
  ]

  const config: UserConfig = {
    root: cwd,
    mode: isProduction ? 'production' : 'development',
    cacheDir: 'node_modules/.melon.cache',
    resolve: {
      alias: { '@': join(cwd, 'src') },
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.mdx', '.md'],
    },
    plugins,
    build: {
      sourcemap: !isProduction,
    },
  }

  if (server) {
    if (!isProduction) {
      config.server = {
        host: server?.host || 'localhost',
        port: server?.port || 4000,
        open: '/',
      }
    } else {
      config.preview = {
        host: server?.host || 'localhost',
        port: server?.port || 8080,
      }
    }
  }

  return config
}
