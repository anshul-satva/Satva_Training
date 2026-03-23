import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Table, Button, message, Tag, Popconfirm } from "antd";
import { deleteProduct } from "../store/inventorySlice";

const Inventory = () => {
  const dispatch = useDispatch();
  const inventory = useSelector((state) => state.inventory.products);
  
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 60,
      align: "center",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Name",
      dataIndex: "name",
      width: 200,
      key: "name",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      width: 120,
      render: (price) => <Tag color="blue">${price}</Tag>,
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      width: 120,
      render: (qty) => <Tag color={qty > 10 ? "green" : "red"}> ${qty} </Tag>,
    },
    {
      title: "Action",
      key: "action",
      width: 100,
      render: (_, record) => (
        <Popconfirm
          title="Are you sure to delete this product?"
          onConfirm={() => handleDelete(record.id)}
          onCancel={() => message.info("Cancled")}
          okText="Yes"
          cancelText="No"
        >
          <Button danger>Delete</Button>
        </Popconfirm>
      ),
    },
  ];

  const handleDelete = (id) => {
    dispatch(deleteProduct(id));
    message.success("Product Deleted Successfully");
  };

  return (
    <div>
      <Table
        dataSource={inventory}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

export default Inventory;
