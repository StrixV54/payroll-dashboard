import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { firebaseAuth, firebaseGoogleAuth, firestoreDB } from "./config";
import {
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
import { CleanHands } from "@mui/icons-material";

const collectionName = "users";

export const signUpAPI = (
  fullName: string,
  email: string,
  password: string
  // phoneNumber: string
) => {
  return createUserWithEmailAndPassword(firebaseAuth, email, password)
    .then(async (res) => {
      console.log("res", res);
      // phoneNumber,
      /**
       * creates a new document with user's uid adding following information passed next.
       * */
      await setDoc(doc(firestoreDB, collectionName, res.user.uid), {
        displayName: fullName,
        email: res.user?.email,
        uid: res.user?.uid,
        role: "user", // ["user", "admin", "super"]
        lastLoginAt: new Date().toLocaleString(),
      });
      return fullName;
    })
    .then((name) => {
      toast.success("Successfully Created Account" + name);
    })
    .catch((error) => {
      console.log(error);
      printFirebaseError(error);
    });
};

export const signInAPI = (email: string, password: string) => {
  /**
   * SignIn function of Firebase , we update last login time and get the doc info
   * */
  return signInWithEmailAndPassword(firebaseAuth, email, password)
    .then(async (res) => {
      await updateDoc(doc(firestoreDB, collectionName, res.user.uid), {
        lastLoginAt: new Date().toLocaleString(),
      });
      return await getDoc(doc(firestoreDB, collectionName, res.user.uid));
    })
    .then(() => {
      toast.success("Successfully Logged In");
    })
    .catch((error) => {
      printFirebaseError(error);
    });
};

// get specific user detail using uid
export const getUserDetailAPI = async (uid: string) => {
  const docSnap = await getDoc(doc(firestoreDB, collectionName, uid));
  // If Document Snapshot exist then return data
  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    console.log("No such document exists!");
  }
  return undefined;
};

export const queryUserAPI = async (queryFilter: QueryFieldFilterConstraint) => {
  // creates a reference to the collection
  const userRef = collection(firestoreDB, collectionName);

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
        return await updateDoc(doc(firestoreDB, collectionName, res.user.uid), {
          lastLoginAt: new Date().toLocaleString(),
        });

      return await setDoc(doc(firestoreDB, collectionName, user?.uid), {
        displayName: user.displayName,
        email: res.user.email,
        uid: res.user.uid,
        role: "user", // ["user", "admin", "super"]
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
