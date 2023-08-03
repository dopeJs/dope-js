import { ThemeContext } from '@/core';
import { useContext } from 'react';

export function useTheme() {
  const { theme, setPrimary, setSuccess, setWarn, setDanger } = useContext(ThemeContext)!;
  return { theme, setPrimary, setSuccess, setWarn, setDanger };
}
