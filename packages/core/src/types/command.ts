export interface IRootOptions {
  cwd?: string;
  config?: string;
}

export interface IServerOption {
  port?: number;
  host?: string;
}

export interface IDevOptions extends IRootOptions, IServerOption {
  keepAliveTimeout?: number;
}

export interface IBuildOptions extends IRootOptions {}
