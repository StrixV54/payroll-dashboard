import {
  BrowserRouter,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
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
import RouteProviderPlain from "./route/router6v4";

export default function App() {
  const mode: PaletteMode = useSelector((state: RootState) => state.theme.mode);
  const role: RoleLevel = useSelector(
    (state: RootState) => state.auth.user?.role as RoleLevel
  );
  // Update the theme only if the mode changes
  const theme = useMemo(() => createTheme({ palette: { mode } }), [mode]);

  const router = useMemo(
    () => createBrowserRouter(RouteProviderPlain(role)),
    [role]
  );

  return (
    <ThemeProvider theme={theme}>
      {/* Provides CSS RESET */}
      <CssBaseline />

      {/* Routing */}
      {/* <BrowserRouter> */}
      {/* Dynamically assigning routes according to access level */}
      {/* {<RouteProvider role={role} />} */}
      {/* </BrowserRouter> */}

      <RouterProvider router={router} />

      {/* React-Toaster */}
      <Toaster />
    </ThemeProvider>
  );
}
