import { RollupTypescriptOptions } from '@rollup/plugin-typescript';
import { InputOption, OutputOptions, Plugin } from 'rollup';

export interface IPkgMeta {
  private: boolean;
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
}

export interface IDopeRc {
  typing: boolean;
  input: InputOption;
  output: Array<OutputOptions> | OutputOptions;
  tsOpts?: RollupTypescriptOptions;
  plugins?: Array<Plugin>;
}
