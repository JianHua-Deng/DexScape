import { useThemeProvider } from "../lib/ThemeContextProvider";
import { colors } from "./colors";

export default function getSelectorStyle(theme) {
  const isDark = theme === "dark";

  const controlBg = isDark ? colors.lightDark : colors.lightBg;
  const textColor = isDark ? colors.lightText : colors.darkText;
  const optionFocusedBg = isDark ? colors.secDarkBg : "#e2e8f0";
  const optionDefaultBg = isDark ? colors.lightDark : colors.lightBg;
  const menuBg = isDark ? colors.lightDark : colors.lightBg;

  const selectorStyles = {
    control: (base) => ({
      ...base,
      backgroundColor: controlBg,
      border: isDark ? 'none' : 'block',
    }),
    singleValue: (base) => ({
      ...base,
      color: textColor,
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused ? optionFocusedBg : optionDefaultBg,
      color: textColor,
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: menuBg,
    }),
  };

  return selectorStyles;
}

