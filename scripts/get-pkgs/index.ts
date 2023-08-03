import { existsSync } from 'fs';
import { readdir, readFile, stat } from 'fs/promises';
import { extname, resolve } from 'path';
import { IDopeRc, IPkgMeta } from '../../@types';
import { loadTsCfg } from './loadTsCfg';

export interface IPkgInfo extends IDopeRc {
  name: string;
  pkg: IPkgMeta;
}

async function readJSON<T>(path: string): Promise<T> {
  const text = await readFile(path, { encoding: 'utf8' });
  return JSON.parse(text);
}

async function fileExists(path: string) {
  path = path.trim();
  if (!existsSync(path)) return false;
  const fileStat = await stat(path);
  return fileStat.isFile();
}

function isPublic(pkgMeta: IPkgMeta) {
  return !pkgMeta.private;
}

async function readConfig(path: string): Promise<IDopeRc | null> {
  const files = ['.doperc.ts', 'doperc.js', '.doperc'];

  let filePath = '';
  for await (const file of files) {
    const temp = resolve(path, file).trim();

    if (await fileExists(temp)) {
      filePath = temp;
      break;
    }
  }

  if (!filePath) return null;

  const ext = extname(filePath);

  try {
    if (ext === '.ts') {
      return loadTsCfg(filePath);
    } else if (ext === '.js') {
      return (await import(filePath)).default;
    } else if (filePath.endsWith('/.doperc')) {
      return readJSON<IDopeRc>(filePath);
    }

    return null;
  } catch (err) {
    console.error(err);
    return null;
  }
}

export async function getPkgs(cwd: string): Promise<Array<IPkgInfo>> {
  const pkgNames = await readdir(resolve(cwd, 'packages'), 'utf8');
  if (!Array.isArray(pkgNames) || pkgNames.length === 0) return [];

  const packages: Array<IPkgInfo> = [];

  for await (const name of pkgNames) {
    const pkgRoot = resolve(cwd, 'packages', name);
    const pkgMetaPath = resolve(pkgRoot, 'package.json');
    const dopeRc = await readConfig(pkgRoot);

    const pkgJsonExists = await fileExists(pkgMetaPath);
    if (pkgJsonExists && dopeRc) {
      const pkg = await readJSON<IPkgMeta>(pkgMetaPath);
      if (isPublic(pkg)) {
        packages.push({ name, pkg, ...dopeRc });
      }
    }
  }
  return packages;
}

if (require.main === module) {
  getPkgs(process.cwd()).then(console.log);
}
