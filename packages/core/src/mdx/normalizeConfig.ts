import { Options } from '@mdx-js/rollup';

export interface MdxOptions extends Options {}

const defaultConfig: MdxOptions = {
  mdExtensions: ['.md'],
  mdxExtensions: ['.mdx'],
  remarkPlugins: [],
  rehypePlugins: [],
};

export function getNormalizeConfig(userConfig?: MdxOptions): MdxOptions {
  return Object.assign(defaultConfig, userConfig || {});
}
