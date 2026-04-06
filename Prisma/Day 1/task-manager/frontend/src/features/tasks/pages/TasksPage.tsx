import { useEffect, useMemo, useState } from "react";
import {
  App,
  Button,
  Card,
  Form,
  Input,
  Modal,
  Select,
  Space,
  Typography,
} from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import {
  PlusOutlined,
  ReloadOutlined,
  TagsOutlined,
  FolderAddOutlined,
} from "@ant-design/icons";
import { useAuth } from "../../../app/providers/AuthProvider";
import { getApiErrorMessage } from "../../../shared/utils/error";
import {
  createCategory,
  createTag,
  createTask,
  fetchCategories,
  fetchTags,
  fetchTaskById,
  fetchTasks,
  updateTask,
} from "../api/task.api";
import { TaskBoard } from "../components/board/TaskBoard";
import { TaskDetailModal } from "../components/TaskDetailModal";
import { TaskForm } from "../components/TaskForm";
import type {
  Category,
  Tag,
  TaskDetail,
  TaskFilters,
  TaskPriority,
  TaskStatus,
  TaskSummary,
  UpdateTaskPayload,
  CreateTaskPayload,
} from "../types/task.types";

const defaultFilters: TaskFilters = {
  status: "",
  priority: "",
  categoryId: "",
  tagId: "",
};

export const TasksPage = () => {
  const { message } = App.useApp();
  const [modal, contextHolder] = Modal.useModal();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [tasks, setTasks] = useState<TaskSummary[]>([]);
  const [filters, setFilters] = useState<TaskFilters>(defaultFilters);
  const [tags, setTags] = useState<Tag[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskDetail | null>(null);
  const [selectedTask, setSelectedTask] = useState<TaskDetail | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const [isMetaSubmitting, setIsMetaSubmitting] = useState(false);
  const [categoryForm] = Form.useForm<{ name: string }>();
  const [tagForm] = Form.useForm<{ name: string }>();

  const loadMeta = async () => {
    try {
      const [tagResponse, categoryResponse] = await Promise.all([
        fetchTags(),
        fetchCategories(),
      ]);

      setTags(tagResponse.data);
      setCategories(categoryResponse.data);
    } catch (err) {
      void message.error(getApiErrorMessage(err));
    }
  };

  const loadTasks = async (activeFilters: TaskFilters) => {
    setIsLoading(true);

    try {
      const response = await fetchTasks(activeFilters);
      setTasks(response.data);
    } catch (err) {
      void message.error(getApiErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadMeta();
  }, []);

  useEffect(() => {
    void loadTasks(filters);
  }, [filters.categoryId, filters.priority, filters.status, filters.tagId]);

  useEffect(() => {
    if ((location.state as { openCreate?: boolean } | null)?.openCreate) {
      handleOpenCreate();
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location.pathname, location.state, navigate]);

  const boardColumns = useMemo(
    () => [
      {
        key: "TODO" as TaskStatus,
        title: "To Do",
        tasks: tasks.filter((task) => task.status === "TODO"),
      },
      {
        key: "IN_PROGRESS" as TaskStatus,
        title: "In Progress",
        tasks: tasks.filter((task) => task.status === "IN_PROGRESS"),
      },
      {
        key: "DONE" as TaskStatus,
        title: "Done",
        tasks: tasks.filter((task) => task.status === "DONE"),
      },
    ],
    [tasks],
  );

  const handleOpenCreate = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleEditTask = (task: TaskDetail) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleOpenTask = async (taskId: string) => {
    try {
      const response = await fetchTaskById(taskId);
      setSelectedTask(response.data);
      setIsDetailOpen(true);
    } catch (err) {
      void message.error(getApiErrorMessage(err));
    }
  };

  const handleDropTask = async (taskId: string, status: TaskStatus) => {
    try {
      await updateTask(taskId, { status });
      void message.success(`Task moved to ${status}.`);
      await loadTasks(filters);
    } catch (err) {
      void message.error(getApiErrorMessage(err));
    }
  };

  const handleSubmitTask = async (
    payload: CreateTaskPayload | UpdateTaskPayload,
  ) => {
    setIsSubmitting(true);

    try {
      if (editingTask) {
        await updateTask(editingTask.id, payload as UpdateTaskPayload);
        void message.success("Task updated successfully.");
      } else {
        await createTask(payload as CreateTaskPayload);
        void message.success("Task created successfully.");
      }

      setIsModalOpen(false);
      setEditingTask(null);
      await loadTasks(filters);
    } catch (err) {
      void message.error(getApiErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateCategory = async () => {
    try {
      const values = await categoryForm.validateFields();
      setIsMetaSubmitting(true);
      await createCategory(values.name);
      categoryForm.resetFields();
      setIsCategoryModalOpen(false);
      void message.success("Category created successfully.");
      await loadMeta();
    } catch (err) {
      if (err instanceof Error && "errorFields" in err) {
        return;
      }
      void message.error(getApiErrorMessage(err));
    } finally {
      setIsMetaSubmitting(false);
    }
  };

  const handleCreateTag = async () => {
    try {
      const values = await tagForm.validateFields();
      setIsMetaSubmitting(true);
      await createTag(values.name);
      tagForm.resetFields();
      setIsTagModalOpen(false);
      void message.success("Tag created successfully.");
      await loadMeta();
    } catch (err) {
      if (err instanceof Error && "errorFields" in err) {
        return;
      }
      void message.error(getApiErrorMessage(err));
    } finally {
      setIsMetaSubmitting(false);
    }
  };

  return (
    <main className="dashboard-screen">
      <section className="container">
        {contextHolder}
        <div className="tasks-page-shell">
          <div className="tasks-page-sticky">
            <Card
              className="dashboard-hero dashboard-hero-compact mb-3"
              variant="borderless"
            >
              <div className="page-hero-layout">
                <div className="page-hero-copy">
                  <Typography.Text type="secondary">Tasks Board</Typography.Text>
                  <Typography.Title level={3} className="mb-0 task-page-title">
                    {user?.name ? `${user.name}'s tasks` : "My tasks"}
                  </Typography.Title>
                </div>

                <div className="page-hero-actions">
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    size="large"
                    onClick={handleOpenCreate}
                  >
                    Add New Task
                  </Button>
                  <Button
                    icon={<FolderAddOutlined />}
                    onClick={() => setIsCategoryModalOpen(true)}
                  >
                    New Category
                  </Button>
                  <Button
                    icon={<TagsOutlined />}
                    onClick={() => setIsTagModalOpen(true)}
                  >
                    New Tag
                  </Button>
                  <Button
                    icon={<ReloadOutlined />}
                    onClick={() => void loadTasks(filters)}
                  >
                    Refresh
                  </Button>
                </div>
              </div>
            </Card>

            <Card className="task-filter-card mb-3" variant="borderless">
              <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-2 mb-2">
                <Typography.Title level={5} className="mb-0 task-filter-title">
                  Filters
                </Typography.Title>
                <Typography.Text type="secondary">
                  {tasks.length} tasks
                </Typography.Text>
              </div>

              <div className="row g-3">
                <div className="col-md-3">
                  <Typography.Text strong>Status</Typography.Text>
                  <Select
                    className="w-100 mt-2"
                    size="large"
                    value={filters.status}
                    onChange={(value) =>
                      setFilters((current) => ({
                        ...current,
                        status: value as TaskStatus | "",
                      }))
                    }
                    options={[
                      { value: "", label: "All statuses" },
                      { value: "TODO", label: "To Do" },
                      { value: "IN_PROGRESS", label: "In Progress" },
                      { value: "DONE", label: "Done" },
                    ]}
                  />
                </div>
                <div className="col-md-3">
                  <Typography.Text strong>Priority</Typography.Text>
                  <Select
                    className="w-100 mt-2"
                    size="large"
                    value={filters.priority}
                    onChange={(value) =>
                      setFilters((current) => ({
                        ...current,
                        priority: value as TaskPriority | "",
                      }))
                    }
                    options={[
                      { value: "", label: "All priorities" },
                      { value: "LOW", label: "Low" },
                      { value: "MEDIUM", label: "Medium" },
                      { value: "HIGH", label: "High" },
                    ]}
                  />
                </div>
                <div className="col-md-3">
                  <Typography.Text strong>Category</Typography.Text>
                  <Select
                    className="w-100 mt-2"
                    size="large"
                    value={filters.categoryId}
                    onChange={(value) =>
                      setFilters((current) => ({
                        ...current,
                        categoryId: value as string,
                      }))
                    }
                    options={[
                      { value: "", label: "All categories" },
                      ...categories.map((category) => ({
                        value: category.id,
                        label: category.name,
                      })),
                    ]}
                  />
                </div>
                <div className="col-md-3">
                  <Typography.Text strong>Tag</Typography.Text>
                  <Select
                    className="w-100 mt-2"
                    size="large"
                    value={filters.tagId}
                    onChange={(value) =>
                      setFilters((current) => ({
                        ...current,
                        tagId: value as string,
                      }))
                    }
                    options={[
                      { value: "", label: "All tags" },
                      ...tags.map((tag) => ({ value: tag.id, label: tag.name })),
                    ]}
                  />
                </div>
              </div>
            </Card>
          </div>

          <div className="tasks-board-wrap">
            <TaskBoard
              columns={boardColumns}
              onDropTask={handleDropTask}
              onOpenTask={handleOpenTask}
            />
          </div>
        </div>

        <TaskForm
          open={isModalOpen}
          editingTask={editingTask}
          isSubmitting={isSubmitting}
          categories={categories}
          tags={tags}
          onCancelEdit={() => {
            setEditingTask(null);
            setIsModalOpen(false);
          }}
          onSubmit={handleSubmitTask}
        />

        <TaskDetailModal
          open={isDetailOpen}
          task={selectedTask}
          onClose={() => {
            setIsDetailOpen(false);
            setSelectedTask(null);
          }}
          onEdit={handleEditTask}
          onDeleted={(taskId) => {
            setTasks((current) => current.filter((task) => task.id !== taskId));
            setIsDetailOpen(false);
            setSelectedTask(null);
          }}
          onRefresh={async () => {
            if (selectedTask) {
              try {
                const response = await fetchTaskById(selectedTask.id);
                setSelectedTask(response.data);
              } catch {
                setSelectedTask(null);
                setIsDetailOpen(false);
              }
            }
            await loadTasks(filters);
          }}
        />

        <Modal
          open={isCategoryModalOpen}
          title="Create category"
          onCancel={() => setIsCategoryModalOpen(false)}
          onOk={() => void handleCreateCategory()}
          confirmLoading={isMetaSubmitting}
        >
          <Form form={categoryForm} layout="vertical">
            <Form.Item
              label="Category name"
              name="name"
              rules={[{ required: true, message: "Category name is required" }]}
            >
              <Input placeholder="Personal, Work, Study..." />
            </Form.Item>
          </Form>
        </Modal>

        <Modal
          open={isTagModalOpen}
          title="Create tag"
          onCancel={() => setIsTagModalOpen(false)}
          onOk={() => void handleCreateTag()}
          confirmLoading={isMetaSubmitting}
        >
          <Form form={tagForm} layout="vertical">
            <Form.Item
              label="Tag name"
              name="name"
              rules={[{ required: true, message: "Tag name is required" }]}
            >
              <Input placeholder="urgent, prisma, frontend..." />
            </Form.Item>
          </Form>
        </Modal>
      </section>
    </main>
  );
};
