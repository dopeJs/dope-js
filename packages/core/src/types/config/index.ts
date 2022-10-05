import { MdxOptions } from '@/mdx'
import { RouterOptions } from '@/plugins'
import { UserConfig as ViteUserConfig } from 'vite'

export * from './config'
export * from './input'
export * from './output'
export * from './server'

export interface ConfigEnv {
  command: 'build' | 'serve'
  mode: string
}

export type UserConfig = Omit<ViteUserConfig, 'root' | 'mode' | 'cacheDir'> & {
  router?: RouterOptions
  title?: string
  entry?: string
  mdx?: MdxOptions
}

export type UserConfigFn = (env: ConfigEnv) => UserConfig | Promise<UserConfig>
export type UserConfigExport = UserConfig | Promise<UserConfig> | UserConfigFn
