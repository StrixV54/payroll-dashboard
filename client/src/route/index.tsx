import React from "react";
import { RoleLevel } from "../utils/interface";
import Dashboard from "../components/Dashboard";
import Department from "../components/Department";
import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "../pages/Layout";
import SignUp from "../pages/SignUp";
import SignIn from "../pages/SignIn";
import NoMatch from "../pages/NoMatch";
import SignOut from "../pages/SignOut";

export default function RouteProvider({ role }: { role: RoleLevel }) {
  switch (role) {
    case "user":
      return (
        <Routes>
          <Route path="/" element={<Navigate to="/signin" />} />
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signout" element={<SignOut />} />
          <Route path="*" element={<NoMatch />} />
        </Routes>
      );
    case "admin":
      return (
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/department" element={<Department />} />
          </Route>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signout" element={<SignOut />} />
          <Route path="*" element={<NoMatch />} />
        </Routes>
      );
    default:
      return (
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signout" element={<SignOut />} />
          <Route path="*" element={<NoMatch />} />
        </Routes>
      );
  }
}
