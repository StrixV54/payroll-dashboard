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
  useTheme,
} from "@mui/material";
import { NavLink as ReactRouterLink } from "react-router-dom";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import { RoleLevel } from "../utils/interface";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

export const sidebarAccessLevelUser = (role: RoleLevel) => {
  switch (role) {
    case "Employee":
      return [
        {
          section: "Data",
          routeList: [
            { title: "Users", route: "/users" },
            { title: "Salary Detail", route: "/salarydetail" },
          ],
        },
        {
          section: "Pages",
          routeList: [{ title: "FAQs", route: "/faqs" }],
        },
        {
          section: "Account",
          routeList: [{ title: "Job Details", route: "/jobdetails" }],
        },
      ];
    case "Payroll Manager":
      return [
        {
          section: "Data",
          routeList: [
            { title: "Users", route: "/users" },
            { title: "Department", route: "/department" },
            { title: "Teams", route: "/teams" },
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
        {
          section: "Account",
          routeList: [{ title: "Job Details", route: "/jobdetails" }],
        },
      ];
    case "Super Admin":
      return [
        {
          section: "Data",
          routeList: [
            { title: "Users", route: "/users" },
            { title: "Add User", route: "/adduser" },
          ],
        },
        {
          section: "Pages",
          routeList: [{ title: "FAQs", route: "/faqs" }],
        },
        {
          section: "Account",
          routeList: [{ title: "Job Details", route: "/jobdetails" }],
        },
      ];
  }
};

export default function SideDrawer() {
  const theme = useTheme();
  const role = useSelector(
    (state: RootState) => state.auth.user?.role
  ) as RoleLevel;

  // console.log(role);
  return (
    <Drawer
      variant="permanent"
      component="nav"
      sx={{
        width: 250,
        flexShrink: 0,
        backgroundColor: theme.palette.background.appbar,
        [`& .MuiDrawer-paper`]: {
          width: 250,
          backgroundColor: theme.palette.background.appbar,
          boxSizing: "border-box",
          borderRight: "none",
        },
      }}
    >
      <Toolbar sx={{ height: "80px" }} />
      <Box sx={{ overflow: "auto", paddingX: "16px", borderRight: "none" }}>
        <List>
          {["Dashboard"].map((text, index) => (
            <ListItem key={text} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                sx={{
                  borderRadius: "8px",
                  "&:hover": {
                    bgcolor: theme.palette.background.sidebarHover,
                  },
                  "&.active": {
                    bgcolor: theme.palette.background.sidebar,
                  },
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
        {sidebarAccessLevelUser(role)?.map((item, index) => {
          return (
            <List key={index}>
              <Typography component="div" variant="overline" gutterBottom>
                {item.section}
              </Typography>
              {item.routeList.map((text, index) => {
                return (
                  <ListItem key={index} disablePadding sx={{ mb: 1 }}>
                    <ListItemButton
                      sx={{
                        borderRadius: "8px",
                        "&:hover": {
                          bgcolor: theme.palette.background.sidebarHover,
                        },
                        "&.active": {
                          bgcolor: theme.palette.background.sidebar,
                        },
                      }}
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
