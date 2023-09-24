import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { firebaseAuth, firestoreDB } from "./firebase";
import {
  QueryFieldFilterConstraint,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore";

const collectionName = "users";

export const signUpAPI = async (
  fullName: string,
  email: string,
  password: string
) => {
  return createUserWithEmailAndPassword(firebaseAuth, email, password).then(
    async (res) => {
      /**
       * creates a new document with user's uid adding following information passed next.
       * */
      return await setDoc(doc(firestoreDB, collectionName, res.user?.uid), {
        displayName: fullName,
        email: res.user?.email,
        uid: res.user?.uid,
        isAdmin: false,
        isSuperAdmin: false,
        lastLoginAt: null,
      });
    }
  );
};

export const signInAPI = async (email: string, password: string) => {
  /**
   * SignIn function of Firebase , we update last login time and get the doc info
   * */
  return signInWithEmailAndPassword(firebaseAuth, email, password).then(
    async (res) => {
      console.log(res);
      await updateDoc(doc(firestoreDB, collectionName, res.user?.uid), {
        lastLoginAt: new Date().toLocaleString(),
      });
      return await getDoc(doc(firestoreDB, collectionName, res.user?.uid));
    }
  );
};

export const queryUserAPI = async (queryFilter: QueryFieldFilterConstraint) => {
  // creates a reference to the collection
  const userRef = collection(firestoreDB, "cities");

  // passing a single where query to  the query function
  const q = query(userRef, queryFilter);
  const querySnapshot = await getDocs(q);
  return querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    console.log(doc.id, " => ", doc.data());
  });
};
