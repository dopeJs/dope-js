import { ColorType, DefaultTheme } from 'styled-components';

export interface IThemeContext {
  dark: boolean;
  setDark: (dark: boolean) => void;
  setPrimary: (color: ColorType) => void;
  setDanger: (color: ColorType) => void;
  setSuccess: (color: ColorType) => void;
  setWarn: (color: ColorType) => void;
  theme: DefaultTheme;
}
