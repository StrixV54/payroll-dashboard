import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { firebaseAuth, firebaseGoogleAuth, firestoreDB } from "./config";
import {
  QueryConstraint,
  SnapshotOptions,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import toast from "react-hot-toast";
import { printFirebaseError } from "../utils/helper";
import {
  RoleLevel,
  UserInfoFirebase,
  UserInfoLogin,
  UserInfoPersonal,
} from "../utils/interface";
import * as admin from "firebase-admin";
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
  console.log(email);
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
      status: "active",
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
  await setDoc(doc(firestoreDB, collection + "/" + uid + "/" + year, month), {
    document,
  });
};

export const getUserSalaryAPI = async (
  collectionType: string,
  uid: string,
  year: string
) => {
  const userRef = collection(
    firestoreDB,
    collectionType + "/" + uid + "/" + year
  );
  const querySnapshot = await getDocs(userRef);
  let result: SnapshotOptions[] = [];
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
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
