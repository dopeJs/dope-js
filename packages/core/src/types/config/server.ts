import { WatchOptions } from 'chokidar'
import { OutgoingHttpHeaders, Server } from 'http'
import { ServerOptions } from 'http-proxy'
import { ServerOptions as HttpsServerOptions } from 'https'

export type CorsOrigin = boolean | string | RegExp | (string | RegExp)[]

export interface CorsOptions {
  origin?: CorsOrigin | ((origin: string, cb: (err: Error, origins: CorsOrigin) => void) => void)
  methods?: string | string[]
  allowedHeaders?: string | string[]
  exposedHeaders?: string | string[]
  credentials?: boolean
  maxAge?: number
  preflightContinue?: boolean
  optionsSuccessStatus?: number
}

export interface HmrOptions {
  protocol?: string
  host?: string
  port?: number
  clientPort?: number
  path?: string
  timeout?: number
  overlay?: boolean
  server?: Server
}

export interface CommonServerConfig {
  /**
   * Specify which IP addresses the server should listen on.
   * If `true`, set to 0.0.0.0 to listen on all address
   */
  host?: boolean | string
  /**
   * Specify server port.
   * If the port is already being used, Dope will automatically try the next available port.
   */
  port?: number
  /**
   * If enabled, vite will exit if specified port is already in use
   */
  strictPort?: boolean
  /**
   * Enable TLS + HTTP/2.
   */
  https?: boolean | HttpsServerOptions
  /**
   * Open browser window on startup
   */
  open?: boolean | string
  /**
   * Configure custom proxy rules
   * Uses [`http-proxy`](https://github.com/http-party/node-http-proxy).
   * Full options [here](https://github.com/http-party/node-http-proxy#options).
   */
  proxy?: Record<string, string | ServerOptions>
  /**
   * Configure CORS for the dev server.
   * Uses https://github.com/expressjs/cors.
   * If `true`, allow all methods from any origin
   */
  cors?: CorsOptions | boolean
  /**
   * Specify server response headers.
   */
  headers?: OutgoingHttpHeaders
}

export interface NormalizeCommonServerConfig {
  /**
   * Specify which IP addresses the server should listen on.
   * If `true`, set to 0.0.0.0 to listen on all address
   */
  host: boolean | string
  /**
   * Specify server port.
   * If the port is already being used, Dope will automatically try the next available port.
   */
  port: number
  /**
   * If enabled, vite will exit if specified port is already in use
   */
  strictPort: boolean
  /**
   * Enable TLS + HTTP/2.
   */
  https: boolean | HttpsServerOptions
  /**
   * Open browser window on startup
   */
  open: boolean | string
  /**
   * Configure custom proxy rules
   * Uses [`http-proxy`](https://github.com/http-party/node-http-proxy).
   * Full options [here](https://github.com/http-party/node-http-proxy#options).
   */
  proxy: Record<string, string | ServerOptions>
  /**
   * Configure CORS for the dev server.
   * Uses https://github.com/expressjs/cors.
   * If `true`, allow all methods from any origin
   */
  cors: CorsOptions | boolean
  /**
   * Specify server response headers.
   */
  headers: OutgoingHttpHeaders
}

export interface DevServerConfig extends CommonServerConfig {
  /**
   * Configure HMR-specific options
   */
  hmr?: HmrOptions | boolean
  /**
   * chokidar watch options
   * https://github.com/paulmillr/chokidar#api
   */
  watch?: WatchOptions
  base?: string
  origin?: string
}

export interface NormalizeDevServerConfig extends NormalizeCommonServerConfig {
  /**
   * Configure HMR-specific options
   */
  hmr: HmrOptions | boolean
  /**
   * chokidar watch options
   * https://github.com/paulmillr/chokidar#api
   */
  watch: WatchOptions
  base: string
  origin: string
}
