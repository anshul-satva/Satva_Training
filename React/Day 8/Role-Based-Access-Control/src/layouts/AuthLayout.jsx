import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const { Sider, Content, Header } = Layout;

const AuthLayout = () => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider width={230} theme="dark">
        <div
          style={{
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: 18,
            fontWeight: "bold",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          Application
        </div>
        <Sidebar />
      </Sider>

      <Layout>
        <Header
          style={{
            padding: "0 24px",
            background: "#fff",
            boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
          }}
        >
          <Navbar />
        </Header>

        <Content
          style={{
            margin: 24,
            background: "#fff",
            padding: 24,
            borderRadius: 8,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AuthLayout;
