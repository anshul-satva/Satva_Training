import React from "react";
import { Layout, Menu, Button } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { Link, useLocation, Outlet } from "react-router-dom";
import { toggleSidebar } from "../store/uiSlice";
import { DashboardOutlined, SettingOutlined } from "@ant-design/icons";

const { Sider, Content, Header } = Layout;

const AdminLayout = () => {
  const dispatch = useDispatch();
  const collapsed = useSelector((state) => state.ui.collapsed);
  const location = useLocation();
  return (
    <div>
      <Layout style={{ minHeight: "100vh" }}>
        <Sider collapsed={collapsed}>
          <div style={{ color: "#fff", padding: 16, textAlign: "center" }}>
            {collapsed ? "AD" : "Admin Panel"}
          </div>
          <Menu
            theme="dark"
            selectedKeys={[location.pathname]}
            items={[
              {
                key: "/",
                icon: <DashboardOutlined />,
                label: <Link to="/">Dashboard</Link>,
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
          <Header style={{ background: "#fff", padding: "0 10px" }}>
            <Button onClick={() => dispatch(toggleSidebar())}>
              {collapsed ? ">" : "<"}
            </Button>
          </Header>
          <Content style={{ margin: 24, padding: 24, background: "#fff" }}>
            <Outlet /> 
          </Content>
        </Layout>
      </Layout>
    </div>
  );
};

export default AdminLayout;
