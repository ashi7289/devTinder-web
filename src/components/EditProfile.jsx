import { useEffect, useState } from "react";
import UserCard from "./UserCard";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";

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

  const saveProfile = async () => {
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
      setError(err.response.data);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row justify-center items-center my-10 px-4">
        <div className="w-full max-w-sm mx-auto">
          <div className="card bg-neutral text-neutral-content w-full shadow-xl">
            <div className="card-body">
              <h2 className="card-title justify-center">Edit Profile</h2>
              <div>
                <label className="form-control w-full max-w-xs my-2">
                  <div className="label">
                    <span className="label-text text-neutral-content">
                      First Name:
                    </span>
                  </div>
                  <input
                    type="text"
                    value={firstName}
                    className="input input-bordered w-full max-w-xs bg-base-100 text-base-content"
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </label>
                <label className="form-control w-full max-w-xs my-2">
                  <label className="form-control w-full max-w-xs my-2">
                    <div className="label">
                      <span className="label-text text-neutral-content">
                        Last Name:
                      </span>
                    </div>
                    <input
                      type="text"
                      value={lastName}
                      className="input input-bordered w-full max-w-xs bg-base-100 text-base-content"
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </label>
                  <div className="label">
                    <span className="label-text text-neutral-content">
                      Photo URL :
                    </span>
                  </div>
                  <input
                    type="text"
                    value={photoUrl}
                    className="input input-bordered w-full max-w-xs bg-base-100 text-base-content"
                    onChange={(e) => setPhotoUrl(e.target.value)}
                  />
                </label>
                <label className="form-control w-full max-w-xs my-2">
                  <div className="label">
                    <span className="label-text text-neutral-content">
                      Age:
                    </span>
                  </div>
                  <input
                    type="text"
                    value={age}
                    className="input input-bordered w-full max-w-xs bg-base-100 text-base-content"
                    onChange={(e) => setAge(e.target.value)}
                  />
                </label>
                <label className="form-control w-full max-w-xs my-2">
                  <div className="label">
                    <span className="label-text text-neutral-content">
                      Gender:
                    </span>
                  </div>
                  <select
                    value={gender}
                    className="select select-bordered w-full max-w-xs bg-base-100 text-base-content"
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
                <label className="form-control w-full max-w-xs my-2">
                  <div className="label">
                    <span className="label-text text-neutral-content">
                      About:
                    </span>
                  </div>
                  <input
                    type="text"
                    value={about}
                    className="input input-bordered w-full max-w-xs bg-base-100 text-base-content"
                    onChange={(e) => setAbout(e.target.value)}
                  />
                </label>
              </div>
              <p className="text-base-100 font-semibold">{error}</p>
              <div className="card-actions justify-center m-2">
                <button
                  className="btn btn-primary"
                  onClick={saveProfile}
                  disabled={saving}
                >
                  {saving && (
                    <span className="loading loading-spinner"></span>
                  )}
                  Save Profile
                </button>
              </div>
            </div>
          </div>
        </div>
        <UserCard
          user={{ firstName, lastName, photoUrl, age, gender, about }}
          showActions={false}
        />
      </div>
      {showToast && (
        <div className="toast toast-top toast-center">
          <div className="alert alert-success text-white">
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </>
  );
};
export default EditProfile;
