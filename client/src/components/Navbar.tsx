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
} from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { ColorConstant, StylesConstant } from "../utils/constants";

export default function Navbar() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
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
        backgroundColor: ColorConstant.TEAL_BG,
        backgroundImage: "none",
        boxShadow: "none",
      }}
    >
      <Toolbar sx={{ height: "80px", justifyContent: "space-between" }}>
        <Typography component="h6" fontWeight="bold" mr={4} fontSize={"1.4rem"}>
          ZUCO
        </Typography>
        <Box sx={StylesConstant.divCenterStyle}>
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
          >
            <AccountCircle sx={{ fontSize: "2.2rem" }} />
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
