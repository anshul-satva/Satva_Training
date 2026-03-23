import React from "react";
import { useEffect } from "react";
import { logout } from "../redux/slices/authSlice";
import { useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { Layout } from "antd";

const MainLayout = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const handleStorage = (event) => {
      if (event.key === "logout-event") {
        dispatch(logout());
      }
    };
    window.addEventListener("storage", handleStorage);

    return () => window.removeEventListener("storage", handleStorage);
  }, [dispatch]);

  return (
    <div>
      <Layout>
        <Sidebar />
        <Layout>
          <Navbar />

          <Outlet />
        </Layout>
      </Layout>
    </div>
  );
};

export default MainLayout;
