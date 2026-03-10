import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { hasPermission } from "../utils/permissionHelpers";

function ProtectedRoutes({ allowedModule, requiredAction = "view" }) {
  const { isAuthenticated } = useSelector((state) => state.auth ?? {});
  const permissions = useSelector((state) => state.permissions);

  if (!isAuthenticated) {
    return <Navigate to={"/login"} replace />;
  }

  if (allowedModule) {
    const allowed = hasPermission(permissions, allowedModule, requiredAction);
    if (!allowed) {
      return <Navigate to="/unauthorized" replace />;
    }
  }
  return <Outlet />;
}

export default ProtectedRoutes;
