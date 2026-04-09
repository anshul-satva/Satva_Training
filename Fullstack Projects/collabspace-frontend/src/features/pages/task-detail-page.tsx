import { DeleteOutlined, EditOutlined, MoreOutlined } from '@ant-design/icons';
import { App as AntApp, Button, Card, Dropdown, Form, Input, Modal, Progress, Select, Space, Tabs, Tag, Typography } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { EmptyState, ErrorState, PageLoader } from '../../components/common/feedback';
import { SectionHeader, StatusBadge } from '../../components/common/ui';
import { getErrorMessage } from '../../services/api';
import { organizationService } from '../../services/organizations';
import { tagService } from '../../services/tags';
import { taskService } from '../../services/tasks';
import type { TaskStatus } from '../../types/api';
import type {
  ActivityEntity,
  AssignmentHistoryEntity,
  CommentEntity,
  OrganizationMembership,
  TagEntity,
  TaskEntity,
} from '../../types/entities';
import { getMemberOptions, getTagOptions, statusOptions, toLabel } from './shared';

export function TaskDetailPage() {
  const { message } = AntApp.useApp();
  const { taskId } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState<TaskEntity | null>(null);
  const [comments, setComments] = useState<CommentEntity[]>([]);
  const [activities, setActivities] = useState<ActivityEntity[]>([]);
  const [history, setHistory] = useState<AssignmentHistoryEntity[]>([]);
  const [members, setMembers] = useState<OrganizationMembership[]>([]);
  const [tags, setTags] = useState<TagEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [commentSaving, setCommentSaving] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [updateForm] = Form.useForm();
  const [commentForm] = Form.useForm();

  const formatDate = (value?: string) => (value ? new Date(value).toLocaleString() : 'Just now');

  const loadTaskDetail = useCallback(async () => {
    if (!taskId) return;
    setLoading(true);
    setError(null);
    try {
      const taskResult = await taskService.getById(taskId);
      const [commentList, activityList, historyList, memberList, tagList] = await Promise.all([
        taskService.comments(taskId),
        taskService.activities(taskId),
        taskService.assignmentHistory(taskId),
        organizationService.listMembers(taskResult.organizationId as string),
        tagService.list(taskResult.organizationId as string),
      ]);
      setTask(taskResult);
      setComments(commentList);
      setActivities(activityList);
      setHistory(historyList);
      setMembers(memberList);
      setTags(tagList);
      updateForm.setFieldsValue({
        title: taskResult.title,
        description: taskResult.description,
        status: taskResult.status,
        assignedUserId: taskResult.assignedUserId ?? undefined,
        tagIds: taskResult.taskTags?.map((item) => item.tag?.id).filter(Boolean) ?? [],
      });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [taskId, updateForm]);

  useEffect(() => {
    void loadTaskDetail();
  }, [loadTaskDetail]);

  const saveTask = async (values: {
    title?: string;
    description?: string;
    status?: TaskStatus;
    assignedUserId?: string | null;
    tagIds?: string[];
  }) => {
    if (!taskId) return;
    setSaving(true);
    try {
      await taskService.update(taskId, values);
      message.success('Task updated');
      setEditOpen(false);
      await loadTaskDetail();
    } catch (error) {
      message.error(getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  const addComment = async (values: { content: string }) => {
    if (!taskId) return;
    setCommentSaving(true);
    try {
      await taskService.addComment(taskId, values);
      message.success('Comment added');
      commentForm.resetFields();
      await loadTaskDetail();
    } catch (error) {
      message.error(getErrorMessage(error));
    } finally {
      setCommentSaving(false);
    }
  };

  const archiveTask = async () => {
    if (!taskId) return;
    try {
      await taskService.archive(taskId);
      message.success('Task archived');
      navigate(`/projects/${task?.projectId}/board`);
    } catch (error) {
      message.error(getErrorMessage(error));
    }
  };

  const handleAction = (action: 'edit' | 'delete') => {
    if (!task) return;

    if (action === 'edit') {
      updateForm.setFieldsValue({
        title: task.title,
        description: task.description,
        status: task.status,
        assignedUserId: task.assignedUserId ?? undefined,
        tagIds: task.taskTags?.map((item) => item.tag?.id).filter(Boolean) ?? [],
      });
      setEditOpen(true);
      return;
    }

    void Modal.confirm({
      title: 'Delete this task?',
      content: 'This will archive the task and remove it from active work lists.',
      okText: 'Delete',
      okButtonProps: { danger: true },
      onOk: archiveTask,
    });
  };

  if (loading) return <PageLoader />;
  if (error) return <ErrorState title="Failed to load task detail" subtitle={error} />;
  if (!task) return <EmptyState title="Task not found" description="The task detail could not be loaded." />;

  return (
    <Space orientation="vertical" size={24} className="w-full">
      <SectionHeader
        eyebrow="Task detail"
        title={task.title ?? 'Task'}
        description="Complete task information, timeline, and collaboration history."
        action={
          <Dropdown
            menu={{
              items: [
                { key: 'edit', icon: <EditOutlined />, label: 'Edit task' },
                { key: 'delete', icon: <DeleteOutlined />, label: 'Delete task', danger: true },
              ],
              onClick: ({ key }) => handleAction(key as 'edit' | 'delete'),
            }}
            trigger={['click']}
          >
            <Button icon={<MoreOutlined />} />
          </Dropdown>
        }
      />
      <Card className="content-card border-0!">
        <Space orientation="vertical" size={14} className="w-full">
          <div className="flex flex-wrap items-center gap-2">
            {task.status ? <StatusBadge status={task.status} /> : null}
            <Tag color={task.archivedAt ? 'default' : 'processing'}>{task.archivedAt ? 'Archived' : 'Active'}</Tag>
          </div>
          <Typography.Paragraph className="mb-0! whitespace-pre-wrap text-slate-600!">
            {task.description ?? 'No description'}
          </Typography.Paragraph>
          <Progress percent={task.status === 'DONE' ? 100 : task.status === 'IN_PROGRESS' ? 55 : 15} strokeColor="#00685f" />
          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200/70 px-4 py-3">
              <Typography.Text className="text-xs! uppercase! tracking-wide! text-slate-500!">Assignee</Typography.Text>
              <Typography.Paragraph className="mb-0! mt-1!">{task.assignedUser?.name ?? task.assignedUser?.email ?? 'Unassigned'}</Typography.Paragraph>
            </div>
            <div className="rounded-2xl border border-slate-200/70 px-4 py-3">
              <Typography.Text className="text-xs! uppercase! tracking-wide! text-slate-500!">Created By</Typography.Text>
              <Typography.Paragraph className="mb-0! mt-1!">{task.createdBy?.name ?? task.createdBy?.email ?? 'Unknown'}</Typography.Paragraph>
            </div>
            <div className="rounded-2xl border border-slate-200/70 px-4 py-3">
              <Typography.Text className="text-xs! uppercase! tracking-wide! text-slate-500!">Created At</Typography.Text>
              <Typography.Paragraph className="mb-0! mt-1!">{formatDate(task.createdAt)}</Typography.Paragraph>
            </div>
            <div className="rounded-2xl border border-slate-200/70 px-4 py-3">
              <Typography.Text className="text-xs! uppercase! tracking-wide! text-slate-500!">Last Updated</Typography.Text>
              <Typography.Paragraph className="mb-0! mt-1!">{formatDate(task.updatedAt)}</Typography.Paragraph>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {task.taskTags?.length ? (
              task.taskTags.map((item) => (
                <Tag key={item.tag?.id} color={item.tag?.color ?? 'cyan'}>{item.tag?.name ?? 'Tag'}</Tag>
              ))
            ) : (
              <Tag>No tags</Tag>
            )}
          </div>
        </Space>
      </Card>
      <Card className="content-card border-0!">
        <Tabs
          items={[
            {
              key: 'comments',
              label: `Comments (${comments.length})`,
              children: (
                <Space orientation="vertical" size={16} className="w-full">
                  <Form form={commentForm} layout="vertical" onFinish={addComment}>
                    <Form.Item name="content" label="Add Comment" rules={[{ required: true }]}>
                      <Input.TextArea rows={3} placeholder="Write a task comment" />
                    </Form.Item>
                    <Button htmlType="submit" type="primary" loading={commentSaving}>Post comment</Button>
                  </Form>
                  <div className="grid gap-3">
                    {comments.map((item) => (
                      <div key={item.id} className="rounded-[20px] border border-slate-200/70 px-4 py-3">
                        <Typography.Text className="block! font-medium!">
                          {item.user?.name ?? item.user?.email ?? 'Member'} | {formatDate(item.createdAt)}
                        </Typography.Text>
                        <Typography.Paragraph className="mb-0! mt-1! text-slate-500!">{item.content}</Typography.Paragraph>
                      </div>
                    ))}
                  </div>
                </Space>
              ),
            },
            {
              key: 'activity',
              label: `Activity (${activities.length})`,
              children: (
                <div className="grid gap-3">
                  {activities.map((item) => (
                    <div key={item.id} className="rounded-[20px] border border-slate-200/70 px-4 py-3">
                      <Typography.Text className="block! font-medium!">
                        {item.action ?? 'Updated'} | {formatDate(item.createdAt)}
                      </Typography.Text>
                      <Typography.Text className="text-slate-500!">
                        {item.user?.name ?? item.user?.email ?? 'User'} changed {item.previousStatus ?? 'N/A'} to {item.newStatus ?? 'N/A'}
                      </Typography.Text>
                    </div>
                  ))}
                </div>
              ),
            },
            {
              key: 'history',
              label: `Assignment History (${history.length})`,
              children: (
                <div className="grid gap-3">
                  {history.map((item) => (
                    <div key={item.id} className="rounded-[20px] border border-slate-200/70 px-4 py-3">
                      <Typography.Text className="block! font-medium!">
                        {item.previousAssignedUser?.name ?? 'Unassigned'} to {item.newAssignedUser?.name ?? 'Unassigned'}
                      </Typography.Text>
                      <Typography.Text className="text-slate-500!">
                        Changed by {item.changedBy?.name ?? item.changedBy?.email ?? 'User'} | {formatDate(item.changedAt)}
                      </Typography.Text>
                    </div>
                  ))}
                </div>
              ),
            },
          ]}
        />
      </Card>
      <Modal open={editOpen} title="Edit task" footer={null} onCancel={() => setEditOpen(false)} width={680} forceRender>
        <Form form={updateForm} layout="vertical" onFinish={saveTask}>
          <Form.Item name="title" label="Title">
            <Input />
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
            <Button onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button htmlType="submit" type="primary" loading={saving}>Save changes</Button>
          </Space>
        </Form>
      </Modal>
    </Space>
  );
}
