import { createRoot } from "react-dom/client";
import React from "react";
import "antd/dist/reset.css";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./redux/store";
import { RouterProvider } from "react-router-dom";
import "./index.css";
import App from "./App";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>,
);
