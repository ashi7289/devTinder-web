import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../../utils/constants";
import { addUser } from "../../utils/userSlice";
import Avatar from "./Avatar";
import Icon from "./Icon";

const MAX_SIZE = 2 * 1024 * 1024; // 2 MB, same limit as the server
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

// Pick a photo from the device; it's uploaded right away and saved to the profile
const PhotoUpload = ({ photoUrl, firstName, lastName, onUploaded }) => {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const dispatch = useDispatch();

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow choosing the same file again later
    if (!file) return;

    setError("");
    if (!ALLOWED_TYPES.includes(file.type)) {
      return setError("Only JPG, PNG, WEBP or GIF images are allowed");
    }
    if (file.size > MAX_SIZE) {
      return setError("Image must be smaller than 2 MB");
    }

    // Show the picked image immediately while it uploads
    const previewUrl = URL.createObjectURL(file);
    onUploaded(previewUrl);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("photo", file);
      const res = await axios.post(BASE_URL + "/profile/photo", formData, {
        withCredentials: true,
      });
      dispatch(addUser(res.data.data));
      onUploaded(res.data.data.photoUrl);
    } catch (err) {
      onUploaded(photoUrl); // go back to the previous photo
      setError(err.response?.data?.message || "Upload failed, try again");
    } finally {
      URL.revokeObjectURL(previewUrl);
      setUploading(false);
    }
  };

  return (
    <div>
      <span className="field-label">Profile photo</span>
      <div className="flex items-center gap-4">
        <div className="relative">
          <Avatar
            src={photoUrl}
            firstName={firstName}
            lastName={lastName}
            className="h-16 w-16 text-lg"
          />
          {uploading && (
            <span className="absolute inset-0 grid place-items-center rounded-full bg-black/50">
              <span className="loading loading-spinner loading-sm text-white" />
            </span>
          )}
        </div>

        <div className="space-y-1">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="btn btn-outline btn-sm gap-2"
            disabled={uploading}
          >
            <Icon name="user" className="h-4 w-4" />
            {uploading ? "Uploading…" : "Upload photo"}
          </button>
          <p className="text-xs text-base-content/50">JPG, PNG, WEBP or GIF · max 2 MB</p>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept={ALLOWED_TYPES.join(",")}
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
      {error && <p className="mt-2 text-sm text-error">{error}</p>}
    </div>
  );
};

export default PhotoUpload;
