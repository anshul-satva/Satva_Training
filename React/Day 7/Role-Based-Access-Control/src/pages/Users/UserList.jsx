import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Input,
  Space,
  Tag,
  Popconfirm,
  message,
  Typography,
  Drawer,
  Form,
  Select,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import { hasPermission } from "../../utils/permissionHelpers";
import {
  getAllUsers,
  searchUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../../services/userService";
import { getAllRoles } from "../../services/roleService";
import bcrypt from "bcryptjs";

const { Title } = Typography;

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [form] = Form.useForm();

  const permissions = useSelector((state) => state.permissions);
  const currentUser = useSelector((state) => state.auth.user);
  const canAdd = hasPermission(permissions, "users", "add");
  const canEdit = hasPermission(permissions, "users", "edit");
  const canDelete = hasPermission(permissions, "users", "delete");

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch {
      message.error("failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const data = await getAllRoles();
      setRoles(data);
    } catch {
      message.error("Failed to fetch roles");
    }
  };

  const handleSearch = async (value) => {
    if (!value.trim()) {
      fetchUsers();
      return;
    }
    try {
      const data = await searchUsers(value);
      setUsers(data);
    } catch {
      message.error("Search failed");
    }
  };

  const handleAdd = () => {
    setEditUser(null);
    form.resetFields();
    setDrawerOpen(true);
  };

  const handleEdit = (user) => {
    if (user.id === currentUser.id) {
      message.warning("You cannot edit yourself!");
      return;
    }
    setEditUser(user);
    form.setFieldsValue({ name: user.name });
    setDrawerOpen(true);
  };

  const handleDelete = async (user) => {
    if (user.id === currentUser.id) {
      message.warning("You cannot delete yourself!");
      return;
    }
    try {
      await deleteUser(user.id);
      message.success("User deleted!");
      fetchUsers();
    } catch {
      message.error("Failed to delete user");
    }
  };

  const handleDrawerSubmit = async (values) => {
    try {
      if (editUser) {
        await updateUser(editUser.id, values.name);
        message.success("User updated!");
      } else {
        const hashedPassword = await bcrypt.hash(values.password, 10);
        await createUser({
          name: values.name,
          email: values.email,
          password: hashedPassword,
          roleId: values.roleId,
        });
        message.success("User created!");
      }
      setDrawerOpen(false);
      form.resetFields();
      fetchUsers();
    } catch {
      message.error("Operation failed");
    }
  };

  const getRoleName = (roleId) => {
    const role = roles.find((r) => r.id === roleId);
    return role ? role.name : "Unknown";
  };

  const roleColors = {
    Admin: "red",
    HR: "blue",
    Supervisor: "orange",
    Manager: "green",
  };

  const columns = [
    {
      title: "name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      dataIndex: "roleId",
      key: "role",
      render: (roleId) => {
        const roleName = getRoleName(roleId);
        return <Tag color={roleColors[roleName]}>{roleName}</Tag>;
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          {canEdit && (
            <Button
              icon={<EditOutlined />}
              size="small"
              onClick={() => handleEdit(record)}
              disabled={record.id === currentUser.id}
            >
              Edit
            </Button>
          )}

          {canDelete && (
            <Popconfirm
              title="Are you sure you want to delete this user?"
              onConfirm={() => handleDelete(record)}
              okText="Yes"
              cancelText="No"
              disabled={record.id === currentUser.id}
            >
              <Button
                icon={<DeleteOutlined />}
                size="small"
                danger
                disabled={record.id === currentUser.id}
              >
                Delete
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <Title level={4} style={{ margin: 0 }}>
          Users
        </Title>

        {canAdd && (
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            Add User
          </Button>
        )}
      </div>

      <Input.Search
        placeholder="Search by name..."
        allowClear
        prefix={<SearchOutlined />}
        onSearch={handleSearch}
        onChange={(e) => {
          if (!e.target.value) fetchUsers();
        }}
        style={{ marginBottom: 16, width: 300 }}
      />

      <Table
        columns={columns}
        dataSource={users}
        rowKey="id"
        loading={loading}
      />
      <Drawer
        title={editUser ? "Edit User" : "Add User"}
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          form.resetFields();
        }}
        width={400}
        footer={
          <Button type="primary" onClick={() => form.submit()} block>
            {editUser ? "Update" : "Create"}
          </Button>
        }
      >
        <Form form={form} layout="vertical" onFinish={handleDrawerSubmit}>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please enter name" }]}
          >
            <Input placeholder="Enter name" />
          </Form.Item>

          {!editUser && (
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Please enter email" },
                { type: "email", message: "Invalid email" },
              ]}
            >
              <Input placeholder="Enter email" />
            </Form.Item>
          )}

          {!editUser && (
            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: "Please enter password" }]}
            >
              <Input.Password placeholder="Enter password" />
            </Form.Item>
          )}

          {!editUser && (
            <Form.Item
              label="Role"
              name="roleId"
              rules={[{ required: true, message: "Please select role" }]}
            >
              <Select placeholder="Select role">
                {roles.map((role) => (
                  <Select.Option key={role.id} value={role.id}>
                    {role.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          )}
        </Form>
      </Drawer>
    </div>
  );
};

export default UserList;
