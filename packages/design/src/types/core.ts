import { ErrorInfo, ReactNode } from 'react';
import { ColorType, DefaultTheme } from 'styled-components';

export interface IErrorBoundaryProps {
  /**
   * The method will be triggered when an error is about to be occurred.
   */
  onError?: (error: Error, info: ErrorInfo) => void;
  /**
   * The replacement element when an error is about to be occurred.
   */
  fallback?: ReactNode;
  children?: ReactNode;
}

export interface AppProps extends IErrorBoundaryProps {
  options?: IProviderConfig;
  rootId?: string;
}

export type ColorMap = Record<ColorType, Record<number, string>>;

export type FontFamilyFn = (defaults: Array<string>) => Array<string>;
export type FontFamilySetter = string | FontFamilyFn;

export type Colors = 'primary' | 'danger' | 'warn' | 'success' | ColorType;

export type CommonTheme = Omit<DefaultTheme, 'colors'>;

export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

export interface IProviderConfig extends DeepPartial<Omit<DefaultTheme, 'colors' | 'fontFamily'>> {
  colors?: { primary?: ColorType; danger?: ColorType; success?: ColorType; warn?: ColorType };
  fontFamily?: {
    base?: FontFamilySetter;
    monospace?: FontFamilySetter;
  };
}
