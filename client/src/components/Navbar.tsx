import { MouseEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { ColorConstant, StylesConstant } from "../utils/constants";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { changeMode } from "../redux/themeSlice";

export default function Navbar() {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const mode = useSelector((state: RootState) => state.theme.mode);
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  // const { toggleColorMode } = useContext(ColorModeContext);
  // const auth = getAuth();
  const navigate = useNavigate();

  const handleMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const signOutHandle = () => {
    navigate("/signout");
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: theme.palette.background.appbar,
        backgroundImage: "none",
        boxShadow: "none",
        color: theme.palette.text.primary,
      }}
    >
      <Toolbar sx={{ height: "80px", justifyContent: "space-between" }}>
        <Typography variant="h6" component="h6" fontWeight="bold" mr={4}>
          ZUCO
        </Typography>
        {/* <div style={{ flexGrow: 1 }}>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          </div> */}
        <Box sx={StylesConstant.divCenterStyle}>
          <IconButton
            sx={{ mr: 2 }}
            onClick={() => {
              dispatch(changeMode());
            }}
            color="inherit"
          >
            {theme.palette.mode === "dark" ? (
              <Brightness7Icon />
            ) : (
              <Brightness4Icon />
            )}
          </IconButton>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              mr: 1,
            }}
          >
            <Typography
              component="div"
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "end",
              }}
              fontSize={"0.9rem"}
              fontWeight={"bold"}
            >
              {user?.displayName}
            </Typography>
            <Typography
              component="div"
              fontSize={"0.7rem"}
              textTransform="capitalize"
            >
              {user?.role}
            </Typography>
          </Box>
          <IconButton
            size="large"
            aria-label="current user account"
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
        </Box>
      </Toolbar>
    </AppBar>
  );
}
