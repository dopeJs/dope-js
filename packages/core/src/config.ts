import {
  defineConfig as viteDefineConfig,
  UserConfig as ViteUserConfig,
  ConfigEnv,
} from 'vite'

export interface UserConfig extends ViteUserConfig {}

export type UserConfigFn = (env: ConfigEnv) => UserConfig | Promise<UserConfig>
export type UserConfigExport = UserConfig | Promise<UserConfig> | UserConfigFn

export function defineConfig(config: UserConfig) {
  return viteDefineConfig(config)
}
