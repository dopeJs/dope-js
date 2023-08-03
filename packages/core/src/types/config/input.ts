import { RollupBabelInputPluginOptions } from '@rollup/plugin-babel';
import { RollupCommonJSOptions } from '@rollup/plugin-commonjs';
import { RollupTypescriptOptions } from '@rollup/plugin-typescript';
import { Plugin } from 'rollup';

export interface InputConfig {
  root?: string;
  assetsPath?: string | Array<string>;
  pagesPath?: string;
  base?: string;
  clearScreen?: boolean;
  plugins?: Array<Plugin | null | false | undefined>;
  entry?: string | Array<string> | { [entryAlias: string]: string };
  alias?: { [aliasKey: string]: string };
  babel?: RollupBabelInputPluginOptions;
  typescript?: RollupTypescriptOptions;
  commonJs?: RollupCommonJSOptions;
}

export interface NormalizedInputConfig {
  root: string;
  assetsPath: string | Array<string>;
  pagesPath: string;
  base: string;
  clearScreen: boolean;
  plugins: Array<Plugin>;
  entry: string[] | { [entryAlias: string]: string };
  alias: { [aliasKey: string]: string };
  babel: RollupBabelInputPluginOptions;
  typescript: RollupTypescriptOptions;
  commonJs: RollupCommonJSOptions;
}
