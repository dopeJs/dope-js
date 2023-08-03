import { ModuleFormat } from 'rollup';

export interface OutputConfig {
  dir?: string;
  format?: ModuleFormat;
  sourcemap?: boolean;
}

export interface NormalizedOutputConfig {
  dir: string;
  format: ModuleFormat;
  sourcemap: boolean;
}
