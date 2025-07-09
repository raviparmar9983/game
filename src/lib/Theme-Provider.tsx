"use client";

import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import gameTheme from "./theme";
import { ReactNode, memo } from "react";

type Props = {
  children: ReactNode;
};

function BaseThemeProvider({ children }: Props) {
  return (
    <MuiThemeProvider theme={gameTheme}>
      <CssBaseline enableColorScheme />
      {children}
    </MuiThemeProvider>
  );
}

const ThemeProvider = memo(BaseThemeProvider);
export default ThemeProvider;
