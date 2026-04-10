import {
  AppstoreOutlined,
  BulbOutlined,
  ClusterOutlined,
  FolderOpenOutlined,
  HomeOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
  TagsOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Menu, Select, Typography } from "antd";
import { useEffect, useMemo, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useColorMode } from "../../hooks/use-color-mode";
import { useAuth } from "../../hooks/use-auth";
import { projectService } from "../../services/projects";

function getSelectedKey(pathname: string) {
  if (pathname.startsWith("/organizations")) return "/organizations";
  if (pathname.startsWith("/board")) return "/board";
  if (pathname.startsWith("/projects"))
    return pathname.includes("/board") ? "/board" : "/projects";
  if (pathname.startsWith("/tasks")) return "/board";
  if (pathname.startsWith("/tags")) return "/tags";
  if (pathname.startsWith("/settings")) return "/settings";
  return "/dashboard";
}

export function AppShell() {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const {
    memberships,
    activeOrganizationId,
    setActiveOrganizationId,
    logout,
    user,
    activeMembership,
  } = useAuth();
  const { mode, toggleMode } = useColorMode();
  const selectedKey = getSelectedKey(location.pathname);
  const [boardAvailable, setBoardAvailable] = useState(false);

  const organizationOptions = memberships.map((membership) => ({
    label: membership.organization?.name,
    value: membership.organizationId,
  }));

  const activeOrganizationName = useMemo(
    () =>
      memberships.find(
        (membership) => membership.organizationId === activeOrganizationId,
      )?.organization?.name ?? "CollabSpace",
    [activeOrganizationId, memberships],
  );

  useEffect(() => {
    const loadBoardPath = async () => {
      if (!activeOrganizationId) {
        setBoardAvailable(false);
        return;
      }

      try {
        const projects = await projectService.list(activeOrganizationId);
        setBoardAvailable(projects.length > 0);
      } catch {
        setBoardAvailable(false);
      }
    };

    void loadBoardPath();
  }, [activeOrganizationId]);

  const menuItems = [
    {
      key: "/dashboard",
      icon: <HomeOutlined style={{ fontSize: 18 }} />,
      label: <Link to="/dashboard">Dashboard</Link>,
    },
    {
      key: "/organizations",
      icon: <TeamOutlined style={{ fontSize: 18 }} />,
      label: <Link to="/organizations">Organizations</Link>,
    },
    {
      key: "/projects",
      icon: <FolderOpenOutlined style={{ fontSize: 18 }} />,
      label: <Link to="/projects">Projects</Link>,
    },
    {
      key: "/board",
      icon: <AppstoreOutlined style={{ fontSize: 18 }} />,
      label: <Link to="/board">Board</Link>,
      disabled: !boardAvailable,
    },
    {
      key: "/tags",
      icon: <TagsOutlined style={{ fontSize: 18 }} />,
      label: <Link to="/tags">Tags</Link>,
    },
    {
      key: "/settings",
      icon: <SettingOutlined style={{ fontSize: 18 }} />,
      label: <Link to="/settings">Settings</Link>,
    },
  ];

  return (
    <div className="editorial-shell relative flex min-h-screen">
      <aside
        className={`sidebar-shell m-0 ${collapsed ? "sidebar-shell-collapsed w-26" : "w-70"} transition-[width] duration-200`}
      >
        <div
          className={`flex min-h-screen flex-col ${collapsed ? "items-center" : ""}`}
        >
          <div
            className={`mb-5 pt-3 ${collapsed ? "flex justify-center px-0" : "px-5"}`}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-13 w-13 items-center justify-center rounded-[20px] bg-(--surface-low) shadow-sm">
                <ClusterOutlined className="text-[28px]! text-(--primary)!" />
              </div>
              {!collapsed ? (
                <div className="min-w-0">
                  <Typography.Title
                    level={4}
                    className="mb-0! text-[21px]! font-[Manrope]! font-semibold! text-(--sidebar-ink)!"
                  >
                    CollabSpace
                  </Typography.Title>
                  <Typography.Text className="text-(--sidebar-muted)!">
                    Workspace control center
                  </Typography.Text>
                </div>
              ) : null}
            </div>
          </div>
          {!collapsed ? (
            <div className="mx-5 mb-5 rounded-[20px] sidebar-panel px-3 py-3">
              <Typography.Text className="mb-2! block! text-xs! font-semibold! uppercase! tracking-[0.18em]! text-(--sidebar-muted)!">
                Active organization
              </Typography.Text>
              <Select
                value={activeOrganizationId ?? undefined}
                options={organizationOptions}
                className="w-full"
                onChange={(val) => {
                  setActiveOrganizationId(val);
                  navigate('/dashboard');
                }}
              />
              <Typography.Text className="mt-3! block! text-sm! text-(--sidebar-ink)!">
                Role: {activeMembership?.role ?? "N/A"}
              </Typography.Text>
            </div>
          ) : null}
          <Menu
            mode="inline"
            selectedKeys={[selectedKey]}
            items={menuItems}
            className={`sidebar-menu border-0! bg-transparent! ${collapsed ? "sidebar-menu-collapsed px-0!" : "px-5!"}`}
          />
          <div
            className={`mt-auto pb-4 pt-6 ${collapsed ? "sidebar-actions-collapsed px-0" : "px-5"}`}
          >
            <Button
              icon={<BulbOutlined />}
              onClick={toggleMode}
              className={`sidebar-action mb-3! h-11! rounded-2xl! ${collapsed ? "w-14! px-0!" : "w-full! justify-start!"}`}
            >
              {!collapsed
                ? mode === "light"
                  ? "Dark mode"
                  : "Light mode"
                : null}
            </Button>
            {!collapsed ? (
              <div className="sidebar-panel mb-4 rounded-[20px] px-4 py-3 text-(--sidebar-ink)">
                <div className="mb-1 flex items-center gap-2 text-sm font-medium">
                  <UserOutlined />
                  <span className="truncate">{user?.name ?? "User"}</span>
                </div>
                <Typography.Text className="text-(--sidebar-muted)!">
                  {user?.email}
                </Typography.Text>
              </div>
            ) : null}
            <Button
              icon={<LogoutOutlined />}
              onClick={logout}
              className={`sidebar-action h-11! rounded-2xl! ${collapsed ? "w-14! px-0!" : "w-full!"}`}
            >
              {!collapsed ? "Logout" : null}
            </Button>
          </div>
        </div>
      </aside>
      <main className="flex min-h-screen w-0 flex-1 flex-col">
        <div className="shell-topbar mx-4 mt-3 flex rounded-3xl px-7 py-5">
          <Button
            className="shell-toggle mr-5! flex! h-11! w-11! shrink-0 self-center items-center! justify-center! rounded-2xl! border-0!"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed((value) => !value)}
          />
          <div className="flex-1">
            <Typography.Text className="text-xs! font-semibold! uppercase! tracking-[0.2em]! text-(--muted)!">
              Workspace
            </Typography.Text>
            <div className="mt-2 flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
              <Typography.Title
                level={2}
                className="mb-0! text-[28px]! font-[Manrope]! font-semibold! text-(--ink)!"
              >
                {activeOrganizationName}
              </Typography.Title>
              <Typography.Text className="text-(--muted)!">
                {memberships.length} organizations
              </Typography.Text>
            </div>
          </div>
        </div>
        <div className="flex-1 px-4 py-5">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
