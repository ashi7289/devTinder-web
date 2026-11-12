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
import PasswordRules, { missingPasswordRules } from "./ui/PasswordRules";

const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [triedSubmit, setTriedSubmit] = useState(false);
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setTriedSubmit(true);

    // Check required fields here so the user gets a clear message right away
    if (!firstName.trim()) return toast.error("Please enter your first name.");
    if (firstName.trim().length < 4)
      return toast.error("First name must be at least 4 characters.");
    if (!emailId.trim()) return toast.error("Please enter your email.");
    if (!isValidEmail(emailId))
      return toast.error("Please enter a valid email address.");
    if (!password) return toast.error("Please enter a password.");

    // Catch a weak password here instead of waiting for the server's vague error
    const missing = missingPasswordRules(password);
    if (missing.length) {
      toast.error("Password needs: " + missing.join(", ").toLowerCase() + ".");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        BASE_URL + "/signup",
        { firstName: firstName.trim(), lastName: lastName.trim(), emailId: emailId.trim(), password },
        { withCredentials: true }
      );
      dispatch(addUser(res.data.data));
      toast.success(`Welcome to DevTinder, ${res.data.data?.firstName || firstName.trim()}! 🎉`);
      return navigate("/profile");
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // Already logged in: no reason to show the signup form
  if (user) return <Navigate to="/" replace />;

  return (
    <AuthLayout
      title="Join DevTinder 🚀"
      subtitle="Create your profile and start matching with developers."
    >
      <form onSubmit={handleSignUp} noValidate className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <TextField
            label="First name"
            placeholder="Ada"
            autoComplete="given-name"
            value={firstName}
            onChange={setFirstName}
          />
          <TextField
            label="Last name"
            placeholder="Lovelace"
            autoComplete="family-name"
            value={lastName}
            onChange={setLastName}
          />
        </div>
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
          placeholder="At least 8 characters"
          autoComplete="new-password"
          value={password}
          onChange={setPassword}
        />
        {(password || triedSubmit) && (
          <div className="!mt-0">
            <PasswordRules password={password} highlightMissing={triedSubmit} />
          </div>
        )}
        <button type="submit" className="btn-gradient w-full" disabled={loading}>
          {loading && <span className="loading loading-spinner"></span>}
          Create account
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-base-content/60">
        Already have an account?{" "}
        <Link to="/login" className="font-semibold text-primary hover:underline">
          Log in
        </Link>
      </p>
    </AuthLayout>
  );
};
export default Signup;
