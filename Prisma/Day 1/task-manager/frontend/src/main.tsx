import React from "react";
import ReactDOM from "react-dom/client";
import { App as AntApp, ConfigProvider } from "antd";
import { RouterProvider } from "react-router-dom";
import { router } from "./app/router";
import { AuthProvider } from "./app/providers/AuthProvider";
import "antd/dist/reset.css";
import "./app/styles/global.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ConfigProvider
    theme={{
      token: {
        colorPrimary: "#1677ff",
        colorSuccess: "#13b38b",
        colorWarning: "#f5a623",
        colorError: "#e64f5a",
        borderRadius: 18,
        fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
      },
    }}
  >
    <AntApp>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </AntApp>
  </ConfigProvider>,
);
