import { ConfigEnv, UserConfig } from '@/types';
import { build } from 'esbuild';
import { existsSync, readFileSync, realpathSync, statSync, unlinkSync, writeFileSync } from 'fs';
import { readFile } from 'fs/promises';
import { createRequire } from 'module';
import { dirname, extname, isAbsolute, join, relative, resolve } from 'path';
import { pathToFileURL } from 'url';

export interface LookupFileOptions {
  pathOnly?: boolean;
  rootDir?: string;
  predicate?: (file: string) => boolean;
}

export function lookupFile(dir: string, formats: string[], options?: LookupFileOptions): string | undefined {
  for (const format of formats) {
    const fullPath = join(dir, format);
    if (existsSync(fullPath) && statSync(fullPath).isFile()) {
      const result = options?.pathOnly ? fullPath : readFileSync(fullPath, 'utf-8');
      if (!options?.predicate || options.predicate(result)) {
        return result;
      }
    }
  }
  const parentDir = dirname(dir);
  if (parentDir !== dir && (!options?.rootDir || parentDir.startsWith(options?.rootDir))) {
    return lookupFile(parentDir, formats, options);
  }
}

export async function bundleConfigFile(fileName: string, isESM: boolean): Promise<{ code: string; dependencies: string[] }> {
  const dirnameVarName = '__vite_injected_original_dirname';
  const filenameVarName = '__vite_injected_original_filename';
  const importMetaUrlVarName = '__vite_injected_original_import_meta_url';
  const result = await build({
    absWorkingDir: process.cwd(),
    entryPoints: [fileName],
    outfile: 'out.js',
    write: false,
    target: ['node14.18', 'node16'],
    platform: 'node',
    bundle: true,
    format: isESM ? 'esm' : 'cjs',
    sourcemap: 'inline',
    metafile: true,
    define: {
      __dirname: dirnameVarName,
      __filename: filenameVarName,
      'import.meta.url': importMetaUrlVarName,
    },
    plugins: [
      {
        name: 'externalize-deps',
        setup(build) {
          build.onResolve({ filter: /.*/ }, ({ path: id, importer }) => {
            if (id[0] !== '.' && !isAbsolute(id)) {
              return {
                external: true,
              };
            }

            const idFsPath = resolve(dirname(importer), id);
            const idPkgPath = lookupFile(idFsPath, [`package.json`], {
              pathOnly: true,
            });
            if (idPkgPath) {
              const idPkgDir = dirname(idPkgPath);
              if (relative(idPkgDir, fileName).startsWith('..')) {
                return {
                  path: isESM ? pathToFileURL(idFsPath).href : idFsPath,
                  external: true,
                };
              }
            }
          });
        },
      },
      {
        name: 'inject-file-scope-variables',
        setup(build) {
          build.onLoad({ filter: /\.[cm]?[jt]s$/ }, async (args) => {
            const contents = await readFile(args.path, 'utf8');
            const injectValues =
              `const ${dirnameVarName} = ${JSON.stringify(dirname(args.path))};` +
              `const ${filenameVarName} = ${JSON.stringify(args.path)};` +
              `const ${importMetaUrlVarName} = ${JSON.stringify(pathToFileURL(args.path).href)};`;

            return {
              loader: args.path.endsWith('ts') ? 'ts' : 'js',
              contents: injectValues + contents,
            };
          });
        },
      },
    ],
  });
  const { text } = result.outputFiles[0];
  return {
    code: text,
    dependencies: result.metafile ? Object.keys(result.metafile.inputs) : [],
  };
}

interface NodeModuleWithCompile extends NodeModule {
  _compile(code: string, filename: string): unknown;
}

const _require = createRequire(import.meta.url) as NodeRequire & { extensions: NodeJS.RequireExtensions };

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
export const usingDynamicImport = typeof jest === 'undefined';
const dynamicImport = usingDynamicImport ? new Function('file', 'return import(file)') : _require;

export type UserConfigFn = (env: ConfigEnv) => UserConfig | Promise<UserConfig>;
export type UserConfigExport = UserConfig | Promise<UserConfig> | UserConfigFn;

export async function loadConfigFromBundledFile(fileName: string, bundledCode: string, isESM: boolean): Promise<UserConfigExport | null> {
  if (isESM) {
    const fileBase = `${fileName}.timestamp-${Date.now()}`;
    const fileNameTmp = `${fileBase}.mjs`;
    const fileUrl = `${pathToFileURL(fileBase)}.mjs`;
    writeFileSync(fileNameTmp, bundledCode);
    try {
      return (await dynamicImport(fileUrl)).default;
    } finally {
      try {
        unlinkSync(fileNameTmp);
      } catch {
        // already removed if this function is called twice simultaneously
      }
    }
  } else {
    const extension = extname(fileName);
    const realFileName = realpathSync(fileName);
    const loaderExt = extension in _require.extensions ? extension : '.js';
    const defaultLoader = _require.extensions[loaderExt]!;
    _require.extensions[loaderExt] = (module: NodeModule, filename: string) => {
      if (filename === realFileName) {
        (module as NodeModuleWithCompile)._compile(bundledCode, filename);
      } else {
        defaultLoader(module, filename);
      }
    };
    // clear cache in case of server restart
    delete _require.cache[_require.resolve(fileName)];
    const raw = _require(fileName);
    _require.extensions[loaderExt] = defaultLoader;
    return raw.__esModule ? raw.default : raw;
  }
}
