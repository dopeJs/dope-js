class RouterMetainfo {
  base = '';
}

const routerMetainfo = new RouterMetainfo();

export const setBase = (base: string) => {
  routerMetainfo.base = base.replace(/^\/+/, '').replace(/\/+$/, '');
};

export const appendPrefix = (path: string): string => {
  const base = Reflect.get(routerMetainfo, 'base');
  const prefix = base.length === 0 ? '' : `/${base}`;
  return prefix + path;
};

export const removePrefix = (path: string): string => {
  const base = Reflect.get(routerMetainfo, 'base');

  let wip: string;

  if (path.startsWith(base)) {
    wip = path.replace(base, '');
  } else if (path.startsWith(`/${base}`)) {
    wip = path.replace(`/${base}`, '');
  } else {
    return path;
  }
  if (!wip.startsWith('/')) wip = '/' + wip;

  return wip;
};
