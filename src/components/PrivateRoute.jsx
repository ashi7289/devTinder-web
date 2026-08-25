import { Navigate, useOutletContext } from "react-router-dom";
import { useSelector } from "react-redux";
import Loader from "./Loader";

const PrivateRoute = ({ children }) => {
  const user = useSelector((store) => store.user);
  const { checkingAuth } = useOutletContext();

  if (checkingAuth) return <Loader />;

  if (!user) return <Navigate to="/login" replace />;

  return children;
};

export default PrivateRoute;
