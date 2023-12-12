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

export const numberFormat = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(value);

export const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const monthIntToLongFormat = (value: number) => {
  return monthNames[value];
};

/**
 *
 * @param n last n months
 * @param fincMonth 1 - jan, 12 - dec
 * @returns month and year as array
 */
export function getLastMonthsOrFY(n: number, fincMonth: number) {
  let months = [];

  let today = new Date();
  let year = today.getFullYear();
  let month = today.getMonth() - 1;

  // n = 12 ==> Financial Year
  if (n === 12)
    n = month >= fincMonth ? month - fincMonth + 2 : 12 - fincMonth + month + 2;

  var i = 0;
  do {
    months.push({ month: monthNames[month], year });
    if (month === 0) {
      month = 11;
      year--;
    } else {
      month--;
    }
    i++;
  } while (i < n);

  return months;
}

export function getLastYears(n: number) {
  let years = [];

  let today = new Date();
  let year = today.getFullYear();

  var i = 0;
  do {
    years.push(year);
    year--;
    i++;
  } while (i < n);

  return years;
}

export function getFYYear(fyYear: number, fincMonth: number) {
  let months = [];

  let today = new Date();
  let year = today.getFullYear();
  let month = fincMonth;

  let n = 12;
  let i = 0;
  do {
    months.push({ month: monthNames[month], fyYear });
    if (month === today.getMonth() - 1 && fyYear === year) break;
    if (month === 11) {
      month = 0;
      fyYear++;
    } else {
      month++;
    }
    i++;
  } while (i < n);

  return months;
}
