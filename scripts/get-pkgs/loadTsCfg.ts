import { build } from 'esbuild'
import { existsSync, readFileSync, realpathSync, statSync } from 'fs'
import { readFile } from 'fs/promises'
import { createRequire } from 'module'
import { dirname, extname, isAbsolute, join, relative, resolve } from 'path'
import { pathToFileURL } from 'url'
import { IDopeRc } from '../../@types'

const _require = createRequire(import.meta.url) as NodeRequire & { extensions: NodeJS.RequireExtensions }

function getFilePathMeta(path: string): { dir: string; filename: string } {
  const dir = dirname(path)
  let filename = path.slice(dir.length)
  if (/^\/+/.test(filename)) filename = filename.replace(/^\/+/, '')

  return { dir, filename }
}

interface LookupFileOptions {
  pathOnly?: boolean
  rootDir?: string
  predicate?: (file: string) => boolean
}

export function lookupFile(dir: string, formats: string[], options?: LookupFileOptions): string | undefined {
  for (const format of formats) {
    const fullPath = join(dir, format)
    if (existsSync(fullPath) && statSync(fullPath).isFile()) {
      const result = options?.pathOnly ? fullPath : readFileSync(fullPath, 'utf-8')
      if (!options?.predicate || options.predicate(result)) {
        return result
      }
    }
  }
  const parentDir = dirname(dir)
  if (parentDir !== dir && (!options?.rootDir || parentDir.startsWith(options?.rootDir))) {
    return lookupFile(parentDir, formats, options)
  }
}

async function bundleConfigFile(path: string) {
  const { dir, filename } = getFilePathMeta(path)

  const dirnameVarName = '__injected_original_dirname'
  const filenameVarName = '__injected_original_filename'
  const importMetaUrlVarName = '__injected_original_import_meta_url'

  const result = await build({
    absWorkingDir: dir,
    entryPoints: [filename],
    outfile: 'out.js',
    write: false,
    target: ['node14.18', 'node16'],
    platform: 'node',
    bundle: true,
    format: 'cjs',
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
              }
            }

            const idFsPath = resolve(dirname(importer), id)
            const idPkgPath = lookupFile(idFsPath, [`package.json`], {
              pathOnly: true,
            })
            if (idPkgPath) {
              const idPkgDir = dirname(idPkgPath)
              if (relative(idPkgDir, filename).startsWith('..')) {
                return {
                  path: idFsPath,
                  external: true,
                }
              }
            }
          })
        },
      },
      {
        name: 'inject-file-scope-variables',
        setup(build) {
          build.onLoad({ filter: /\.[cm]?[jt]s$/ }, async (args) => {
            const contents = await readFile(args.path, 'utf8')
            const injectValues =
              `const ${dirnameVarName} = ${JSON.stringify(dirname(args.path))};` +
              `const ${filenameVarName} = ${JSON.stringify(args.path)};` +
              `const ${importMetaUrlVarName} = ${JSON.stringify(pathToFileURL(args.path).href)};`

            return {
              loader: args.path.endsWith('ts') ? 'ts' : 'js',
              contents: injectValues + contents,
            }
          })
        },
      },
    ],
  })

  const { text } = result.outputFiles[0]
  return {
    code: text,
    dependencies: result.metafile ? Object.keys(result.metafile.inputs) : [],
  }
}

interface NodeModuleWithCompile extends NodeModule {
  _compile(code: string, filename: string): unknown
}

async function loadConfigFromBundledFile(path: string, bundledCode: string): Promise<IDopeRc | null> {
  const extension = extname(path)
  const realFileName = realpathSync(path)
  const loaderExt = extension in _require.extensions ? extension : '.js'
  const defaultLoader = _require.extensions[loaderExt]!
  _require.extensions[loaderExt] = (module: NodeModule, filename: string) => {
    if (filename === realFileName) {
      ;(module as NodeModuleWithCompile)._compile(bundledCode, filename)
    } else {
      defaultLoader(module, filename)
    }
  }

  delete _require.cache[_require.resolve(path)]
  const raw = _require(path)
  _require.extensions[loaderExt] = defaultLoader
  return raw.__esModule ? raw.default : raw
}

export async function loadTsCfg(path: string): Promise<IDopeRc | null> {
  try {
    const bundled = await bundleConfigFile(path)
    return loadConfigFromBundledFile(path, bundled.code)
  } catch (err) {
    console.error(err)
    return null
  }
}
