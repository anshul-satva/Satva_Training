import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import MainLayout from "../layout/MainLayout";
import ProtectedRoute from "./ProtectedRoute";
import UnAuthorized from "../pages/UnAuthorized";
import Admin from "../pages/Admin";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          {
            path: "/dashboard",
            element: <Dashboard />,
          },
          {
            element: <ProtectedRoute allowedRoles={["admin"]} />,
            children: [
              {
                path: "/admin",
                element: <Admin />,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: "/unauthorized",
    element: <UnAuthorized />,
  },
]);
