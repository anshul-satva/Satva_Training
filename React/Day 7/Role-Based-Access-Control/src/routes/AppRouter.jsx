import { createBrowserRouter, Navigate } from "react-router-dom";
import ProtectedRoutes from "./ProtectedRoute";
import Authlayout from "../layouts/AuthLayout";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import UserList from "../pages/Users/UserList";
import EmployeeList from "../pages/Employees/EmployeeList";
import ProjectList from "../pages/Projects/ProjectList";
import RolePermissions from "../pages/Roles/RolePermissions";
import Unauthorized from "../pages/Unauthorized";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  { path: "/unauthorized", element: <Unauthorized /> },
  {
    element: <ProtectedRoutes />,
    children: [
      {
        element: <Authlayout />,
        children: [
          {
            path: "/",
            element: <Dashboard />,
          },
          {
            element: (
              <ProtectedRoutes allowedModule="users" requiredAction="view" />
            ),
            children: [{ path: "/users", element: <UserList /> }],
          },
          {
            element: (
              <ProtectedRoutes
                allowedModule="employees"
                requiredAction="view"
              />
            ),
            children: [{ path: "/employees", element: <EmployeeList /> }],
          },
          {
            element: (
              <ProtectedRoutes allowedModule="projects" requiredAction="view" />
            ),
            children: [{ path: "/projects", element: <ProjectList /> }],
          },
          {
            element: (
              <ProtectedRoutes allowedModule="roles" requiredAction="view" />
            ),
            children: [{ path: "/roles", element: <RolePermissions /> }],
          },
        ],
      },
    ],
  },
  { path: "*", element: <Navigate to={"/"} replace /> },
]);

export default router