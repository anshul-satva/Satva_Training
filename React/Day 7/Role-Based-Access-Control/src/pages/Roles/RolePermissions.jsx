import React, { useEffect, useState } from "react";
import { Table, Checkbox, Typography, message, Tag } from "antd";
import { useSelector } from "react-redux";
import { hasPermission } from "../../utils/permissionHelpers";
import {
  getAllPermissions,
  updatePermission,
} from "../../services/permissionService";

const { Title } = Typography;
const ACTION_IDS = { view: 1, add: 2, edit: 3, delete: 4 };
const ACTIONS = ["view", "add", "edit", "delete"];

const roleColors = {
  Admin: "red",
  HR: "blue",
  Supervisor: "orange",
  Manager: "green",
};

const RolePermissions = () => {
  const [allPermissions, setAllPermissions] = useState([]);
  const [loading, setLoading] = useState(false);

  const permissions = useSelector((state) => state.permissions);
  const canEdit = hasPermission(permissions, "roles", "edit");

  const fetchPermissions = async () => {
    setLoading(true);
    try {
      const data = await getAllPermissions();
      setAllPermissions(data);
    } catch {
      message.error("Failed to fetch permissions");
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (permRecord, moduleName, action) => {
    if (!canEdit) return;

    const actionId = ACTION_IDS[action];

    const updatedModulePermissions = permRecord.modulePermissions.map((m) => {
      if (m.moduleName !== moduleName) return m;

      const hasIt = m.allowedActionIds.includes(actionId);

      return {
        ...m,
        allowedActionIds: hasIt
          ? m.allowedActionIds.filter((id) => id !== actionId)
          : [...m.allowedActionIds, actionId],
      };
    });
    try {
      await updatePermission(permRecord.id, updatedModulePermissions);
      message.success(`Permission updated!`);
      fetchPermissions();
    } catch {
      message.error("Failed to update permission");
    }
  };

  const checkPermission = (permRecord, moduleName, action) => {
    const moduleEntry = permRecord.modulePermissions?.find(
      (m) => m.moduleName === moduleName,
    );
    if (!moduleEntry) return false;
    return moduleEntry.allowedActionIds.includes(ACTION_IDS[action]);
  };

  const columns = [
    {
      title: "Role",
      dataIndex: "roleName",
      key: "roleName",
      render: (name) => <Tag color={roleColors[name]}>{name}</Tag>,
    },
    ...["users", "employees", "projects", "roles"].flatMap((moduleName) =>
      ACTIONS.map((action) => ({
        title: (
          <div style={{ textAlign: "center", fontSize: 11 }}>
            <div style={{ fontWeight: "bold", textTransform: "capitalize" }}>
              {moduleName}
            </div>
            <div style={{ color: "#888", textTransform: "capitalize" }}>
              {action}
            </div>
          </div>
        ),
        key: `${moduleName}_${action}`,
        align: "center",
        render: (_, record) => (
          <Checkbox
            size="small"
            checked={checkPermission(record, moduleName, action)}
            onChange={() => handleToggle(record, moduleName, action)}
            disabled={!canEdit}
          />
        ),
      })),
    ),
  ];

  useEffect(() => {
    fetchPermissions();
  }, []);
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
          Role Permissions
        </Title>
        {!canEdit && (
          <Tag color="orange">View Only — Only Admin can edit permissions</Tag>
        )}
      </div>

      <Table
        columns={columns}
        dataSource={allPermissions}
        rowKey="id"
        loading={loading}
        scroll={{ x: true }}
        pagination={false}
      />
    </div>
  );
};

export default RolePermissions;
