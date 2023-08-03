/// <reference types="vite/client" />

declare module '@dope-js/routes' {
  export const routes: Array<{ path: string; route: string }>;
}

declare module '@dope-js/runtime' {
  export const runApp: () => void;
}
