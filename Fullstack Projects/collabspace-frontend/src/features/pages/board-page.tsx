import { PlusOutlined } from '@ant-design/icons';
import { App as AntApp, Button, Form, Input, Modal, Select, Space, Tag, Typography } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { EmptyState, ErrorState, PageLoader } from '../../components/common/feedback';
import { SectionHeader, TaskPreviewCard } from '../../components/common/ui';
import { getErrorMessage } from '../../services/api';
import { organizationService } from '../../services/organizations';
import { projectService } from '../../services/projects';
import { tagService } from '../../services/tags';
import { taskService } from '../../services/tasks';
import type { TaskStatus } from '../../types/api';
import type { BoardResponse, OrganizationMembership, Project, TagEntity, TaskEntity } from '../../types/entities';
import { getMemberOptions, getTagOptions, statusOptions, toLabel } from './shared';

export function BoardPage() {
  const { message } = AntApp.useApp();
  const navigate = useNavigate();
  const { projectId } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [board, setBoard] = useState<BoardResponse | null>(null);
  const [members, setMembers] = useState<OrganizationMembership[]>([]);
  const [tags, setTags] = useState<TagEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [dragTaskId, setDragTaskId] = useState<string | null>(null);
  const [dragOverStatus, setDragOverStatus] = useState<TaskStatus | null>(null);
  const [updatingTaskId, setUpdatingTaskId] = useState<string | null>(null);
  const [form] = Form.useForm();

  const loadBoard = useCallback(async () => {
    if (!projectId) return;
    setLoading(true);
    setError(null);
    try {
      const projectResult = await projectService.getById(projectId);
      const [boardResult, memberList, tagList] = await Promise.all([
        taskService.board(projectId),
        organizationService.listMembers(projectResult.organizationId as string),
        tagService.list(projectResult.organizationId as string),
      ]);
      setProject(projectResult);
      setBoard(boardResult);
      setMembers(memberList);
      setTags(tagList);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    void loadBoard();
  }, [loadBoard]);

  const createTask = async (values: {
    title?: string;
    description?: string;
    assignedUserId?: string | null;
    status?: TaskStatus;
    tagIds?: string[];
  }) => {
    if (!projectId) return;
    setSubmitting(true);
    try {
      await taskService.create(projectId, values);
      message.success('Task created');
      setOpen(false);
      form.resetFields();
      await loadBoard();
    } catch (error) {
      message.error(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  const moveTask = async (task: TaskEntity, nextStatus: TaskStatus) => {
    if (!task.id || !task.status || task.status === nextStatus) {
      setDragTaskId(null);
      setDragOverStatus(null);
      return;
    }

    setUpdatingTaskId(task.id);
    try {
      await taskService.update(task.id, { status: nextStatus });
      setBoard((currentBoard) => {
        if (!currentBoard) return currentBoard;

        const nextBoard = { ...currentBoard };
        nextBoard[task.status as TaskStatus] = (currentBoard[task.status as TaskStatus] ?? []).filter((item) => item.id !== task.id);
        nextBoard[nextStatus] = [...(currentBoard[nextStatus] ?? []), { ...task, status: nextStatus }];
        return nextBoard;
      });
      message.success(`Task moved to ${toLabel(nextStatus)}`);
    } catch (error) {
      message.error(getErrorMessage(error));
      await loadBoard();
    } finally {
      setUpdatingTaskId(null);
      setDragTaskId(null);
      setDragOverStatus(null);
    }
  };

  if (loading) return <PageLoader />;
  if (error) return <ErrorState title="Failed to load board" subtitle={error} />;
  if (!project || !board) return <EmptyState title="Board not available" description="Project board data could not be loaded." />;

  return (
    <Space orientation="vertical" size={24} className="w-full">
      <SectionHeader
        eyebrow="Task board"
        title={project.name ?? 'Project board'}
        description="Move tasks between stages and keep delivery on track."
        action={<Button type="primary" icon={<PlusOutlined />} onClick={() => setOpen(true)}>Create task</Button>}
      />
      <div className="grid gap-5 xl:grid-cols-3">
        {statusOptions.map((column) => (
          <div
            key={column}
            className={`soft-panel rounded-3xl p-4 transition ${dragOverStatus === column ? 'ring-2 ring-(--primary)' : ''}`}
            onDragOver={(event) => {
              event.preventDefault();
              setDragOverStatus(column);
            }}
            onDragLeave={() => setDragOverStatus((current) => (current === column ? null : current))}
            onDrop={(event) => {
              event.preventDefault();
              const droppedTaskId = event.dataTransfer.getData('text/plain');
              const droppedTask = Object.values(board).flat().find((item) => item.id === droppedTaskId);

              if (droppedTask) {
                void moveTask(droppedTask, column);
              }
            }}
          >
            <div className="mb-4 flex items-center justify-between">
              <Typography.Title level={4} className="mb-0! font-[Manrope]!">{toLabel(column)}</Typography.Title>
              <Tag>{board[column]?.length ?? 0}</Tag>
            </div>
            <div className="grid gap-4">
              {(board[column] ?? []).map((task) => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={(event) => {
                    event.dataTransfer.setData('text/plain', task.id);
                    setDragTaskId(task.id);
                  }}
                  onDragEnd={() => {
                    setDragTaskId(null);
                    setDragOverStatus(null);
                  }}
                  onClick={() => navigate(`/tasks/${task.id}`)}
                  className={`cursor-pointer transition ${dragTaskId === task.id ? 'opacity-60' : 'opacity-100'} ${updatingTaskId === task.id ? 'pointer-events-none' : ''}`}
                >
                  <TaskPreviewCard
                    title={task.title ?? 'Untitled task'}
                    description={task.description ?? 'No description'}
                    assignee={task.assignedUser?.name?.slice(0, 2).toUpperCase() ?? 'NA'}
                    tag={task.taskTags?.[0]?.tag?.name ?? toLabel(task.status ?? 'TODO')}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <Modal open={open} title="Create Task" footer={null} onCancel={() => setOpen(false)} width={640} forceRender>
        <Form form={form} layout="vertical" onFinish={createTask}>
          <Form.Item name="title" label="Title">
            <Input placeholder="Design login page" />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item name="status" label="Status">
            <Select options={statusOptions.map((status) => ({ label: toLabel(status), value: status }))} />
          </Form.Item>
          <Form.Item name="assignedUserId" label="Assigned User">
            <Select allowClear options={getMemberOptions(members)} />
          </Form.Item>
          <Form.Item name="tagIds" label="Tags">
            <Select mode="multiple" allowClear options={getTagOptions(tags)} />
          </Form.Item>
          <Space className="w-full justify-end">
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button htmlType="submit" type="primary" loading={submitting}>Create</Button>
          </Space>
        </Form>
      </Modal>
    </Space>
  );
}
