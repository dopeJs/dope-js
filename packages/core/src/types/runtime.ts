export interface MelonAlias {
  [key: string]: string
}

export interface MelonEnv {
  [key: string]: string | number | boolean | object | undefined
}

export type AssetFilter = string | RegExp

export interface EnvConfig {
  mode?: 'usage' | 'entry'
  debug?: boolean
  dynamicImport?: boolean
  loose?: boolean
  skip?: string[]
  include?: string[]
  exclude?: string[]
  /**
   * The version of the used core js.
   *
   */
  coreJs?: string
  targets?: unknown
  path?: string
  shippedProposals?: boolean
  /**
   * Enable all transforms
   */
  forceAllTransforms?: boolean
}

export interface DevOptions {
  port: number
  secure: boolean
  open: boolean
  hmrErrorOverlay: boolean
}

export type BuildType = 'esm' | 'cjs'

export interface BuildConfig {
  format: BuildType
  // drop: Drop[]
  env: EnvConfig | boolean
  // ecma: JscTarget
  css: Partial<CssConfig> | undefined
  sourcemap: boolean | 'external'
  xssFilter: boolean
  metafile: boolean
}

export interface CssConfig {
  targets: CssTargets | string | undefined
  extract: boolean
}

export interface CssTargets {
  android?: number
  chrome?: number
  edge?: number
  firefox?: number
  ie?: number
  ios_saf?: number
  opera?: number
  safari?: number
  samsung?: number
}

/**
 * @description fe.config.js user's configuration
 */
export interface FeWorkingConfig {
  /**
   * @version 4.x
   * target fe version(only check the main version)
   */
  version: string
  /**
   * @root
   * work root
   */
  root: string
  /**
   * @entry
   * js entry
   */
  entry: string | string[]
  /**
   * @output
   * bundle output directory
   */
  output: string
  /**
   * @default cdn will be auto filled by reading docker injected env value
   * don't use this if not necessary
   * replace default cdn domain
   */
  publicPath: string
  /**
   * prefix for fe start & fe build result
   */
  prefix: string
  /**
   * @default: public
   * static assets directory
   */
  staticDir: string
  /**
   * path resolve alias
   */
  alias: MelonAlias

  /**
   * global constant variable
   */
  env: MelonAlias
  /**
   * unbundle development options
   */
  dev: Partial<DevOptions>

  /**
   * build options
   */
  build: Partial<BuildConfig>

  /**
   * @esbuild
   * high priority config
   */
  // esbuild: EsbuildOptions

  // deploy: FeDeployConfig
  /**
   * fe start config
   */
  // start: FeStartConfig
  /**
   * http request proxy config
   */
  // proxy: FeProxy
  /**
   * the directory to place your submodules
   */
  submoduleRoot: string
  /**
   * @pwa
   * @default: true
   * enable pwa
   */
  pwa: boolean

  /**
   * @externals
   * allow to `import React` from an external variable such as `window.React`
   */
  externals: Record<string, string>
  /**
   * @assetsInclude
   */
  assets: {
    include: AssetFilter | AssetFilter[]
  }
  /**
   * @postcss
   */
  postcss: Partial<PostcssConfig>
}

export interface PostcssConfig {
  include: string[]
  exclude: string[]
}

/**
 * @description runtime means runtime generated working progress info
 */
export interface MelonRuntime {
  /**
   * @description dev period
   */
  NODE_ENV: string
  /**
   * @description user's project base dir
   */
  WORK_ROOT: string
  /**
   * @description fe work directory path
   */
  Melon_ROOT: string
  /**
   * @description fe's static resource directory
   */
  STATIC_DIR: string
  /**
   * @description tsconfig.json path
   */
  TSCONFIG_PATH: string | undefined
  /**
   * @description build file entry
   */
  BUILD_ENTRY: string[]
  /**
   * @description build file output
   */
  BUILD_OUTPUT: string
  /**
   * @description Melon's config directory
   */
  MELON_CONFIG_DIR: string
  /**
   * @description cgi directory
   */
  SERVICE_ROOT: string
  /**
   * @description user's Melon config file path
   */
  MELON_CONFIG: string | undefined
  /**
   * @description Melon's prebundle directory
   */
  MELON_BUILD_CACHE_DIR: string
  /**
   * @description Melon's temp data store
   */
  MELON_DATA_CACHE_DIR: string
  /**
   * @description alias
   */
  ALIAS: MelonAlias
  /**
   * @description env
   */
  ENV: MelonEnv
  /**
   * @description prefix for this website
   */
  PREFIX: string
  /**
   * @description publicPath
   */
  PUBLIC_PATH: string
  /**
   * @description if enable nextmode
   */
  IS_NEXTMODE: boolean
  /**
   * @description user's config
   */
  userConfig: FeWorkingConfig
  /**
   * @description
   */
  // optimizationData: DepOptimizationData | null
  /**
   * @description build polyfill env config
   */
  POLYFILL_ENV: EnvConfig | false
  /**
   * @description ecmascript version
   */
  // ECMA_VERSION: JscTarget

  // DEV_COMPILER: DevCompiler | null

  // BUILD_COMPILER: BuildCompiler | null
}
