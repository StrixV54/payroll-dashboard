import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface AuthState {
  isAuthenticated: boolean;
  user: object | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
};

export const authSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    // setting user as authentic for whole app
    userIsAuthentic: (state: AuthState, action: PayloadAction<object>) => {
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    // resetting everything back to initialState
    resetAuth: (state: AuthState) => {
      state = { ...initialState };
    },
  },
});

export const { userIsAuthentic, resetAuth } = authSlice.actions;

export default authSlice.reducer;
