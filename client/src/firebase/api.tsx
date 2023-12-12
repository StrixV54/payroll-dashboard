import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { firebaseAuth, firebaseGoogleAuth, firestoreDB } from "./config";
import {
  QueryConstraint,
  SnapshotOptions,
  and,
  collection,
  doc,
  getDoc,
  getDocs,
  or,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import toast from "react-hot-toast";
import {
  getFYYear,
  getLastMonthsOrFY,
  monthNames,
  printFirebaseError,
} from "../utils/helper";
import {
  RoleLevel,
  UserInfoFirebase,
  UserInfoLogin,
  UserInfoPersonal,
} from "../utils/interface";
import { DropdownOptions } from "../utils/constants";

export const collectionUser = "users";
const collectionIdGenerator = "uniqueIdGenerator";
const docIdGenerator = "randomId";
export const collectionUserDetails = "usersDetails";
export const collectionUserSalaryDetails = "usersSalaryDetails";

export const signUpAPI = ({
  first,
  last,
  email,
  password,
  dateOfBirth,
  employeeId,
  status,
}: UserInfoLogin) => {
  return createUserWithEmailAndPassword(firebaseAuth, email, password)
    .then(async (res) => {
      // console.log("res", res);
      // phoneNumber,
      /**
       * creates a new document with user's uid adding following information passed next.
       * */
      await setDoc(doc(firestoreDB, collectionUser, res.user.uid), {
        displayName: first?.concat(" ", last!),
        email,
        uid: res.user?.uid,
        dateOfBirth,
        employeeId,
        status,
        role: "employee" as RoleLevel, // ["employee", "payroll manager", "super admin"]
        lastLoginAt: new Date().toLocaleString(),
      });
    })
    .then(() => {
      toast.success("Successfully Created Account");
    })
    .catch((error) => {
      printFirebaseError(error);
    });
};

export const signInAPI = (email: string, password: string) => {
  /**
   * SignIn function of Firebase , we update last login time and get the doc info
   * */
  return signInWithEmailAndPassword(firebaseAuth, email, password)
    .then(async (res) => {
      await updateDoc(doc(firestoreDB, collectionUser, res.user.uid), {
        lastLoginAt: new Date().toLocaleString(),
      });
    })
    .then(() => {
      toast.success("Successfully Logged In");
    })
    .catch((error) => {
      printFirebaseError(error);
    });
};
export const createNewUserAPI = async ({
  first,
  last,
  email,
  password,
  dateOfBirth,
  role,
  phoneNumber,
  department,
  grade,
}: any) => {
  const displayName = first?.concat(" ", last!);
  const res = await fetch("http://localhost:5000/api/createUserAPI", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
      displayName,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (res.ok) {
    const result = await res.json();
    const uid = result?.uid;
    const employeeId = await generateEmployeeIdAPI(first, last);
    return await setDoc(doc(firestoreDB, collectionUser, uid), {
      displayName,
      email,
      uid,
      dateOfBirth,
      employeeId,
      department,
      phoneNumber,
      grade,
      status: "Active",
      role, // ["employee", "payroll manager", "super admin"]
      lastLoginAt: new Date().toLocaleString(),
    });
  } else {
    throw new Error(
      "Error in creating user in backend: " +
        res.status +
        " , " +
        res.statusText
    );
  }
};

export const queryUserAPI = async (queryFilter: QueryConstraint) => {
  // creates a reference to the collection
  const userRef = collection(firestoreDB, collectionUser);

  // passing a single where query to  the query function
  const q = query(userRef, queryFilter);
  const querySnapshot = await getDocs(q);
  let result: SnapshotOptions[] = [];
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    result.push(doc.data());
  });
  return result;
};

export const signInWithGoogleAPI = () => {
  return signInWithPopup(firebaseAuth, firebaseGoogleAuth)
    .then(async (res) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      // const credential = GoogleAuthProvider.credentialFromResult(res);
      // const token = credential?.accessToken;

      // The signed-in user info.
      const user = res.user;

      /**
       * Check if not a new User, update last login date else create new user record
       * */
      if (
        new Date(user.metadata?.lastSignInTime as string).getTime() -
          new Date(user.metadata?.creationTime as string).getTime() >
        10000 // diff greater that 10 second change means not first time login
      )
        return await updateDoc(doc(firestoreDB, collectionUser, res.user.uid), {
          lastLoginAt: new Date().toLocaleString(),
        });

      return await setDoc(doc(firestoreDB, collectionUser, user?.uid), {
        displayName: user.displayName,
        email: res.user.email,
        uid: res.user.uid,
        role: "employee" as RoleLevel, // ["employee", "payroll manager", "super admin"]
        lastLoginAt: new Date().toLocaleString(),
      });
    })
    .then(() => {
      toast.success("Successfully Logged In via Google");
    })
    .catch((error) => {
      printFirebaseError(error);
    });
};

export const generateEmployeeIdAPI = async (first: string, last: string) => {
  /**
   * generates a employee id using a id value and initial letters of name
   * */
  let id: number = 0;
  const docSnap = await getDoc(
    doc(firestoreDB, collectionIdGenerator, docIdGenerator)
  );

  // If Document Snapshot exist then return data
  if (docSnap.exists()) {
    id = (docSnap.data()?.id as number) + 1;
  } else {
    console.log("No such document exists!");
  }

  await updateDoc(doc(firestoreDB, collectionIdGenerator, docIdGenerator), {
    id,
  });

  return await (first.toUpperCase().at(0)! +
    last.toUpperCase().at(0)! +
    id.toString());
};

export const setUserDetailsAPI = async (
  collection: string,
  document: object,
  uid: string
) => {
  await setDoc(doc(firestoreDB, collection, uid), document);
};

export const getUserDetailsAPI = async (collection: string, uid: string) => {
  const docSnap = await getDoc(doc(firestoreDB, collection, uid));
  // If Document Snapshot exist then return data
  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    console.log("No such document exists!");
  }
  return undefined;
};

export const setUserSalaryAPI = async (
  collection: string,
  document: object,
  uid: string,
  year: string,
  month: string
) => {
  await setDoc(doc(firestoreDB, collection, uid + month + year), document);
};

export const getUserSalarySpecificMonthAPI = async (
  collectionType: string,
  month: string,
  year: string,
  uid: string
) => {
  const docName = uid + month + year;
  const docSnap = await getDoc(doc(firestoreDB, collectionType, docName));
  // If Document Snapshot exist then return data
  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    console.log("No such document exists!");
  }
  return undefined;
};

export const getUserSalarySpecificYearAPI = async (
  collectionType: string,
  year: string,
  uid: string
) => {
  const userRef = collection(firestoreDB, collectionUserSalaryDetails);
  const q = query(userRef, where("year", "==", year), where("uid", "==", uid));
  const querySnapshot = await getDocs(q);
  let result: SnapshotOptions[] = [];
  querySnapshot.forEach((doc) => {
    result.push(doc.data());
  });
  return result;
};

export const queryUserDetailsAPI = async () => {
  // creates a reference to the collection
  const userRef = collection(firestoreDB, collectionUserDetails);
  const querySnapshot = await getDocs(userRef);
  let result: SnapshotOptions[] = [];
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    result.push(doc.data());
  });
  return result;
};

//employee vs department , data processing API
export const employeeDepartmentAPI = async () => {
  // creates a reference to the collection
  const userRef = collection(firestoreDB, collectionUser);
  const querySnapshot = await getDocs(userRef);
  let userdata: UserInfoFirebase[] = [];
  querySnapshot.forEach((doc) => {
    userdata.push(doc.data() as UserInfoFirebase);
  });
  const result = [];
  let totalEmployee = 0;
  for (let department of DropdownOptions.department) {
    let employeeList = userdata.filter(
      (item) => item?.department === department.value
    );
    totalEmployee += employeeList.length;
    result.unshift({
      department: department.value,
      employees: employeeList.length,
    });
  }
  return { result, totalEmployee };
};

//salary vs department , data processing API
export const salaryDepartmentAPI = async () => {
  const userRef = collection(firestoreDB, collectionUser);
  const userDetailRef = collection(firestoreDB, collectionUserDetails);
  const querySnapshot = await getDocs(userRef);
  const querySnapshotDetail = await getDocs(userDetailRef);
  let userdata: UserInfoFirebase[] = [];
  let userdetail: UserInfoPersonal[] = [];
  querySnapshot.forEach((doc) => {
    userdata.push(doc.data() as UserInfoFirebase);
  });
  querySnapshotDetail.forEach((doc) => {
    userdetail.push(doc.data() as UserInfoPersonal);
  });
  const result = [];
  let totalSalarySpentOverall = 0;
  for (let department of DropdownOptions.department) {
    let totalSalary = 0;
    userdata.forEach((item) => {
      if (item.department === department.value) {
        userdetail.forEach((detail) => {
          if (detail.uid === item.uid)
            totalSalary += Number(detail.salary.replaceAll(",", ""));
        });
      }
    });
    totalSalarySpentOverall += totalSalary;
    result.unshift({
      department: department.value,
      salary: totalSalary,
    });
  }
  return { result, totalSalarySpentOverall };
};

//salary ranges , data processing API
export const salaryRangeAPI = async () => {
  const range = [
    { upper: 5, lower: 0 },
    { upper: 10, lower: 5 },
    { upper: 15, lower: 10 },
    { upper: 25, lower: 15 },
    { upper: 50, lower: 25 },
  ];
  const userDetailRef = collection(firestoreDB, collectionUserDetails);
  const querySnapshotDetail = await getDocs(userDetailRef);
  let userdetail: UserInfoPersonal[] = [];
  querySnapshotDetail.forEach((doc) => {
    userdetail.push(doc.data() as UserInfoPersonal);
  });
  const result = [];
  for (let data of range) {
    let noOfEmployee = 0;
    userdetail.forEach((item) => {
      const salaryLPA = Number(item.salary.replaceAll(",", "")) / 100000;
      if (salaryLPA >= data.lower && salaryLPA < data.upper) {
        noOfEmployee += 1;
      }
    });
    result.push({
      id: data.lower + "-" + data.upper + " LPA",
      label: data.lower + "-" + data.upper + " LPA",
      value: noOfEmployee,
    });
  }
  return result;
};

//Salary Analytics month wise for a department , data processing API
export const salaryAnalyticsYearDepartmentAPI = async (year: string) => {
  const salaryDetailRef = collection(firestoreDB, collectionUserSalaryDetails);
  const result = [];
  const firebaseQuery = monthNames.map((month) => {
    return and(where("year", "==", year), where("month", "==", month));
  });

  const q = query(salaryDetailRef, or(...firebaseQuery));
  const querySnapshot = await getDocs(q);
  let docOut: any = [];
  querySnapshot.forEach((doc) => {
    docOut.push(doc.data());
  });

  for (let month of monthNames) {
    let ans = { month };
    for (let department of DropdownOptions.department) {
      let out = 0;
      let dep = docOut.filter(
        (item: any) =>
          item?.department === department.value && item?.month === month
      );
      dep.forEach((element: any) => {
        out += Number(element?.totalSalary);
      });
      ans = { ...ans, [department.value]: out };
    }

    result.push({ ...ans });
  }
  return result;
};

//Salary Analytics month wise for a department , data processing API
export const salaryAnalyticsQuarterDepartmentAPI = async (year: string) => {
  const salaryDetailRef = collection(firestoreDB, collectionUserSalaryDetails);
  const result = [];
  const firebaseQuery = monthNames.map((month) => {
    return and(where("year", "==", year), where("month", "==", month));
  });

  const q = query(salaryDetailRef, or(...firebaseQuery));
  const querySnapshot = await getDocs(q);
  let docOut: any = [];
  querySnapshot.forEach((doc) => {
    docOut.push(doc.data());
  });

  const qtr: { [key: string]: string[] } = {
    Q1: ["January", "February", "March"],
    Q2: ["April", "May", "June"],
    Q3: ["July", "August", "September"],
    Q4: ["October", "November", "December"],
  };

  for (let quarter of Object.keys(qtr)) {
    let ans = { quarter };
    for (let department of DropdownOptions.department) {
      let out = 0;
      let dep = docOut.filter(
        (item: any) =>
          item?.department === department.value &&
          qtr[quarter].includes(item?.month)
      );
      dep.forEach((element: any) => {
        out += Number(element?.totalSalary);
      });
      ans = { ...ans, [department.value]: out };
    }

    result.push({ ...ans });
  }
  return result;
};

//Salary Analytics month wise for a department , data processing API
export const salaryAnalyticsHalfYearDepartmentAPI = async (year: string) => {
  const salaryDetailRef = collection(firestoreDB, collectionUserSalaryDetails);
  const result = [];
  const firebaseQuery = monthNames.map((month) => {
    return and(where("year", "==", year), where("month", "==", month));
  });

  const q = query(salaryDetailRef, or(...firebaseQuery));
  const querySnapshot = await getDocs(q);
  let docOut: any = [];
  querySnapshot.forEach((doc) => {
    docOut.push(doc.data());
  });

  const qtr: { [key: string]: string[] } = {
    H1: ["January", "February", "March", "April", "May", "June"],
    H2: ["July", "August", "September", "October", "November", "December"],
  };

  for (let halfyear of Object.keys(qtr)) {
    let ans = { halfyear };
    for (let department of DropdownOptions.department) {
      let out = 0;
      let dep = docOut.filter(
        (item: any) =>
          item?.department === department.value &&
          qtr[halfyear].includes(item?.month)
      );
      dep.forEach((element: any) => {
        out += Number(element?.totalSalary);
      });
      ans = { ...ans, [department.value]: out };
    }

    result.push({ ...ans });
  }
  return result;
};

export const getEmployeesStatusAPI = async () => {
  const userRef = collection(firestoreDB, collectionUser);
  const querySnapshot = await getDocs(userRef);
  let userData: UserInfoFirebase[] = [];
  querySnapshot.forEach((doc) => {
    userData.push(doc.data() as UserInfoFirebase);
  });
  let result = [];
  for (let status of DropdownOptions.status) {
    let noOfEmployee = 0;
    userData.forEach((item) => {
      if (item.status === status.value) {
        noOfEmployee += 1;
      }
    });
    result.push({ id: status.value, label: status.value, value: noOfEmployee });
  }
  return result;
};

export const getAllPayMonthRecordAPI = async (uid: string) => {
  // creates a reference to the collection
  const userRef = collection(firestoreDB, collectionUserSalaryDetails);
  const q = query(userRef, where("uid", "==", uid));
  const querySnapshot = await getDocs(q);
  let result: SnapshotOptions[] = [];
  querySnapshot.forEach((doc) => {
    result.push(doc.data());
  });
  return result;
};

//Salary Analytics month wise for an employee , data processing API
export const salaryAnalyticsEmployeeYearAPI = async (
  uid: string,
  year: string
) => {
  const salaryDetailRef = collection(firestoreDB, collectionUserSalaryDetails);
  const result = [];
  const nextYear = String(Number(year) + 1);
  const firebaseQuery = monthNames.map((month) => {
    return and(
      where("uid", "==", uid),
      where("year", "in", [year, nextYear]),
      where("month", "==", month)
    );
  });

  const q = query(salaryDetailRef, or(...firebaseQuery));
  const querySnapshot = await getDocs(q);
  let out: any = [];
  querySnapshot.forEach((doc) => {
    out.push(doc.data());
  });
  console.log(out);
  const monthRange = getFYYear(Number(year), 4);

  for (let month of monthRange) {
    const record = out
      .filter(
        (item: any) =>
          item?.month === month.month && item?.year === month.fyYear.toString()
      )
      .at(0);
    const salary = {
      "Basic Salary":
        Number(record?.basicSalary.toString().replace(",", "")) || 0,
      HRA: Number(record?.hra.toString().replace(",", "")) || 0,
      Taxable: Number(record?.taxable.toString().replace(",", "")) || 0,
      "Total Salary":
        Number(record?.totalSalary.toString().replace(",", "")) || 0,
      Reimbursement:
        Number(record?.reimbursement.toString().replace(",", "")) || 0,
      PF: Number(record?.pf.toString().replace(",", "")) || 0,
      "Meal Allowance":
        Number(record?.mealAllowance.toString().replace(",", "")) || 0,
    };
    result.push({ month: month.month, ...salary });
  }
  console.log(result);
  return result;
};

//Salary Analytics month wise for an employee , data processing API
export const salaryBifurcationLastMonthsAPI = async (
  uid: string,
  lastMonths: number
) => {
  const salaryDetailRef = collection(firestoreDB, collectionUserSalaryDetails);
  const result = [];
  const salary: { [key: string]: any } = {
    "Basic Salary": "basicSalary",
    HRA: "hra",
    Taxable: "taxable",
    PF: "pf",
    Reimbursement: "reimbursement",
    "Meal Allowance": "mealAllowance",
  };
  const salaryValue: { [key: string]: any } = {
    "Basic Salary": 0,
    HRA: 0,
    Taxable: 0,
    PF: 0,
    Reimbursement: 0,
    "Meal Allowance": 0,
  };
  const monthRange = getLastMonthsOrFY(lastMonths, 4);
  let range =
    monthRange.length === 1
      ? monthRange.at(0)?.month! + " " + monthRange.at(0)?.year!
      : monthRange.at(0)?.month! +
        " " +
        monthRange.at(0)?.year! +
        " - " +
        monthRange.at(monthRange.length - 1)?.month! +
        " " +
        monthRange.at(monthRange.length - 1)?.year!;

  const firebaseQuery = monthRange.map((data) => {
    return and(
      where("uid", "==", uid),
      where("year", "==", data.year.toString()),
      where("month", "==", data.month)
    );
  });

  const q = query(salaryDetailRef, or(...firebaseQuery));
  const querySnapshot = await getDocs(q);
  let out: any = [];
  querySnapshot.forEach((doc) => {
    out.push(doc.data());
  });

  for (let data of out) {
    for (let field of Object.keys(salary)) {
      if (data[salary[field]])
        salaryValue[field] += Number(
          data[salary[field]].toString().replace(",", "")
        );
      else salaryValue[field] += 0;
    }
  }
  for (let field of Object.keys(salaryValue)) {
    result.push({
      id: field,
      label: field,
      value: salaryValue[field],
    });
  }
  return { result, range };
};

//Salary Analytics month wise for an employee , data processing API
export const employeeDepartmentStatusYearAPI = async (year: string) => {
  const userDetailRef = collection(firestoreDB, collectionUserDetails);
  const userRef = collection(firestoreDB, collectionUser);
  const result = [];

  const querySnapshot = await getDocs(userRef);
  let outputUser: any = [];
  querySnapshot.forEach((doc) => {
    outputUser.push(doc.data());
  });

  const querySnapshotDetail = await getDocs(userDetailRef);
  let outputDetails: any = [];
  querySnapshotDetail.forEach((doc) => {
    outputDetails.push(doc.data());
  });
  // const monthRange = getLastMonthsOrFY(12, 4);

  for (let department of DropdownOptions.department) {
    const activeValue = outputUser.filter(
      (item: any) =>
        item?.department === department.value && item?.status === "Active"
    );
    const inactiveValue = outputUser.filter(
      (item: any) =>
        item?.department === department.value && item?.status === "Inactive"
    );
    const promotedValue = outputDetails.filter(
      (item: any) =>
        item?.promoted &&
        outputUser.filter(
          (userItem: any) =>
            userItem?.uid === item?.uid &&
            userItem?.department === department.value
        ).length > 0
    );
    result.push({
      department: department.value,
      Active: activeValue.length,
      Inactive: inactiveValue.length,
      Promoted: promotedValue.length,
    });
  }
  return result;
};
