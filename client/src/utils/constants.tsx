export const StylesConstant = {
  divCenterStyle: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  fullScreen: {
    height: "100vh",
    width: "100vw",
  },
  changeAutofillColor: {
    "input:-webkit-autofill": {
      WebkitBoxShadow: "0 0 0 100px #333 inset",
    },
  },
};

export const FirebaseErrorMessages = (code: string) => {
  switch (code) {
    case "auth/email-already-exists":
      return {
        quickMessage: "Email Already Exists",
        detailedMessage:
          "The provided email is already in use by an existing user",
      };
    default:
      return {
        quickMessage: "Firebase Login Issue",
        detailedMessage: "Something went wrong. Please try again.",
      };
  }
};
