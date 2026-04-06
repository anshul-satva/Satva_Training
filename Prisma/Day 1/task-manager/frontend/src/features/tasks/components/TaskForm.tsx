import { useEffect } from "react";
import { Button, Form, Input, Modal, Select } from "antd";
import type {
  Category,
  CreateTaskPayload,
  Tag,
  TaskDetail,
  TaskPriority,
  TaskStatus,
  UpdateTaskPayload,
} from "../types/task.types";

interface TaskFormValues {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  categoryId?: string;
  tagIds: string[];
}

interface TaskFormProps {
  open: boolean;
  editingTask: TaskDetail | null;
  isSubmitting: boolean;
  categories: Category[];
  tags: Tag[];
  onCancelEdit: () => void;
  onSubmit: (payload: CreateTaskPayload | UpdateTaskPayload) => Promise<void>;
}

export const TaskForm = ({
  open,
  editingTask,
  isSubmitting,
  categories,
  tags,
  onCancelEdit,
  onSubmit,
}: TaskFormProps) => {
  const [form] = Form.useForm<TaskFormValues>();

  useEffect(() => {
    if (!open) {
      return;
    }

    if (editingTask) {
      form.setFieldsValue({
        title: editingTask.title,
        description: editingTask.description || "",
        status: editingTask.status,
        priority: editingTask.priority,
        dueDate: editingTask.dueDate ? editingTask.dueDate.slice(0, 10) : "",
        categoryId: editingTask.categoryId || undefined,
        tagIds: editingTask.tags.map((taskTag) => taskTag.tagId),
      });
      return;
    }

    form.setFieldsValue({
      title: "",
      description: "",
      status: "TODO",
      priority: "MEDIUM",
      dueDate: "",
      categoryId: undefined,
      tagIds: [],
    });
  }, [editingTask, form, open]);

  const handleSubmit = async (values: TaskFormValues) => {
    await onSubmit({
      title: values.title,
      description: values.description || undefined,
      status: values.status,
      priority: values.priority,
      dueDate: values.dueDate || undefined,
      categoryId: values.categoryId || undefined,
      tagIds: values.tagIds,
    });
  };

  return (
    <Modal
      open={open}
      title={editingTask ? "Edit task" : "Add new todo"}
      onCancel={onCancelEdit}
      footer={null}
      centered
      width={720}
      destroyOnHidden
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit} requiredMark={false}>
        <Form.Item label="Title" name="title" rules={[{ required: true, message: "Title is required" }]}>
          <Input size="large" placeholder="Finish Prisma project" />
        </Form.Item>

        <Form.Item label="Description" name="description">
          <Input.TextArea rows={4} placeholder="Add context for the task" />
        </Form.Item>

        <div className="row">
          <div className="col-md-6">
            <Form.Item label="Status" name="status">
              <Select
                size="large"
                options={[
                  { value: "TODO", label: "To Do" },
                  { value: "IN_PROGRESS", label: "In Progress" },
                  { value: "DONE", label: "Done" },
                ]}
              />
            </Form.Item>
          </div>

          <div className="col-md-6">
            <Form.Item label="Priority" name="priority">
              <Select
                size="large"
                options={[
                  { value: "LOW", label: "Low" },
                  { value: "MEDIUM", label: "Medium" },
                  { value: "HIGH", label: "High" },
                ]}
              />
            </Form.Item>
          </div>
        </div>

        <Form.Item label="Due date" name="dueDate">
          <Input size="large" type="date" />
        </Form.Item>

        <div className="row">
          <div className="col-md-6">
            <Form.Item label="Category" name="categoryId">
              <Select
                allowClear
                size="large"
                placeholder="Select category"
                options={categories.map((category) => ({
                  value: category.id,
                  label: category.name,
                }))}
              />
            </Form.Item>
          </div>

          <div className="col-md-6">
            <Form.Item label="Tags" name="tagIds">
              <Select
                mode="multiple"
                allowClear
                size="large"
                placeholder="Assign tags"
                options={tags.map((tag) => ({
                  value: tag.id,
                  label: tag.name,
                }))}
              />
            </Form.Item>
          </div>
        </div>

        <div className="d-flex justify-content-end gap-2 mt-3">
          <Button onClick={onCancelEdit}>Cancel</Button>
          <Button type="primary" htmlType="submit" loading={isSubmitting}>
            {editingTask ? "Save changes" : "Create task"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};
