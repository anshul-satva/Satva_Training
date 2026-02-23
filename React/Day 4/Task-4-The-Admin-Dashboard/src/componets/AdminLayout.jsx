import React from "react";
import { Layout, Menu, Switch } from "antd";
import "antd/dist/reset.css";
import {
  DashboardOutlined,
  UserOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../features/themeSlice";
import { toggleSidebar } from "../features/layoutSlice";
import { Link, Outlet, useLocation } from "react-router-dom";

const { Header, Sider, Content } = Layout;

function AdminLayout() {
  const dispatch = useDispatch();
  const location = useLocation();

  const { mode } = useSelector((state) => state.theme);
  const { collapsed } = useSelector((state) => state.layout);

  return (
    <>
      <Layout style={{ minBlockSize: "100vh" }}>
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={() => dispatch(toggleSidebar())}
          theme={mode}
        >
          <div
            style={{
              color: mode === "dark" ? "#fff" : "#000",
              padding: 16,
              fontWeight: "bold",
            }}
          >
            {collapsed ? "AD" : "Admin Dashboard"}
          </div>
          <Menu
            theme={mode}
            mode="inline"
            selectedKeys={[location.pathname]}
            items={[
              {
                key: "/",
                icon: <DashboardOutlined />,
                label: <Link to="/">Dashboard</Link>,
              },
              {
                key: "/users",
                icon: <UserOutlined />,
                label: <Link to="/users">Users</Link>,
              },
              {
                key: "/settings",
                icon: <SettingOutlined />,
                label: <Link to="/settings">Settings</Link>,
              },
            ]}
          />
        </Sider>

        <Layout>
          <Header
            style={{
              background: mode === "dark" ? "#141414" : "#fff",
              display: "flex",
              justifyContent: "space-between",
              padding: "0 20px",
            }}
          >
            <h3 style={{ color: mode === "dark" ? "#fff" : "#000" }}>Admin</h3>

            <div
              style={{
                color: mode === "dark" ? "#fff" : "#000",
                fontWeight: "bold",
              }}
            >
              Dark Mode
              <Switch
                checked={mode === "dark"}
                onChange={() => dispatch(toggleTheme())}
                style={{ marginInlineStart: 10 }}
              />
            </div>
          </Header>

          <Content
            style={{
              margin: "1px",
              background: mode === "dark" ? "#141414" : "#fff",
              color: mode === "dark" ? "#fff" : "#000",
              padding: 20,
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </>
  );
}

export default AdminLayout;
