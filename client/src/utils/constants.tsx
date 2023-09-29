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
      bgcolor: "#303030",
    },
    "&.active": {
      bgcolor: "#0d4250",
    },
  },
};

export const ColorConstant = {
  // THEME - TEAL
  TEAL_BG: "#041215",
  TEAL_ACTIVE_BG: "#091e20",
  TEAL_HOVER_BG: "#3eb0ac",
  TEAL_LIGHT_HOVER_BG: "#395b5f",
  // DEFAULTS
  BLACK: "#000000",
  WHITE: "#ffffff",
  COOL_YELLOW: "#ffc007",
  COOL_GREEN: "#198d27",
};
