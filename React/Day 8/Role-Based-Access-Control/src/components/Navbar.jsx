import React from "react";
import { Button, Space, Tag, Typography } from "antd";
import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../redux/slices/authSlice";
import { clearPermissions } from "../redux/slices/permissionSlice";

const { Text } = Typography;

const Navbar = () => {
  const dispath = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const handelLogout = () => {
    localStorage.removeItem("authToken");
    dispath(logout());
    dispath(clearPermissions());
    navigate("/login");
  };

  const roleColors = {
    Admin: "red",
    HR: "blue",
    Supervisor: "orange",
    Manager: "green",
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        height: "100%",
      }}
    >
      <Space size="middle">
        <Text strong>{user?.name}</Text>
        <Tag color={roleColors[user?.roleName] || "default"}>
          {user?.roleName}
        </Tag>
        <Button
          type="primary"
          danger
          icon={<LogoutOutlined />}
          onClick={handelLogout}
        >
          Logout
        </Button>
      </Space>
    </div>
  );
};

export default Navbar;
