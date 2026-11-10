import { Outlet, useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useEffect, useState } from "react";
import usePresence from "../utils/usePresence";

const Body = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = useSelector((store) => store.user);
  const [checkingAuth, setCheckingAuth] = useState(!userData);
  usePresence();

  const fetchUser = async () => {
    if (userData) {
      setCheckingAuth(false);
      return;
    }
    try {
      const res = await axios.get(BASE_URL + "/profile/view", {
        withCredentials: true,
      });
      dispatch(addUser(res.data));
    } catch (err) {
      if (err.status === 401) {
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
