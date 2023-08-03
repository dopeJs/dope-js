export interface PkgJson {
  name: string;
  version: string;
  description: string;
  type?: 'module' | 'commonjs';
  private?: boolean;
  dependencies?: { [pkgName: string]: string };
  devDependencies?: { [pkgName: string]: string };
  peerDependencies?: { [pkgName: string]: string };
}
