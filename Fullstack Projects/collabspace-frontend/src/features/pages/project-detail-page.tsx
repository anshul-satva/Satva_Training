import { FolderOpenOutlined } from '@ant-design/icons';
import { Button, Card, Col, Empty, Row, Space, Tabs, Tag, Typography } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { EmptyState, ErrorState, PageLoader } from '../../components/common/feedback';
import { SectionHeader, StatCard, StatusBadge } from '../../components/common/ui';
import { getErrorMessage } from '../../services/api';
import { projectService } from '../../services/projects';
import { taskService } from '../../services/tasks';
import type { Project, TaskEntity } from '../../types/entities';

export function ProjectDetailPage() {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<TaskEntity[]>([]);

  const loadProject = useCallback(async () => {
    if (!projectId) return;
    setLoading(true);
    setError(null);
    try {
      const [projectResult, taskList] = await Promise.all([
        projectService.getById(projectId),
        taskService.list(projectId, true),
      ]);
      setProject(projectResult);
      setTasks(taskList);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    void loadProject();
  }, [loadProject]);

  const activeTasks = useMemo(() => tasks.filter((task) => !task.archivedAt), [tasks]);
  const archivedTasks = useMemo(() => tasks.filter((task) => Boolean(task.archivedAt)), [tasks]);

  if (loading) return <PageLoader />;
  if (error) return <ErrorState title="Failed to load project detail" subtitle={error} />;
  if (!project) return <EmptyState title="Project not found" description="The project detail could not be loaded." />;

  return (
    <Space orientation="vertical" size={24} className="w-full">
      <SectionHeader
        eyebrow="Project detail"
        title={project.name ?? 'Project'}
        description={project.description ?? 'No description'}
        action={<Button onClick={() => navigate(`/projects/${project.id}/board`)}>Open board</Button>}
      />
      <Row gutter={[20, 20]}>
        <Col xs={24} md={8}><StatCard title="Active tasks" value={String(activeTasks.length)} accent="#00685f" /></Col>
        <Col xs={24} md={8}><StatCard title="Archived tasks" value={String(archivedTasks.length)} accent="#3755c3" /></Col>
        <Col xs={24} md={8}><StatCard title="Project status" value={project.deletedAt ? 'Archived' : 'Active'} accent="#825100" /></Col>
      </Row>
      <Card className="content-card border-0!">
        <SectionHeader eyebrow="Tasks" title="Project tasks" description="View active and archived work items from this project." />
        <Tabs
          className="mt-6"
          items={[
            {
              key: 'active',
              label: `Active (${activeTasks.length})`,
              children: (
                <div className="grid gap-3">
                  {activeTasks.map((task) => (
                    <div key={task.id} className="flex flex-col gap-3 rounded-[22px] border border-slate-200/70 px-4 py-4 md:flex-row md:items-center md:justify-between">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-(--surface-low) text-(--primary)">
                          <FolderOpenOutlined />
                        </div>
                        <div>
                          <Typography.Text className="block! font-medium!">{task.title ?? 'Untitled task'}</Typography.Text>
                          <Typography.Text className="text-slate-500!">{task.description ?? 'No description'}</Typography.Text>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {task.status ? <StatusBadge status={task.status} /> : null}
                        <Button type="link" onClick={() => navigate(`/tasks/${task.id}`)}>Open</Button>
                      </div>
                    </div>
                  ))}
                </div>
              ),
            },
            {
              key: 'archived',
              label: `Archived (${archivedTasks.length})`,
              children: archivedTasks.length ? (
                <div className="grid gap-3">
                  {archivedTasks.map((task) => (
                    <div key={task.id} className="flex flex-col gap-3 rounded-[22px] border border-slate-200/70 px-4 py-4 md:flex-row md:items-center md:justify-between">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-(--surface-low) text-slate-500">
                          <FolderOpenOutlined />
                        </div>
                        <div>
                          <Typography.Text className="block! font-medium!">{task.title ?? 'Untitled task'}</Typography.Text>
                          <Typography.Text className="text-slate-500!">{task.description ?? 'No description'}</Typography.Text>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Tag>Archived</Tag>
                        <Button type="link" onClick={() => navigate(`/tasks/${task.id}`)}>Open</Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <Empty description="No archived tasks" />
              ),
            },
          ]}
        />
      </Card>
    </Space>
  );
}
