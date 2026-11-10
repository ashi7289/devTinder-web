import { useSelector } from "react-redux";
import EditProfile from "./EditProfile";
import DeleteAccount from "./DeleteAccount";

const Profile = () => {
  const user = useSelector((store) => store.user);
  return (
    user && (
      <div>
        <EditProfile user={user} />
        <div className="mx-auto max-w-6xl px-4 pb-10">
          <DeleteAccount />
        </div>
      </div>
    )
  );
};
export default Profile;
