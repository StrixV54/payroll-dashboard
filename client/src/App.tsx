import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import {
  CssBaseline,
  PaletteMode,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "./redux/store";
import { useMemo } from "react";
import { RoleLevel } from "./utils/interface";
import RouteProvider from "./route";

export default function App() {
  const mode: PaletteMode = useSelector((state: RootState) => state.theme.mode);
  const role = useSelector(
    (state: RootState) => state.auth.user?.role as RoleLevel
  );
  // console.log("Role", role);
  // Update the theme only if the mode changes
  const theme = useMemo(() => createTheme({ palette: { mode } }), [mode]);

  return (
    <ThemeProvider theme={theme}>
      {/* Provides CSS RESET */}
      <CssBaseline />

      {/* Routing */}
      <BrowserRouter>
        {/* Dynamically assigning routes according to access level */}
        {<RouteProvider role={role} />}
      </BrowserRouter>

      {/* React-Toaster */}
      <Toaster />
    </ThemeProvider>
  );
}
