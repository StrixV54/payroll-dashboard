import { RoleLevel } from "../utils/interface";
import Dashboard from "../components/Dashboard";
import Department from "../components/Department";
import { Navigate } from "react-router-dom";
import Layout from "../pages/Layout";
import SignUp from "../pages/SignUp";
import SignIn from "../pages/SignIn";
import SignOut from "../pages/SignOut";
import ErrorPage from "../pages/ErrorPage";
import ViewProfile from "../pages/ViewProfile";
import JobDetails from "../pages/JobDetails";

export default function RouteProviderPlain(role: RoleLevel) {
  switch (role) {
    case "employee":
      return [
        {
          errorElement: <ErrorPage />,
          children: [
            {
              path: "/signin",
              Component: SignIn,
            },
            {
              path: "/signup",
              Component: SignUp,
            },
            {
              path: "/signout",
              Component: SignOut,
            },
            {
              path: "/",
              Component: Layout,
              children: [
                {
                  path: "/",
                  element: <Navigate to="/dashboard" />,
                },
                {
                  path: "dashboard",
                  Component: Dashboard,
                },
                {
                  path: "viewprofile",
                  Component: ViewProfile,
                },
                {
                  path: "jobdetails",
                  Component: JobDetails,
                },
              ],
            },
          ],
        },
      ];
    case "payroll manager":
      return [
        {
          errorElement: <ErrorPage />,
          children: [
            {
              path: "/signin",
              Component: SignIn,
            },
            {
              path: "/signup",
              Component: SignUp,
            },
            {
              path: "/signout",
              Component: SignOut,
            },
            {
              path: "/",
              Component: Layout,
              children: [
                {
                  path: "/",
                  element: <Navigate to="/dashboard" />,
                },
                {
                  path: "dashboard",
                  Component: Dashboard,
                },
                {
                  path: "department",
                  Component: Department,
                },
                {
                  path: "jobdetails",
                  Component: JobDetails,
                },
              ],
            },
          ],
        },
      ];
    case "super admin":
      return [
        {
          errorElement: <ErrorPage />,
          children: [
            {
              path: "/signin",
              Component: SignIn,
            },
            {
              path: "/signup",
              Component: SignUp,
            },
            {
              path: "/signout",
              Component: SignOut,
            },
            {
              path: "/",
              Component: Layout,
              children: [
                {
                  path: "/",
                  element: <Navigate to="/dashboard" />,
                },
                {
                  path: "/dashboard",
                  Component: Dashboard,
                },
              ],
            },
          ],
        },
      ];
    default:
      return [
        {
          errorElement: <ErrorPage />,
          children: [
            {
              path: "/signin",
              Component: SignIn,
            },
            {
              path: "/signup",
              Component: SignUp,
            },
            {
              path: "/signout",
              Component: SignOut,
            },
            {
              path: "/",
              Component: Layout,
              children: [
                {
                  path: "/",
                  element: <Navigate to="/dashboard" />,
                },
                {
                  path: "/dashboard",
                  Component: Dashboard,
                },
              ],
            },
          ],
        },
      ];
  }
}
