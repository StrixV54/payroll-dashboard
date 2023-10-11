import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { firebaseAuth, firebaseGoogleAuth, firestoreDB } from "./config";
import {
  QueryConstraint,
  QueryFieldFilterConstraint,
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
import { RoleLevel, UserInfoLogin, UserInfoPersonal } from "../utils/interface";

export const collectionUser = "users";
const collectionIdGenerator = "uniqueIdGenerator";
const docIdGenerator = "randomId";
export const collectionUserDetails = "usersDetails";
export const collectionUserJobDetails = "usersJobDetails";

export const signUpAPI = ({
  first,
  last,
  email,
  password,
  dateofbirth,
  employeeid,
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
        dateOfBirth: dateofbirth,
        employeeId: employeeid,
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

// get specific user detail using uid
// export const getUserDetailAPI = async (uid: string) => {
//   const docSnap = await getDoc(doc(firestoreDB, collectionUser, uid));
//   // If Document Snapshot exist then return data
//   if (docSnap.exists()) {
//     return docSnap.data();
//   } else {
//     console.log("No such document exists!");
//   }
//   return undefined;
// };

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
    last.toUpperCase().at(1)! +
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
