import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Table, Button, Popconfirm, Tag } from "antd";
import { deleteUser } from "../store/usersSlice";

const UserTable = () => {
  const users = useSelector((state) => state.users);
  const dispatch = useDispatch();

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    { title: "Role", dataIndex: "role", key: "role" },
    {
      title: "Department",
      dataIndex: "department",
      key: "department",
      filters: [
        { text: "Management", value: "Management" },
        { text: "Tech", value: "Tech" },
        { text: "Creative", value: "Creative" },
        { text: "HR", value: "HR" },
        { text: "Sales", value: "Sales" },
        { text: "Finance", value: "Finance" },
      ],
      onFilter: (value, record) => record.department === value,
    },
    {
      title: "City",
      dataIndex: "city",
      key: "city",
      filters: [
        { text: "Ahmedabad", value: "Ahmedabad" },
        { text: "Surat", value: "Surat" },
        { text: "Mumbai", value: "Mumbai" },
        { text: "Delhi", value: "Delhi" },
        { text: "Pune", value: "Pune" },
        { text: "Rajkot", value: "Rajkot" },
        { text: "Vadodara", value: "Vadodara" },
        { text: "Kolkata", value: "Kolkata" },
      ],
      onFilter: (value, record) => record.city === value,
    },
    {
      title: "Status",
      dataIndex: "status",
      align: "center",
      key: "status",
      render: (status) => (
        <Tag color={status === "Active" ? "green" : "red"}>{status}</Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Popconfirm
          title="Are you sure?
            "
          onConfirm={() => dispatch(deleteUser(record.id))}
          okText="Yes"
          cancelText="No"
        >
          <Button danger>Delete</Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <Table
        dataSource={users}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 4 }}
      />
    </div>
  );
};

export default UserTable;
