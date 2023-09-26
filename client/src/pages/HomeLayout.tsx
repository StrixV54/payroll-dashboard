import { MouseEvent, useContext, useEffect, useState } from "react";
import { firebaseAuth } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import { ColorModeContext } from "../context/ThemeMode";
import Loading from "./Loading";
import {
  AppBar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { queryUserAPI } from "../firebase/api";
import { where } from "firebase/firestore";
import { useDispatch } from "react-redux";
import { resetAuth, userIsAuthentic } from "../redux/auth";

export default function HomeLayout() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  // const { toggleColorMode } = useContext(ColorModeContext);
  // const auth = getAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();

  const handleMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    firebaseAuth.onAuthStateChanged(async (user) => {
      if (!user) {
        navigate("/sign-in");
        return;
      }

      //Fetch users details
      const userInfo = await queryUserAPI(where("uid", "==", user.uid));
      dispatch(userIsAuthentic(userInfo.at(0) as object));
      setIsLoading(false);
    });
  }, []);

  const signOutHandle = () => {
    dispatch(resetAuth());
    firebaseAuth.signOut();
  };

  return isLoading ? (
    <Loading message="Checking Login !!" />
  ) : (
    <Box sx={{ flexGrow: 1 }} padding={0} margin={0}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Photos
          </Typography>
          <div>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose}>Profile</MenuItem>
              <MenuItem onClick={handleClose}>My account</MenuItem>
              <MenuItem onClick={signOutHandle}>Sign Out</MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
