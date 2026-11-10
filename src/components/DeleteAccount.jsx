import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { removeUser } from "../utils/userSlice";
import { removeFeed } from "../utils/feedSlice";
import { removeConnections } from "../utils/conectionSlice";
import { removeRequests } from "../utils/requestSlice";
import Icon from "./ui/Icon";
import TextField from "./ui/TextField";
import FormError from "./ui/FormError";

// "Danger zone" card + confirmation popup that permanently deletes the account
const DeleteAccount = () => {
  const dialogRef = useRef(null);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const openDialog = () => {
    setPassword("");
    setError("");
    dialogRef.current?.showModal();
  };

  const closeDialog = () => {
    if (!deleting) dialogRef.current?.close();
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    setError("");
    setDeleting(true);
    try {
      await axios.delete(BASE_URL + "/profile/delete", {
        data: { password },
        withCredentials: true,
      });

      // Account is gone → clear everything on this device and go to signup
      dispatch(removeUser());
      dispatch(removeFeed());
      dispatch(removeConnections());
      dispatch(removeRequests());
      dialogRef.current?.close();
      navigate("/signup", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <div className="glass-card mt-8 border border-error/30 p-6 sm:p-8">
        <h2 className="text-lg font-semibold text-error">Danger zone</h2>
        <p className="mt-1 text-sm text-base-content/60">
          Deleting your account removes your profile, connections, requests and
          chats permanently. This cannot be undone.
        </p>
        <button
          type="button"
          onClick={openDialog}
          className="btn btn-outline btn-error mt-4 gap-2"
        >
          <Icon name="trash" className="h-4 w-4" />
          Delete account
        </button>
      </div>

      <dialog ref={dialogRef} className="modal" onCancel={(e) => deleting && e.preventDefault()}>
        <form
          onSubmit={handleDelete}
          className="modal-box space-y-4 border border-white/10 bg-base-200"
        >
          <h3 className="text-lg font-bold">Delete your account?</h3>
          <p className="text-sm text-base-content/60">
            This permanently deletes your profile, connections, requests and
            chats. Enter your password to confirm.
          </p>

          <TextField
            label="Password"
            icon="lock"
            type="password"
            value={password}
            onChange={setPassword}
            autoComplete="current-password"
            autoFocus
          />

          <FormError message={error} />

          <div className="modal-action">
            <button
              type="button"
              onClick={closeDialog}
              className="btn btn-ghost"
              disabled={deleting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-error"
              disabled={!password || deleting}
            >
              {deleting && <span className="loading loading-spinner loading-sm" />}
              Delete permanently
            </button>
          </div>
        </form>
        {/* Click outside to close */}
        <form method="dialog" className="modal-backdrop">
          <button disabled={deleting}>close</button>
        </form>
      </dialog>
    </>
  );
};

export default DeleteAccount;
