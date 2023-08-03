export interface EntryOptions {
  pagesRoot?: string
  extensions?: string[]
  exclude?: string[]
  caseSensitive?: boolean
}

export interface ResolvedEntryOptions extends Required<EntryOptions> {
  root: string
  extensionsRE: RegExp
}

export interface PageRoute {
  path: string
  route: string
}
