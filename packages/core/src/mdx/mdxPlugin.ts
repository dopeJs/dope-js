import mdx from '@mdx-js/rollup';
import { Plugin } from 'vite';
import { getNormalizeConfig, MdxOptions } from './normalizeConfig';

export function mdxPlugin(userConfig?: MdxOptions): Plugin {
  return mdx(getNormalizeConfig(userConfig)) as Plugin;
}
