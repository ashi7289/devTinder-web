import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import AuthLayout from "./ui/AuthLayout";
import TextField from "./ui/TextField";
import FormError from "./ui/FormError";

const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await axios.post(
        BASE_URL + "/signup",
        { firstName, lastName, emailId, password },
        { withCredentials: true }
      );
      dispatch(addUser(res.data.data));
      return navigate("/profile");
    } catch (err) {
      setError(err?.response?.data || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Join DevTinder 🚀"
      subtitle="Create your profile and start matching with developers."
    >
      <form onSubmit={handleSignUp} className="space-y-5">
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
          placeholder="Use a strong password"
          autoComplete="new-password"
          value={password}
          onChange={setPassword}
        />
        <FormError message={error} />
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
