import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles }) => {
  const { isAuthenticated, role } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to={"/"} />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to={"/unauthorized"} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
