import { useEffect, useState } from "react";
import { firebaseAuth } from "../firebase/config";
import { Outlet, useNavigate } from "react-router-dom";
import Loading from "./Loading";
import { Box } from "@mui/material";
import { collectionUser, getUserDetailsAPI } from "../firebase/api";
import { useDispatch } from "react-redux";
import { userIsAuthentic } from "../redux/authSlice";
import SideDrawer from "../components/SideDrawer";
import Navbar from "../components/Navbar";
import { ColorConstant } from "../utils/constants";

export default function HomeLayout() {
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
      localStorage.setItem("roleLevel", userInfo?.role);
      dispatch(userIsAuthentic(userInfo as object));
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return isLoading ? (
    <Loading message="Checking Login !!" />
  ) : (
    <Box
      sx={{
        display: "flex",
        flexGrow: 1,
        height: "100vh",
        backgroundColor: ColorConstant.TEAL_BG,
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
          padding: 3,
          borderRadius: 3,
          backgroundColor: ColorConstant.BLACK,
          overflow: "scroll",
          display: "flex",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
