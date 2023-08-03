import { Options } from 'prettier';

export const moduleId = '__dope_index.tsx';
export const displayId = 'index.tsx';
export const htmlModuleId = 'index.html';
export const htmlDisplayId = 'index.html';

export const prettierCfg: Options = {
  parser: 'typescript',
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  semi: false,
  singleQuote: true,
  trailingComma: 'es5',
  bracketSpacing: true,
  jsxBracketSameLine: false,
};
