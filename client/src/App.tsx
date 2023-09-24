import { RouterProvider, createBrowserRouter } from "react-router-dom";
import ErrorPage from "./pages/ErrorPage";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import HomeLayout from "./pages/HomeLayout";

const router = createBrowserRouter([
  {
    path: "/sign-in",
    Component: SignIn,
    errorElement: <ErrorPage />,
  },
  {
    path: "/sign-up",
    Component: SignUp,
    errorElement: <ErrorPage />,
  },
  {
    path: "/",
    Component: HomeLayout,
    errorElement: <ErrorPage />,
  },
]);

export default function App() {
  return (
    <RouterProvider router={router} fallbackElement={<p>Initial Load...</p>} />
  );
}
