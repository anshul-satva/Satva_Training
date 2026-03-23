import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AdminLayout from "./components/AdminLayout";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
