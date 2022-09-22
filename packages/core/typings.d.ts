/// <reference types="vite/client" />

declare module '@melon-js/routes' {
  export const routes: Array<{ path: string; route: string }>
}

declare module '@melon-js/runtime' {
  export const runApp: () => void
}
