import { CommonTheme, FontFamilySetter, IProviderConfig } from '@/types';
import { FontSizeTheme, FontWeightTheme } from 'styled-components';

const defaultFontFamilyBase = [
  '-apple-system',
  'BlinkMacSystemFont',
  'Helvetica Neue',
  'Tahoma',
  'PingFang SC',
  'Microsoft Yahei',
  'Hiragino Sans GB',
  'sans-serif',
  'Apple Color Emoji',
  'Segoe UI Emoji',
  'Segoe UI Symbol',
  'Noto Color Emoji',
];

const defaultFontFamilyMonospace = ['Consolas', 'Monaco', 'Andale Mono', 'Ubuntu Mono', 'monospace'];

function normalizeFontName(fontName: string) {
  fontName = fontName.trim();
  if (!/\s+/g.test(fontName)) return fontName;
  if (!fontName.startsWith(`'`)) fontName = `'${fontName}`;
  if (!fontName.endsWith(`'`)) fontName = `${fontName}'`;
  return fontName;
}

function getFontFamily(defaults: Array<string>, setter?: FontFamilySetter) {
  if (!setter) return defaults.map(normalizeFontName).join(', ');
  if (typeof setter === 'function') {
    return setter(defaults).map(normalizeFontName).join(', ');
  }
  return setter;
}

function getFontWeightTheme(options?: IProviderConfig): FontWeightTheme {
  return {
    light: options?.fontWeight?.light || 300,
    normal: options?.fontWeight?.normal || 400,
    semiBold: options?.fontWeight?.semiBold || 500,
    bold: options?.fontWeight?.bold || 600,
  };
}

function getFontSizeTheme(options?: IProviderConfig): FontSizeTheme {
  return {
    base: options?.fontSize?.base || '14px',
    small: options?.fontSize?.small || '12px',
    heading: {
      h1: options?.fontSize?.heading?.h1 || '24px',
      h2: options?.fontSize?.heading?.h2 || '24px',
      h3: options?.fontSize?.heading?.h3 || '24px',
      h4: options?.fontSize?.heading?.h4 || '24px',
      h5: options?.fontSize?.heading?.h5 || '24px',
      h6: options?.fontSize?.heading?.h6 || '24px',
    },
  };
}

export function getCommonTheme(options?: IProviderConfig): CommonTheme {
  return {
    borderRadius: options?.borderRadius || '4px',
    fontWeight: getFontWeightTheme(options),
    fontSize: getFontSizeTheme(options),
    fontFamily: {
      base: getFontFamily(defaultFontFamilyBase, options?.fontFamily?.base),
      monospace: getFontFamily(defaultFontFamilyMonospace, options?.fontFamily?.monospace),
    },
  };
}
