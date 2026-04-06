import { useState } from "react";
import { Button, Layout, Menu, Typography } from "antd";
import {
  AppstoreOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  FolderOpenOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";

export const AppShell = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, isHydrated, logout, user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";

  if (isAuthPage || !isHydrated || !isAuthenticated) {
    return <Outlet />;
  }

  return (
    <Layout className="app-layout">
      <Layout.Sider
        width={264}
        collapsed={collapsed}
        collapsedWidth={96}
        theme="light"
        className="app-sidebar"
      >
        <div className="sidebar-shell">
          <div>
            <div className={`sidebar-topbar ${collapsed ? "justify-content-center" : ""}`}>
              {!collapsed ? (
                <Typography.Text className="sidebar-section-label">Workspace</Typography.Text>
              ) : (
                <span />
              )}
              <Button
                type="text"
                className="sidebar-toggle"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed((current) => !current)}
              />
            </div>

            <div className={`sidebar-brand ${collapsed ? "sidebar-brand-collapsed" : ""}`}>
              <div className="sidebar-brand-mark">TM</div>
              {!collapsed ? (
                <div>
                  <Typography.Title level={4} className="brand-font sidebar-brand-title">
                    Task Manager
                  </Typography.Title>
                  <Typography.Text type="success">
                    {user?.name || "Workspace"}
                  </Typography.Text>
                </div>
              ) : null}
            </div>

            <Menu
              mode="inline"
              selectedKeys={[location.pathname]}
              inlineCollapsed={collapsed}
              className="sidebar-menu"
              items={[
                {
                  key: "/dashboard",
                  icon: <AppstoreOutlined />,
                  label: "Dashboard",
                  onClick: () => navigate("/dashboard"),
                },
                {
                  key: "/tasks",
                  icon: <FolderOpenOutlined />,
                  label: "My Tasks",
                  onClick: () => navigate("/tasks"),
                },
              ]}
            />
          </div>

          <Button
            type="text"
            className={`sidebar-logout ${collapsed ? "sidebar-logout-collapsed" : ""}`}
            icon={<LogoutOutlined />}
            onClick={() => {
              logout();
              navigate("/login", { replace: true });
            }}
          >
            {collapsed ? "" : "Logout"}
          </Button>
        </div>
      </Layout.Sider>

      <Layout className="app-layout-content">
        <Outlet />
      </Layout>
    </Layout>
  );
};
