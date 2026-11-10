import { useEffect, useState } from "react";
import UserCard from "./UserCard";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import Icon from "./ui/Icon";
import TextField from "./ui/TextField";
import FormError from "./ui/FormError";

const EditProfile = ({ user }) => {
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [photoUrl, setPhotoUrl] = useState(user.photoUrl);
  const [age, setAge] = useState(user.age || "");
  const [gender, setGender] = useState(user.gender || "");
  const [about, setAbout] = useState(user.about || "");
  const [error, setError] = useState("");
  const [genderOptions, setGenderOptions] = useState([]);
  const dispatch = useDispatch();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchGenderOptions = async () => {
      try {
        const res = await axios.get(BASE_URL + "/gender", {
          withCredentials: true,
        });
        setGenderOptions(res.data.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchGenderOptions();
  }, []);

  const saveProfile = async (e) => {
    e.preventDefault();
    //Clear Errors
    setError("");
    setSaving(true);
    try {
      const res = await axios.patch(
        BASE_URL + "/profile/edit",
        {
          firstName,
          lastName,
          photoUrl,
          age,
          gender,
          about,
        },
        { withCredentials: true }
      );
      dispatch(addUser(res?.data?.data));
      setToastMessage(res?.data?.message);
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    } catch (err) {
      setError(err?.response?.data || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="mx-auto max-w-6xl px-4 pt-8">
        <div className="mb-8">
          <h1 className="page-title">
            Your <span className="text-gradient">profile</span>
          </h1>
          <p className="mt-1 text-base-content/60">
            This is how other developers see you. Make it count.
          </p>
        </div>

        <div className="grid items-start gap-10 lg:grid-cols-[1fr_22rem]">
          <form
            onSubmit={saveProfile}
            className="glass-card animate-fade-up space-y-5 p-6 sm:p-8"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <TextField
                label="First name"
                value={firstName}
                onChange={setFirstName}
              />
              <TextField
                label="Last name"
                value={lastName}
                onChange={setLastName}
              />
            </div>

            <TextField
              label="Photo URL"
              icon="user"
              placeholder="https://…"
              value={photoUrl}
              onChange={setPhotoUrl}
            />

            <div className="grid gap-5 sm:grid-cols-2">
              <TextField
                label="Age"
                type="number"
                min="18"
                value={age}
                onChange={setAge}
              />
              <label className="block">
                <span className="field-label">Gender</span>
                <select
                  value={gender}
                  className="select w-full border-white/10 bg-base-300/60 focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/30"
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option value="" disabled>
                    Select gender
                  </option>
                  {genderOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="block">
              <span className="field-label flex justify-between">
                About
                <span className="font-mono text-xs text-base-content/40">
                  {about.length} chars
                </span>
              </span>
              <textarea
                value={about}
                rows={4}
                placeholder="What do you build? What stack do you love? What are you looking for?"
                className="textarea w-full resize-none border-white/10 bg-base-300/60 text-base leading-relaxed placeholder:text-base-content/30 focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/30"
                onChange={(e) => setAbout(e.target.value)}
              />
            </label>

            <FormError message={error} />

            <div className="flex justify-end">
              <button
                type="submit"
                className="btn-gradient w-full sm:w-auto sm:px-8"
                disabled={saving}
              >
                {saving ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  <Icon name="check" className="h-4 w-4" />
                )}
                Save profile
              </button>
            </div>
          </form>

          <aside className="mx-auto w-full max-w-sm lg:sticky lg:top-24">
            <p className="mb-3 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-base-content/40">
              <span className="h-2 w-2 animate-pulse rounded-full bg-success" />
              Live preview
            </p>
            <UserCard
              key={photoUrl}
              user={{ firstName, lastName, photoUrl, age, gender, about }}
              showActions={false}
            />
          </aside>
        </div>
      </div>

      {showToast && (
        <div className="toast toast-top toast-center z-50">
          <div className="alert flex items-center gap-2 border-success/30 bg-base-200 text-success shadow-2xl">
            <Icon name="check" className="h-5 w-5" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </>
  );
};
export default EditProfile;
