import { useEffect, useState } from "react";
import { firebaseAuth } from "../firebase/config";
import { Outlet, useNavigate } from "react-router-dom";
import Loading from "./Loading";
import { Box, useTheme } from "@mui/material";
import { collectionUser, getUserDetailsAPI } from "../firebase/api";
import { useDispatch } from "react-redux";
import { userIsAuthentic } from "../redux/authSlice";
import SideDrawer from "../components/SideDrawer";
import Navbar from "../components/Navbar";

export default function HomeLayout() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = firebaseAuth.onAuthStateChanged(async (user) => {
      if (!user) {
        navigate("/signin");
        return;
      }
      //Fetch user detail
      const userInfo = await getUserDetailsAPI(collectionUser, user.uid);
      localStorage.setItem("zuco-rolelevel-cache", userInfo?.role);
      dispatch(userIsAuthentic(userInfo as object));
      setIsLoading(false);
    });

    return () => unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return isLoading ? (
    <Loading message="Checking Login !!" />
  ) : (
    <Box
      sx={{
        display: "flex",
        flexGrow: 1,
        height: "100vh",
        backgroundColor: theme.palette.background.appbar,
      }}
    >
      {/*  ------ Navbar ------ */}
      <Navbar />
      {/*  ------ SideBar ------ */}
      <SideDrawer />
      {/*  ------ Main Section ------ */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          mt: "80px",
          mr: 2,
          padding: 3,
          borderRadius: 3,
          backgroundColor: theme.palette.background.shade,
          overflow: "scroll",
          display: "flex",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
