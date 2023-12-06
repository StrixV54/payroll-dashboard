import { PaletteMode } from "@mui/material";
import { createSlice } from "@reduxjs/toolkit";

export interface ThemeState {
  mode: PaletteMode;
}

const cachedTheme = localStorage.getItem("zuco-thememode-cache");

const initialState: ThemeState = {
  mode: (cachedTheme as PaletteMode) || "light",
};

export const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    // setting theme for whole app
    changeMode: (state: ThemeState) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
  },
});

export const { changeMode } = themeSlice.actions;

export default themeSlice.reducer;
