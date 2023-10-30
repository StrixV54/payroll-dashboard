import { RoleLevel } from "./interface";

export const StylesConstant = {
  divCenterStyle: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  fullScreenVWPort: {
    height: "100vh",
    width: "100vw",
  },
  fullScreenCover: {
    height: "100%",
    width: "100%",
  },
  changeAutofillColor: {
    "& input:-webkit-autofill ": {
      WebkitBoxShadow: "0 0 0 100px #222222 inset",
    },
  },
  drawerListItem: {
    borderRadius: "8px",
    "&:hover": {
      bgcolor: "#0b2b34",
    },
    "&.active": {
      bgcolor: "#0d4250",
    },
  },
  gradientEffectDark: {
    "&:before": {
      content: "''",
      position: "absolute",
      width: "210px",
      height: "210px",
      background:
        "linear-gradient(140.9deg, rgb(57, 169, 165) -14.02%, rgba(144, 202, 249, 0) 85.5%)",
      borderRadius: "50%",
      top: "-125px",
      right: "-15px",
      opacity: "0.5",
    },
    "&:after": {
      content: "''",
      position: "absolute",
      width: "210px",
      height: "210px",
      background:
        "linear-gradient(210.04deg, rgb(57, 169, 165) -50.94%, rgba(144, 202, 249, 0) 95.49%)",
      borderRadius: "50%",
      top: "-85px",
      right: "-95px",
    },
  },
  gradientEffectLight: {
    "&:before": {
      content: "''",
      position: "absolute",
      width: "210px",
      height: "210px",
      background:
        "linear-gradient(140.9deg, rgb(57, 169, 165) -14.02%, rgba(144, 202, 249, 0) 85.5%)",
      borderRadius: "50%",
      top: "-125px",
      right: "-15px",
      opacity: "0.3",
    },
    "&:after": {
      content: "''",
      position: "absolute",
      width: "210px",
      height: "210px",
      background:
        "linear-gradient(210.04deg, rgb(57, 169, 165) -24.94%, rgba(144, 202, 249, 0) 95.49%)",
      borderRadius: "50%",
      opacity: "0.3",
      top: "-85px",
      right: "-95px",
    },
  },
};

export const UserRoleLevel = {
  EMPLOYEE: "employee",
  PAYROLL_MANAGER: "payroll manager",
  SUPER_ADMIN: "super admin",
};

export const ColorConstant = {
  // THEME - TEAL
  TEAL_BG: "#041215",
  TEAL_ACTIVE_BG: "#091e20",
  TEAL_HOVER_BG: "#3eb0ac",
  TEAL_LIGHT_HOVER_BG: "#395b5f",
  // DEFAULTS
  BLACK: "#000000",
  GRAY: "#636363",
  WHITE: "#ffffff",
  COOL_YELLOW: "#ffc007",
  COOL_GREEN: "#198d27",
};

// const getDesignToken = (mode: PaletteMode) => {
//   switch("")
// };

// const theme = createTheme({
//   components: {
//     MuiCssBaseline: {
//       styleOverrides: `
//         h1 {
//           color: grey;
//         }
//       `,
//     },
//   },
// });
