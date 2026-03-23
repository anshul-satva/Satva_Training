import { Card, Col, Row, Statistic, Typography, Tag } from "antd";
import {
  TeamOutlined,
  UserOutlined,
  ProjectOutlined,
  SafetyOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import { getAccessibleModules } from "../utils/permissionHelpers";

const { Title, Text } = Typography;

function Dashboard() {
  const { user } = useSelector((state) => state.auth);
  const permissions = useSelector((state) => state.permissions);
  const accessibleModules = getAccessibleModules(permissions);

  const roleColors = {
    Admin: "red",
    HR: "blue",
    Supervisor: "orange",
    Manager: "green",
  };

  const moduleStats = [
    {
      module: "users",
      label: "Users",
      icon: <TeamOutlined />,
      color: "#1890ff",
    },
    {
      module: "employees",
      label: "Employees",
      icon: <UserOutlined />,
      color: "#52c41a",
    },
    {
      module: "projects",
      label: "Projects",
      icon: <ProjectOutlined />,
      color: "#faad14",
    },
    {
      module: "roles",
      label: "Roles",
      icon: <SafetyOutlined />,
      color: "#f5222d",
    },
  ];

  return (
    <div>
      <Card style={{ marginBottom: 24 }}>
        <Title level={4}>Welcomes, {user?.name}!</Title>
        <Text type="secondary">
          You are logged in as
          <Tag color={roleColors[user?.roleName]}>{user?.roleName}</Tag>
        </Text>
      </Card>

      <Title level={5} style={{ marginBottom: 16 }}>
        Your Access
      </Title>
      <Row gutter={[16, 16]}>
        {moduleStats.map(({ module, label, icon }) => (
          <Col xs={24} sm={12} md={6} key={module}>
            <Card style={{ height: "100%" }}>
              <Statistic
                title={label}
                value={
                  accessibleModules.includes(module)
                    ? "Access Granted"
                    : "No Access"
                }
                styles={{
                  color: accessibleModules.includes(module)
                    ? "#52c41a"
                    : "#f5222d",
                  fontSize: 14,
                }}
                prefix={icon}
              />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default Dashboard;
