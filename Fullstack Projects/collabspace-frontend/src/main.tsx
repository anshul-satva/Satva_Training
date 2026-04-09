import { StrictMode } from "react";
import { createRoot, type Root } from "react-dom/client";
import { App as AntApp, ConfigProvider } from "antd";
import { RouterProvider } from "react-router-dom";
import { appRouter } from "./app/router.tsx";
import { getAppTheme } from "./app/theme.ts";
import { AuthProvider } from "./hooks/auth-provider.tsx";
import { ColorModeProvider, useColorMode } from "./hooks/use-color-mode.tsx";
import "./index.css";

export function ThemedApp() {
  const { mode } = useColorMode();

  return (
    <ConfigProvider theme={getAppTheme(mode)}>
      <AntApp>
        <RouterProvider router={appRouter} />
      </AntApp>
    </ConfigProvider>
  );
}

const container = document.getElementById("root");

if (!container) {
  throw new Error("Root container not found");
}

const windowWithRoot = window as Window & { __collabspaceRoot__?: Root };
const root = windowWithRoot.__collabspaceRoot__ ?? createRoot(container);
windowWithRoot.__collabspaceRoot__ = root;

root.render(
  <StrictMode>
    <ColorModeProvider>
      <AuthProvider>
        <ThemedApp />
      </AuthProvider>
    </ColorModeProvider>
  </StrictMode>,
);
