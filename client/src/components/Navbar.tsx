import { MouseEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfilePicture from "../assets/profilePict.jpg";
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
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { StylesConstant } from "../utils/constants";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { changeMode } from "../redux/themeSlice";

export default function Navbar() {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
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
        <Typography component="h6" fontWeight="bold" mr={4} fontSize={"1.4rem"}>
          ZUCO
        </Typography>
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
            aria-label="current user account"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
            sx={{ p: 0, ml: 1 }}
          >
            <img
              alt="profile-pic"
              src={ProfilePicture}
              style={{
                height: "2.5rem",
                width: "2.5rem",
                backgroundColor: "#138058",
                backgroundSize: "auto",
                backgroundRepeat: "no-repeat",
                borderRadius: "50%",
              }}
            />
            {/* <AccountCircle sx={{ fontSize: "2s.2rem" }} /> */}
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: -8,
              horizontal: "right",
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem
              onClick={() => navigate("/viewprofile")}
              sx={{ padding: "10px 20px" }}
            >
              View Profile
            </MenuItem>
            <MenuItem onClick={signOutHandle} sx={{ padding: "10px 20px" }}>
              Sign Out
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
