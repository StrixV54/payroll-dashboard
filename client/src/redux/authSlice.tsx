import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { UserInterface } from "../utils/interface";

export interface AuthState {
  isAuthenticated: boolean;
  user: UserInterface | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // setting user as authentic for whole app
    userIsAuthentic: (state: AuthState, action: PayloadAction<object>) => {
      state.isAuthenticated = true;
      state.user = action.payload as UserInterface;
    },
    // resetting everything back to initialState
    resetAuth: (state: AuthState) => {
      state = { ...initialState };
    },
  },
});

export const { userIsAuthentic, resetAuth } = authSlice.actions;

export default authSlice.reducer;
