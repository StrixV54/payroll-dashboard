import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import {
  CssBaseline,
  PaletteMode,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "./redux/store";
import { useEffect, useMemo } from "react";
import { RoleLevel } from "./utils/interface";
import RouteProviderPlain from "./route/router6v4";
import { getDesignTokens } from "./material-ui/theme";
// import RouteProvider from "./route";

export default function App() {
  const mode: PaletteMode = useSelector((state: RootState) => state.theme.mode);
  const role: RoleLevel =
    useSelector((state: RootState) => state.auth.user?.role as RoleLevel) ||
    localStorage.getItem("zuco-rolelevel-cache");
  // Update the theme only if the mode changes
  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  const router = useMemo(
    () => createBrowserRouter(RouteProviderPlain(role)),
    [role]
  );

  useEffect(() => {
    localStorage.setItem("zuco-thememode-cache", mode);
  }, [mode]);

  return (
    <ThemeProvider theme={theme}>
      {/* Provides CSS RESET */}
      <CssBaseline />

      {/* Routing */}
      {/* <BrowserRouter> */}
      {/* Dynamically assigning routes according to access level */}
      {/* {<RouteProvider role={role} />} */}
      {/* Dynamically assigning routes according to access level */}
      {/* {<RouteProvider role={role} />} */}
      {/* </BrowserRouter> */}

      <RouterProvider router={router} />

      {/* React-Toaster */}
      <Toaster />
    </ThemeProvider>
  );
}
