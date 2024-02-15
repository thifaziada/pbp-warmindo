import { useContext } from 'react';
import { ThemeContext } from './theme.context';
export const useTheme = () => {
  const themeContext = useContext(ThemeContext);
  return themeContext;
};
//# sourceMappingURL=theme.hook.js.map