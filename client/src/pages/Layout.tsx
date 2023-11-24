import { useEffect, useState } from "react";
import { firebaseAuth } from "../firebase/config";
import { Outlet, useNavigate } from "react-router-dom";
import Loading from "./Loading";
<<<<<<< Updated upstream
import { Box } from "@mui/material";
import { getUserDetailAPI } from "../firebase/api";
=======
import { Box, useTheme } from "@mui/material";
import { collectionUser, getUserDetailsAPI } from "../firebase/api";
>>>>>>> Stashed changes
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
    const unsubscribe = firebaseAuth.onAuthStateChanged((user) => {
      if (!user) {
        navigate("/signin");
        return;
      }
      const checkUser = async () => {
        //Fetch user detail
        const userInfo = await getUserDetailAPI(user.uid);
        dispatch(userIsAuthentic(userInfo as object));
        setIsLoading(false);
      };
      checkUser();
    });

    return () => unsubscribe();
  }, []);

  return isLoading ? (
    <Loading message="Checking Login !!" />
  ) : (
<<<<<<< Updated upstream
    <Box sx={{ display: "flex", flexGrow: 1 }}>
=======
    <Box
      sx={{
        display: "flex",
        flexGrow: 1,
        height: "100vh",
        backgroundColor: theme.palette.background.appbar,
      }}
    >
>>>>>>> Stashed changes
      {/*  ------ Navbar ------ */}
      <Navbar />
      {/*  ------ SideBar ------ */}
      <SideDrawer />
      {/*  ------ Main Section ------ */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          // height: "calc(100vh - 80px)",
          mt: "80px",
<<<<<<< Updated upstream
=======
          mr: 2,
          padding: 3,
          borderRadius: 3,
          backgroundColor: theme.palette.background.shade,
          overflow: "scroll",
          display: "flex",
>>>>>>> Stashed changes
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
