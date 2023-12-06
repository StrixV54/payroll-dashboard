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
      localStorage.removeItem("zuco-rolelevel-cache");
      localStorage.removeItem("zuco-thememode-cache");
      dispatch(resetAuth());
      firebaseAuth.signOut();
    }
    navigate("/");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <Loading message="Logging Out !!" />;
}
