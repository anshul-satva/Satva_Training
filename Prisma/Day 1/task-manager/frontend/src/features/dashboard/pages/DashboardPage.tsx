import { useEffect, useMemo, useState } from "react";
import { App, Button, Card, Col, List, Row, Statistic, Tag, Typography } from "antd";
import { Link, useNavigate } from "react-router-dom";
import {
  ClockCircleOutlined,
  FileTextOutlined,
  MessageOutlined,
  PlusOutlined,
  PaperClipOutlined,
  RightCircleOutlined,
  SmileOutlined,
} from "@ant-design/icons";
import { useAuth } from "../../../app/providers/AuthProvider";
import { getApiErrorMessage } from "../../../shared/utils/error";
import { fetchActivitySummary, fetchRecentTasks } from "../api/dashboard.api";
import type { ActivitySummary } from "../types/dashboard.types";
import type { TaskSummary } from "../../tasks/types/task.types";
import { fetchTasks } from "../../tasks/api/task.api";

export const DashboardPage = () => {
  const { message } = App.useApp();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [summary, setSummary] = useState<ActivitySummary | null>(null);
  const [recentTasks, setRecentTasks] = useState<TaskSummary[]>([]);
  const [allTasks, setAllTasks] = useState<TaskSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      setIsLoading(true);

      try {
        const [summaryResponse, recentTasksResponse] = await Promise.all([
          fetchActivitySummary(),
          fetchRecentTasks(),
        ]);
        const allTasksResponse = await fetchTasks({});

        setSummary(summaryResponse.data);
        setRecentTasks(recentTasksResponse.data);
        setAllTasks(allTasksResponse.data);
      } catch (err) {
        void message.error(getApiErrorMessage(err));
      } finally {
        setIsLoading(false);
      }
    };

    void loadDashboard();
  }, [message]);

  const dueSoonTasks = useMemo(
    () =>
      [...allTasks]
        .filter((task) => task.dueDate && task.status !== "DONE")
        .sort(
          (first, second) =>
            new Date(first.dueDate ?? "").getTime() - new Date(second.dueDate ?? "").getTime(),
        )
        .slice(0, 5),
    [allTasks],
  );

  return (
    <main className="dashboard-screen">
      <section className="container">
        <Card className="dashboard-hero dashboard-hero-compact mb-4" variant="borderless" loading={isLoading}>
          <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3">
            <div>
              <Typography.Text type="secondary">Dashboard</Typography.Text>
              <Typography.Title level={2} className="mb-1">
                {user?.name ? `Hi, ${user.name}` : "Task overview"}
              </Typography.Title>
              <Typography.Paragraph className="mb-0 text-body-secondary">
                See your recent tasks, overdue work, and overall activity at a glance.
              </Typography.Paragraph>
            </div>

            <div className="d-flex gap-2 flex-wrap">
              <Button
                type="primary"
                size="large"
                icon={<PlusOutlined />}
                onClick={() => navigate("/tasks", { state: { openCreate: true } })}
              >
                Add New Task
              </Button>
              <Button size="large" icon={<RightCircleOutlined />} onClick={() => navigate("/tasks")}>
                Open Tasks Board
              </Button>
            </div>
          </div>
        </Card>

        <Row gutter={[16, 16]} className="mb-4">
          <Col xs={24} sm={12} xl={6}>
            <Card className="dashboard-stat-card" variant="borderless">
              <Statistic title="Total Tasks" value={summary?.taskCount ?? 0} prefix={<FileTextOutlined />} />
            </Card>
          </Col>
          <Col xs={24} sm={12} xl={6}>
            <Card className="dashboard-stat-card" variant="borderless">
              <Statistic title="Overdue" value={summary?.overdueCount ?? 0} prefix={<ClockCircleOutlined />} />
            </Card>
          </Col>
          <Col xs={24} sm={12} xl={6}>
            <Card className="dashboard-stat-card" variant="borderless">
              <Statistic title="Comments" value={summary?.commentCount ?? 0} prefix={<MessageOutlined />} />
            </Card>
          </Col>
          <Col xs={24} sm={12} xl={6}>
            <Card className="dashboard-stat-card" variant="borderless">
              <Statistic
                title="Attachments + Reactions"
                value={(summary?.attachmentCount ?? 0) + (summary?.reactionCount ?? 0)}
                prefix={<PaperClipOutlined />}
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24} xl={12}>
            <Card className="task-table-card h-100" variant="borderless" loading={isLoading}>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <Typography.Title level={4} className="mb-0">
                  Recent Tasks
                </Typography.Title>
                <Link to="/tasks">View all</Link>
              </div>

              <List
                dataSource={recentTasks}
                locale={{ emptyText: "No recent tasks yet." }}
                renderItem={(task) => (
                  <List.Item className="px-0">
                    <List.Item.Meta
                      title={<span className="fw-semibold">{task.title}</span>}
                      description={task.description || "No description"}
                    />
                    <div className="d-flex gap-2 flex-wrap">
                      <Tag color={task.status === "DONE" ? "green" : task.status === "IN_PROGRESS" ? "blue" : "gold"}>
                        {task.status}
                      </Tag>
                      <Tag color={task.priority === "HIGH" ? "volcano" : task.priority === "MEDIUM" ? "gold" : "cyan"}>
                        {task.priority}
                      </Tag>
                      {task.attachmentCount ? (
                        <Tag color="purple">
                          <SmileOutlined className="me-1" />
                          {task.attachmentCount} attachments
                        </Tag>
                      ) : null}
                    </div>
                  </List.Item>
                )}
              />
            </Card>
          </Col>

          <Col xs={24} xl={12}>
            <Card className="task-table-card h-100" variant="borderless" loading={isLoading}>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <Typography.Title level={4} className="mb-0">
                  Close Deadlines
                </Typography.Title>
                <Tag color="orange">{dueSoonTasks.length}</Tag>
              </div>

              <List
                dataSource={dueSoonTasks}
                locale={{ emptyText: "No upcoming deadlines right now." }}
                renderItem={(task) => (
                  <List.Item className="px-0">
                    <List.Item.Meta
                      title={<span className="fw-semibold">{task.title}</span>}
                      description={task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No due date"}
                    />
                    <Tag color={task.priority === "HIGH" ? "volcano" : task.priority === "MEDIUM" ? "gold" : "cyan"}>
                      {task.priority}
                    </Tag>
                  </List.Item>
                )}
              />
            </Card>
          </Col>
        </Row>
      </section>
    </main>
  );
};
