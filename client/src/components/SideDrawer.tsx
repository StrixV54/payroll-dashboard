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
import { RoleLevel } from "../utils/interface";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import GridViewIcon from "@mui/icons-material/GridView";
import PeopleIcon from "@mui/icons-material/People";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import QuizIcon from "@mui/icons-material/Quiz";
import SummarizeIcon from "@mui/icons-material/Summarize";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

export const sidebarAccessLevelUser = (role: RoleLevel) => {
  switch (role) {
    case "Employee":
      return [
        {
          section: "Application",
          routeList: [
            { title: "View Users", route: "/users", icon: PeopleIcon },
            {
              title: "Salary Detail",
              route: "/salarydetail",
              icon: ReceiptLongIcon,
            },
          ],
        },
        {
          section: "Pages",
          routeList: [{ title: "FAQs", route: "/", icon: QuizIcon }],
        },
        {
          section: "Account",
          routeList: [{ title: "Report", route: "/", icon: SummarizeIcon }],
        },
      ];
    case "Payroll Manager":
      return [
        {
          section: "Application",
          routeList: [
            { title: "Manage Users", route: "/users", icon: PeopleIcon },
          ],
        },
        {
          section: "Pages",
          routeList: [
            { title: "Calender", route: "/", icon: CalendarMonthIcon },
            { title: "FAQs", route: "/", icon: QuizIcon },
          ],
        },
        {
          section: "Account",
          routeList: [
            { title: "Job Details", route: "/", icon: SummarizeIcon },
          ],
        },
      ];
    case "Super Admin":
      return [
        {
          section: "Application",
          routeList: [
            { title: "Manage Users", route: "/users", icon: PeopleIcon },
            { title: "Add User", route: "/adduser", icon: PersonAddIcon },
          ],
        },
        {
          section: "Pages",
          routeList: [{ title: "FAQs", route: "/", icon: QuizIcon }],
        },
        {
          section: "Account",
          routeList: [
            { title: "System details", route: "/", icon: SummarizeIcon },
          ],
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
                  <GridViewIcon />
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
                        <text.icon />
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
