import { getAuth } from "firebase/auth";
import { useEffect, useState } from "react";
import { firebaseAuth } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";

type Props = {};

export default function HomeLayout({}: Props) {
  const auth = getAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    firebaseAuth.onAuthStateChanged((user) => {
      if (!user) navigate("/sign-in");
      setIsLoading(false);
    });
  });

  return (
    <div>
      HomeLayout
      <button onClick={() => auth.signOut()}>SignOut</button>
    </div>
  );
}
