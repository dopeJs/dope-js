import { DefaultTheme } from 'styled-components';

export * from './components';
export * from './core';
export * from './hooks';
export * from './types';

export interface ThemedComponent {
  theme: DefaultTheme;
}
