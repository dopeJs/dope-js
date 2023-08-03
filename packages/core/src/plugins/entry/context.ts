import { logger, slash } from '@/utils';
import chalk from 'chalk';
import { extname, relative, resolve } from 'path';
import { getPageFiles } from './files';
import { PageRoute, ResolvedEntryOptions } from './types';
import { isFile, toArray } from './utils';

export class EntryContext {
  private options: ResolvedEntryOptions;
  private _pageRouteMap = new Map<string, PageRoute>();

  constructor(options: ResolvedEntryOptions) {
    this.options = options;
    this.searchGlob();
  }

  private getRoute(path: string, pageDir: string) {
    const pageDirPath = slash(resolve(this.options.root, pageDir));
    let route = '/' + slash(path.replace(`${pageDirPath}/`, '').replace(extname(path), ''));
    if (route.endsWith('/index')) route = route.slice(0, -6);
    route = route.trim();
    if (route.length === 0) route = '/';

    const regex = /\[([A-Za-z0-9]+)\]/g;
    if (regex.test(route)) {
      route = route.replace(regex, ':$1');
    }

    return route;
  }

  private printPages(arr: Array<{ route: string; path: string }>) {
    const routeLen = arr.reduce((acc, curr) => (curr.route.trim().length > acc ? curr.route.trim().length : acc), 0);
    arr.forEach(({ route, path }) => {
      if (route.startsWith('/')) route = route.slice(1).trim();
      if (route.length === 0) route = chalk.blue(':root'.padEnd(routeLen));
      else route = chalk.blue(route.padEnd(routeLen));

      const str = [chalk.green('[route]'), chalk.blue(route), chalk.green('→'), chalk.bold.blue(path)].join(' ');

      logger.info(str);
    });
  }

  private addPage(paths: string | string[], pageDir: string) {
    const arr: Array<{ route: string; path: string }> = [];
    for (const p of toArray(paths)) {
      const route = this.getRoute(p, pageDir);

      arr.push({ route, path: p });

      const path = relative(this.options.root, p);
      this._pageRouteMap.set(p, {
        path,
        route,
      });
    }

    this.printPages(arr);
  }

  searchGlob() {
    const pagesDirPath = slash(resolve(this.options.root, this.options.pagesRoot));
    const files = getPageFiles(pagesDirPath, this.options);

    const page = {
      dir: pagesDirPath,
      files: files.map((file) => slash(file)),
    };

    this.addPage(page.files, pagesDirPath);
  }

  private checkUnderScoreAppFile() {
    const path = resolve(this.options.root, this.options.pagesRoot, '_app.tsx');
    return isFile(path);
  }

  private checkUnderScoreErrorFile() {
    const path = resolve(this.options.root, this.options.pagesRoot, '_error.tsx');
    return isFile(path);
  }

  private checkUnderScore404File() {
    const path = resolve(this.options.root, this.options.pagesRoot, '_404.tsx');
    return isFile(path);
  }

  async getEntryContent() {
    const hasAppFile = await this.checkUnderScoreAppFile();
    const has404File = await this.checkUnderScore404File();
    const hasErrorFile = await this.checkUnderScoreErrorFile();

    const fileContent = `
    import { Router } from '@dope-js/router'
    import React from 'react'
    import ReactDom from 'react-dom/client'
    ${hasAppFile ? `import Container from './${this.options.pagesRoot}/_app'` : ''}
    ${has404File ? `import NotFound from './${this.options.pagesRoot}/_404'` : ''}
    ${hasErrorFile ? `import Container from './${this.options.pagesRoot}/_error'` : ''}

    const _routes = [${Array.from(this._pageRouteMap.values())
      .map((item) => `'${item.route}'`)
      .join(', ')}]
    
    const container = document.getElementById('__dope__') || document.createElement('div')
    container.id = '__dope__'
    document.body.appendChild(container)

    const modules = {
      ${Array.from(this._pageRouteMap.values())
        .map((item) => `'${item.route}': import('./${item.path}')`)
        .join(', ')}
    };
            
    const Entry = () => {
      const routes = React.useMemo(() => {
        if (!Array.isArray(_routes) || _routes.length === 0) return []
      
        return _routes.map((item) => {
          return { path: item, dynamic: modules[item] }
        })
      }, [_routes])

      ${hasAppFile ? 'return <Container page={<Router routes={routes} />} />' : 'return <div><Router routes={routes} /></div>'}
    }
      
    ReactDom.createRoot(container).render(<Entry />)
    `;

    return fileContent;
  }
}
