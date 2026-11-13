import { Outlet, useLocation, useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useEffect, useState } from "react";
import usePresence from "../utils/usePresence";
import { hasLoginHint, setLoginHint } from "../utils/authHint";

const Body = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const userData = useSelector((store) => store.user);
  const [checkingAuth, setCheckingAuth] = useState(!userData);
  usePresence();

  const fetchUser = async () => {
    // Already have the user, or this browser was never logged in → no server call
    if (userData || !hasLoginHint()) {
      setCheckingAuth(false);
      return;
    }
    try {
      const res = await axios.get(BASE_URL + "/profile/view", {
        withCredentials: true,
      });
      dispatch(addUser(res.data));
    } catch (err) {
      // Token expired or invalid → forget the hint so we stop asking
      if (err.status === 401) setLoginHint(false);
      // Signup is public, so don't push logged-out visitors away from it
      if (err.status === 401 && location.pathname !== "/signup") {
        navigate("/login");
      }
      console.error(err);
    } finally {
      setCheckingAuth(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      {/* Bottom padding keeps content clear of the mobile tab bar */}
      <main className={"flex-1 " + (userData ? "pb-24 md:pb-10" : "pb-10")}>
        <Outlet context={{ checkingAuth }} />
      </main>
    </div>
  );
};
export default Body;
