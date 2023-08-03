import { Plugin as EPlugin } from 'esbuild';
import { resolve } from 'path/posix';
import { Plugin } from 'rollup';
import { displayId, moduleId as _moduleId } from './constant';
import { EntryContext } from './context';
import { resolveOptions } from './options';
import { EntryOptions } from './types';

export function dopeEntry1(root: string, options?: EntryOptions): EPlugin {
  const resolvedOpts = resolveOptions(root, options);
  const ctx = new EntryContext(resolvedOpts);
  const moduleId = resolve(root, _moduleId);

  return {
    name: '@dope-js/plugin-entry',
    setup({ onLoad, onResolve }) {
      onResolve({ filter: new RegExp(displayId) }, ({ path, kind }) => {
        if (path === displayId && kind === 'entry-point') {
          return { path: moduleId, external: false };
        }

        return null;
      });

      onLoad({ filter: /index\.tsx/ }, async (args) => {
        if (args.path === moduleId) {
          const contents = await ctx.getEntryContent();
          return { contents, loader: 'tsx' };
        }

        return null;
      });
    },
  };
}

export function dopeEntry(root: string, options?: EntryOptions): Plugin {
  const resolvedOpts = resolveOptions(root, options);
  const ctx = new EntryContext(resolvedOpts);
  const moduleId = resolve(root, _moduleId);

  return {
    name: '@dope-js/plugin-entry',
    // enforce: 'pre',
    // configResolved(config) {
    //   ctx = new EntryContext(pageDir, config.root)
    // },
    resolveId: {
      order: 'pre',
      handler(id) {
        if (id === displayId) return { id: moduleId, external: false };
        return null;
      },
    },
    load: {
      order: 'pre',
      handler(id) {
        if (id === moduleId) return ctx.getEntryContent();
        return null;
      },
    },
  };
}
