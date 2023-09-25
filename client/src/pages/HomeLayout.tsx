import { getAuth } from "firebase/auth";
import { useContext, useEffect, useState } from "react";
import { firebaseAuth } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import { ColorModeContext } from "../context/ThemeMode";
import Loading from "./Loading";

type Props = {};

export default function HomeLayout({}: Props) {
  const { toggleColorMode } = useContext(ColorModeContext);
  const auth = getAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    firebaseAuth.onAuthStateChanged((user) => {
      if (!user) navigate("/sign-in");
      setIsLoading(false);
    });
  });

  return isLoading ? (
    <Loading message="Just loading to Say Hello !!" />
  ) : (
    <div>
      HomeLayout
      <button onClick={toggleColorMode}></button>
      <button onClick={() => auth.signOut()}>SignOut</button>
    </div>
  );
}
