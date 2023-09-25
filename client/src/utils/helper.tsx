import toast from "react-hot-toast";
import { FirebaseAPIError } from "./interface";

export const getFirebaseMessageFromCode = (code: string) => {
  switch (code) {
    case "auth/email-already-exists":
      return {
        quickMessage: "Email Already Exists, do Sign-In",
        detailedMessage:
          "The provided email is already in use by an existing user",
      };
    case "auth/account-exists-with-different-credential":
      return {
        quickMessage: "Account Already Exists",
        detailedMessage:
          "An account with an E-Mail address to this social account already exists",
      };
    case "auth/invalid-login-credentials":
      return {
        quickMessage: "Invalid User Credentials",
        detailedMessage: "Please check your credentials before trying again.",
      };
    case "auth/email-already-in-use":
      return {
        quickMessage: "Email Already In Use, do Sign-In",
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

export const printFirebaseError = (error: FirebaseAPIError): void => {
  console.log(`Got Error Code from Firebase: ${error.code}`);
  toast.error(
    `ERROR : ${getFirebaseMessageFromCode(error?.code).quickMessage}`
  );
  console.error(
    `ERROR : ${getFirebaseMessageFromCode(error?.code).detailedMessage}`
  );
};
