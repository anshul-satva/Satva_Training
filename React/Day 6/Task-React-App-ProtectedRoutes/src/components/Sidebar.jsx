import { Layout, Menu } from "antd";
import {
  DashboardOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";

const { Sider } = Layout;

const Sidebar = () => {
  const { role } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();

  const items = [
    {
      key: "/dashboard",
      icon: <DashboardOutlined />,
      label: "Dashboard",
    },
  ];

  if (role === "admin") {
    items.push({
      key: "/admin",
      icon: <SettingOutlined />,
      label: "Admin Panel",
    });
  }

  return (
    <Sider width={220} style={{ minHeight: "100vh" }}>
      <div
        style={{
          height: 60,
          color: "white",
          display: "flex",
          alignItems: "center",
          paddingLeft: 20,
          fontSize: 18,
          fontWeight: 600,
        }}
      >
        Menu
      </div>

      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[location.pathname]}
        items={items}
        onClick={({ key }) => navigate(key)}
      />
    </Sider>
  );
};

export default Sidebar;