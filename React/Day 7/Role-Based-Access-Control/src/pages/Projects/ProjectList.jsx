import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Space,
  Popconfirm,
  message,
  Typography,
  Modal,
  Form,
  Input,
  Select,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { hasPermission } from "../../utils/permissionHelpers";
import {
  getAllProjects,
  createProject,
  updateProject,
  deleteProject,
} from "../../services/projectService";

const { Title } = Typography;

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editProject, setEditProject] = useState(null);
  const [form] = Form.useForm();

  const permissions = useSelector((state) => state.permissions);
  const canAdd = hasPermission(permissions, "projects", "add");
  const canEdit = hasPermission(permissions, "projects", "edit");
  const canDelete = hasPermission(permissions, "projects", "delete");

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const data = await getAllProjects();
      setProjects(data);
    } catch {
      message.error("Failed to fetch projects");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchProjects();
  }, []);

  const handleAdd = () => {
    setEditProject(null);
    form.resetFields();
    setModalOpen(true);
  };

  const handleEdit = (project) => {
    setEditProject(project);
    form.setFieldsValue(project);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteProject(id);
      message.success("Project deleted!");
      fetchProjects();
    } catch {
      message.error("Failed to delete");
    }
  };
  const handleSubmit = async (values) => {
    try {
      if (editProject) {
        await updateProject(editProject.id, values);
        message.success("Project updated!");
      } else {
        await createProject(values);
        message.success("Project created!");
      }
      setModalOpen(false);
      form.resetFields();
      fetchProjects();
    } catch {
      message.error("Operation failed");
    }
  };

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Description", dataIndex: "description", key: "description" },
    { title: "Status", dataIndex: "status", key: "status" },
    { title: "Start Date", dataIndex: "startDate", key: "startDate" },
    { title: "End Date", dataIndex: "endDate", key: "endDate" },
    {
      title: "Actions",
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
              title="Delete this project?"
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
          Projects
        </Title>
        {canAdd && (
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            Add Project
          </Button>
        )}
      </div>
      <Table
        dataSource={projects}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={{
          defaultPageSize : 5,
          showSizeChanger: true,
          pageSizeOptions: ["7", "10", "12"],
        }}
      />

      <Modal
        title={editProject ? "Edit Project" : "Add Project"}
        open={modalOpen}
        onCancel={() => {
          setModalOpen(false);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        okText={editProject ? "Update" : "Create"}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Required" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item
            label="Status"
            name="status"
            rules={[{ required: true, message: "Required" }]}
          >
            <Select>
              <Select.Option value="Planning">Planning</Select.Option>
              <Select.Option value="In Progress">In Progress</Select.Option>
              <Select.Option value="Completed">Completed</Select.Option>
              <Select.Option value="On Hold">On Hold</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Start Date" name="startDate">
            <Input type="date" />
          </Form.Item>
          <Form.Item label="End Date" name="endDate">
            <Input type="date" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProjectList;
