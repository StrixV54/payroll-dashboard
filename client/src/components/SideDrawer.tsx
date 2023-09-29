import {
  Box,
  Drawer,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import { StylesConstant } from "../utils/constants";
import { NavLink as ReactRouterLink } from "react-router-dom";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import { it } from "node:test";
import { RoleLevel } from "../utils/interface";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

export const sidebarAccessLevelUser = (role: RoleLevel) => {
  switch (role) {
    case "user":
      return [
        {
          section: "Data",
          routeList: [
            { title: "Department", route: "/department" },
            { title: "Teams", route: "/teams" },
            { title: "Users", route: "/users" },
          ],
        },
        {
          section: "Pages",
          routeList: [
            { title: "Charts", route: "/charts" },
            { title: "Calender", route: "/calender" },
            { title: "FAQs", route: "/faqs" },
          ],
        },
      ];
    case "admin":
      return [
        {
          section: "Data",
          routeList: [
            { title: "Analytics", route: "/analytics" },
            { title: "Department", route: "/department" },
            { title: "Teams", route: "/teams" },
            { title: "Users", route: "/users" },
          ],
        },
        {
          section: "Pages",
          routeList: [
            { title: "Profile Add", route: "/addprofile" },
            { title: "Calender", route: "/calender" },
            { title: "FAQs", route: "/faqs" },
          ],
        },
      ];
  }
};

export default function SideDrawer() {
  const role = useSelector((state: RootState) => state.auth.user?.role) as RoleLevel;

  return (
    <Drawer
      variant="permanent"
      component="nav"
      sx={{
        width: 250,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: 250,
          boxSizing: "border-box",
        },
      }}
    >
      <Toolbar sx={{ height: "100px" }} />
      <Box sx={{ overflow: "auto", paddingX: "16px" }}>
        <List>
          {["Dashboard"].map((text, index) => (
            <ListItem key={text} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                sx={{
                  ...StylesConstant.drawerListItem,
                }}
                component={ReactRouterLink}
                to={"/" + text.toLowerCase()}
              >
                <ListItemIcon sx={{ minWidth: "45px" }}>
                  <InboxIcon />
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        {sidebarAccessLevelUser(role)!.map((item, index) => {
          return (
            <List key={index}>
              <Typography component="div" variant="overline" gutterBottom>
                {item.section}
              </Typography>
              {item.routeList.map((text, index) => {
                return (
                  <ListItem key={index} disablePadding sx={{ mb: 1 }}>
                    <ListItemButton
                      sx={StylesConstant.drawerListItem}
                      component={ReactRouterLink}
                      to={text.route.toLowerCase()}
                    >
                      <ListItemIcon sx={{ minWidth: "45px" }}>
                        <InboxIcon />
                      </ListItemIcon>
                      <ListItemText primary={text.title} />
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          );
        })}
      </Box>
    </Drawer>
  );
}
