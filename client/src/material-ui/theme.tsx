import { PaletteMode } from "@mui/material";
import { ColorConstant } from "../utils/constants";

declare module "@mui/material/styles" {
  interface TypeBackground {
    appbar?: string;
    shade?: string;
    box?: string;
    sidebar?: string;
    lightshade?: string;
    sidebarHover?: string;
    btn?: string;
  }

  interface TypeText {
    heading?: string;
  }
}

export const getDesignTokens = (mode: PaletteMode) => ({
  palette: getPaletteTheme[mode],
});

const getPaletteTheme: { [key: string]: any } = {
  light: {
    mode: "light",
    primary: {
      main: ColorConstant.LIGHT_TEAL_BG,
    },
    background: {
      appbar: ColorConstant.LIGHT_BG,
      shade: ColorConstant.LIGHT_SHADE_BG,
      lightshade: ColorConstant.LIGHT_WHITE_SHADE_BG,
      box: ColorConstant.LIGHT_TEAL_BG,
      sidebar: ColorConstant.LIGHT_SIDEBAR_BG,
      sidebarHover: ColorConstant.LIGHT_SIDEBAR_HOVER_BG,
      paper: ColorConstant.WHITE,
      btn: ColorConstant.TEAL_HOVER_BG,
    },
    text: {
      heading: ColorConstant.BLACK,
    },
  },
  dark: {
    mode: "dark",
    primary: {
      main: ColorConstant.TEAL_HOVER_BG,
    },
    background: {
      appbar: ColorConstant.TEAL_BG,
      shade: ColorConstant.BLACK,
      lightshade: ColorConstant.TEAL_LIGHT_SHADE_BG,
      box: ColorConstant.TEAL_BG,
      sidebar: ColorConstant.TEAL_SIDEBAR_BG,
      sidebarHover: ColorConstant.TEAL_SIDEBAR_HOVER_BG,
      paper: ColorConstant.TEAL_BG,
      btn: ColorConstant.TEAL_HOVER_BG,
    },
    text: {
      heading: ColorConstant.WHITE,
    },
  },
};
