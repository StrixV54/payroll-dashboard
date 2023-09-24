import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface AuthState {
  isAuthenticated: boolean;
  user: string | null;
  isSuperAdmin: boolean;
  isAdmin: boolean;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  isSuperAdmin: false,
  isAdmin: false,
};

export const authSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    // setting user as authentic for whole app
    userIsAuthentic: (state: AuthState, action: PayloadAction<string>) => {
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    // updating role as admin
    setAdminRole: (state: AuthState) => {
      state.isAdmin = true;
    },
    // updating role as super admin
    setSuperAdminRole: (state: AuthState) => {
      state.isSuperAdmin = true;
    },
    // resetting everything back to initialState
    resetAuth: (state) => {
      state = { ...initialState };
    },
  },
});

export const { userIsAuthentic, setAdminRole, setSuperAdminRole, resetAuth } = authSlice.actions;

export default authSlice.reducer;
