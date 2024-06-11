import { ThemeProvider } from "@mui/material/styles";

import { primaryTheme } from "@/styles/Themes";

export default function ContextThemeProvider({ children }) {
  return <ThemeProvider theme={primaryTheme}>{children}</ThemeProvider>;
}
