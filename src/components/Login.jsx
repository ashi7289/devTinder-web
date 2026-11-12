import { useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/userSlice";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { getErrorMessage, isValidEmail } from "../utils/errorMessage";
import AuthLayout from "./ui/AuthLayout";
import TextField from "./ui/TextField";
import { useToast } from "./ui/Toast";

const Login = () => {
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!emailId.trim()) return toast.error("Please enter your email.");
    if (!isValidEmail(emailId))
      return toast.error("Please enter a valid email address.");
    if (!password) return toast.error("Please enter your password.");

    setLoading(true);
    try {
      const res = await axios.post(
        BASE_URL + "/login",
        { emailId: emailId.trim(), password },
        { withCredentials: true },
      );
      dispatch(addUser(res.data));
      toast.success(`Welcome back, ${res.data?.firstName || "developer"}! 👋`);
      return navigate("/");
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // Already logged in: no reason to show the login form
  if (user) return <Navigate to="/" replace />;

  return (
    <AuthLayout
      title="Welcome back 👋"
      subtitle="Log in to see who wants to build with you."
    >
      <form onSubmit={handleLogin} noValidate className="space-y-5">
        <TextField
          label="Email"
          icon="mail"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          value={emailId}
          onChange={setEmailId}
        />
        <TextField
          label="Password"
          icon="lock"
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
          value={password}
          onChange={setPassword}
        />
        <button
          type="submit"
          className="btn-gradient w-full"
          disabled={loading}
        >
          {loading && <span className="loading loading-spinner"></span>}
          Log in
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-base-content/60">
        New to DevTinder?{" "}
        <Link
          to="/signup"
          className="font-semibold text-primary hover:underline"
        >
          Create an account
        </Link>
      </p>
    </AuthLayout>
  );
};
export default Login;
