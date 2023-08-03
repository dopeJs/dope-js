import { Location } from 'history';
import { parseURL } from 'url-toolkit';

interface IPathnameInfo {
  pathname: string;
  search: string;
  hash: string;
}

export const parsePathname = (pathname: string): IPathnameInfo => {
  if (!pathname) {
    return {
      pathname: '',
      search: '',
      hash: '',
    };
  }

  const { path = '', query = '', fragment = '' } = parseURL(pathname) || {};

  return {
    pathname: path,
    search: query,
    hash: fragment,
  };
};

export const formatRawLocation = (location: Location): Location => {
  const result = { ...location };
  const { pathname, search, hash } = result;
  const parseResult = parsePathname(pathname);
  result.search = search || parseResult.search;
  result.hash = hash || parseResult.hash;
  return result;
};

export interface ISearchParam {
  obj: Record<string, string>;
  raw: string;
}

export const parseSearchParams = (raw: string): ISearchParam => {
  if (!raw) {
    return {
      obj: {},
      raw: '',
    };
  }

  const queryString = raw.startsWith('?') ? raw : `?${raw}`;

  const query: Record<string, string> = {};
  const iterableEntries = new URLSearchParams(queryString).entries();
  for (const [key, value] of iterableEntries) {
    query[key] = value;
  }

  return {
    obj: query,
    raw: queryString,
  };
};
