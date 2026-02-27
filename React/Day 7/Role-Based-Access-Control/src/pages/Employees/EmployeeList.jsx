import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Input,
  Space,
  Popconfirm,
  message,
  Typography,
  Modal,
  Form,
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
  getAllEmployees,
  searchEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from "../../services/employeeService";

const { Title } = Typography;

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editEmployee, setEditEmployee] = useState(null);
  const [form] = Form.useForm();

  const permissions = useSelector((state) => state.permissions);
  const canAdd = hasPermission(permissions, "employees", "add");
  const canEdit = hasPermission(permissions, "employees", "edit");
  const canDelete = hasPermission(permissions, "employees", "delete");

  const fetchEmployees = async () => {
  setLoading(true)
  try {
    const data = await getAllEmployees()
    setEmployees(data)
  } catch (err) {
    console.log('Fetch error:', err)                   
    console.log('Error response:', err.response?.data)
    console.log('Error status:', err.response?.status)
    message.error("Failed to fetch employees")
  } finally {
    setLoading(false)
  }
}

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleSearch = async (value) => {
    if (!value.trim()) {
      fetchEmployees();
      return;
    }
    try {
      const data = await searchEmployees(value);
      setEmployees(data);
    } catch {
      message.error("Search failed");
    }
  };

  const handleAdd = () => {
    setEditEmployee(null);
    form.resetFields();
    setModalOpen(true);
  };

  const handleEdit = (emp) => {
    setEditEmployee(emp);
    form.setFieldsValue(emp);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteEmployee(id);
      message.success("Employee deleted!");
      fetchEmployees();
    } catch {
      message.error("Failed to delete");
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (editEmployee) {
        await updateEmployee(editEmployee.id, values);
        message.success("Employee updated!");
      } else {
        await createEmployee(values);
        message.success("Employee created!");
      }
      setModalOpen(false);
      form.resetFields();
      fetchEmployees();
    } catch {
      message.error("Operation failed");
    }
  };

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Department", dataIndex: "department", key: "department" },
    { title: "Position", dataIndex: "position", key: "position" },
    { title: "Phone", dataIndex: "phone", key: "phone" },
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
            >
              Edit
            </Button>
          )}
          {canDelete && (
            <Popconfirm
              title="Delete this employee?"
              onConfirm={() => handleDelete(record.id)}
              okText="Yes"
              cancelText="No"
            >
              <Button icon={<DeleteOutlined />} size="small" danger>
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
          marginBottom: 16,
        }}
      >
        <Title level={4} style={{ margin: 0 }}>
          Employees
        </Title>
        {canAdd && (
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            Add Employee
          </Button>
        )}
      </div>
      <Input.Search
        placeholder="Search by name"
        allowClear
        prefix={<SearchOutlined />}
        onSearch={handleSearch}
        onChange={(e) => {
          if (!e.target.value) fetchEmployees();
        }}
      />
      <Table
        columns={columns}
        dataSource={employees}
        rowKey="id"
        loading={loading}
        pagination={{
          defaultPageSize : 5,
          showSizeChanger: true,
          pageSizeOptions: ["7", "10", "12"],
        }}
      />

      <Modal
        title={editEmployee ? "Edit Employee" : "Add Employee"}
        open={modalOpen}
        onCancel={() => {
          setModalOpen(false);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        okText={editEmployee ? "Update" : "Create"}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Required" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                type: "email",
                message: "Valid email required",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Department"
            name="department"
            rules={[{ required: true, message: "Required" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Position"
            name="position"
            rules={[{ required: true, message: "Required" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Phone" name="phone">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default EmployeeList;
