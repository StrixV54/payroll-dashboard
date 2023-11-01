import { useEffect } from "react";
import { firebaseAuth } from "../firebase/config";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { resetAuth } from "../redux/authSlice";
import Loading from "./Loading";
import { RootState } from "../redux/store";

export default function SignOut() {
  const isUserAuthentic = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    //checks current state of auth locally
    if (isUserAuthentic) {
      localStorage.removeItem("roleLevel");
      dispatch(resetAuth());
      firebaseAuth.signOut();
    }
    navigate("/");
  }, []);

  return <Loading message="Logging Out !!" />;
}
