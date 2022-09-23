import { Options } from 'prettier'

export const moduleId = '/dopejs-js/runtime/index.tsx'
export const displayId = '@dopejs-js/runtime'

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
}
