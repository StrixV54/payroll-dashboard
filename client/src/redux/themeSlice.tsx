import { PaletteMode } from "@mui/material";
import { createSlice } from "@reduxjs/toolkit";

export interface ThemeState {
  mode: PaletteMode;
}

const initialState: ThemeState = {
  mode: "dark",
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
