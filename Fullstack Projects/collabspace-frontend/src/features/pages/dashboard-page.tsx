import { Col, Empty, Row, Space, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { EmptyState, ErrorState, PageLoader } from '../../components/common/feedback';
import { SectionHeader, StatusBadge } from '../../components/common/ui';
import { useAuth } from '../../hooks/use-auth';
import { getErrorMessage } from '../../services/api';
import { organizationService } from '../../services/organizations';
import { projectService } from '../../services/projects';
import { taskService } from '../../services/tasks';
import type { OrganizationDetail, Project, TaskEntity } from '../../types/entities';
import { useSelectedOrganization } from './shared';

export function DashboardPage() {
  const { memberships } = useAuth();
  const { activeOrganizationId } = useSelectedOrganization();
  const [loading, setLoading] = useState(true);
  const [organization, setOrganization] = useState<OrganizationDetail | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [taskCounts, setTaskCounts] = useState<Record<string, number>>({});
  const [recentTasks, setRecentTasks] = useState<TaskEntity[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      if (!activeOrganizationId) {
        setOrganization(null);
        setProjects([]);
        setTaskCounts({});
        setRecentTasks([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const [orgDetail, projectList] = await Promise.all([
          organizationService.getById(activeOrganizationId),
          projectService.list(activeOrganizationId),
        ]);
        setOrganization(orgDetail);
        setProjects(projectList);

        const projectTaskLists = await Promise.all(
          projectList.map(async (project) => ({
            projectId: project.id,
            tasks: await taskService.list(project.id, true),
          })),
        );

        setTaskCounts(
          Object.fromEntries(projectTaskLists.map((item) => [item.projectId, item.tasks.filter((task) => !task.archivedAt).length])),
        );
        setRecentTasks(
          projectTaskLists
            .flatMap((item) => item.tasks.filter((task) => !task.archivedAt))
            .sort((a, b) => new Date(b.updatedAt ?? b.createdAt ?? 0).getTime() - new Date(a.updatedAt ?? a.createdAt ?? 0).getTime())
            .slice(0, 5),
        );
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    void run();
  }, [activeOrganizationId]);

  if (loading) return <PageLoader />;
  if (error) return <ErrorState title="Failed to load dashboard" subtitle={error} />;
  if (!activeOrganizationId || !organization) {
    return <EmptyState title="No organization selected" description="Create or select an organization to begin." />;
  }

  return (
    <Space orientation="vertical" size={24} className="w-full">
      <SectionHeader
        eyebrow="Workspace"
        title="Dashboard"
        description={`Active organization: ${organization.name ?? 'Organization'}`}
      />
      <div className="compact-metric">
        <div className="compact-metric-card">
          <Typography.Text className="text-[var(--muted)]!">Organizations</Typography.Text>
          <Typography.Title level={4} className="mb-0! mt-1! text-[22px]! font-[Manrope]!">{memberships.length}</Typography.Title>
        </div>
        <div className="compact-metric-card">
          <Typography.Text className="text-[var(--muted)]!">Projects</Typography.Text>
          <Typography.Title level={4} className="mb-0! mt-1! text-[22px]! font-[Manrope]!">{projects.length}</Typography.Title>
        </div>
        <div className="compact-metric-card">
          <Typography.Text className="text-[var(--muted)]!">Members</Typography.Text>
          <Typography.Title level={4} className="mb-0! mt-1! text-[22px]! font-[Manrope]!">{organization.members?.length ?? 0}</Typography.Title>
        </div>
      </div>
      <Row gutter={[20, 20]}>
        <Col xs={24} xl={14}>
          <div className="content-card rounded-[24px] p-5">
            <Typography.Text className="text-xs! font-semibold! uppercase! tracking-[0.18em]! text-[var(--muted)]!">
              Recent Projects
            </Typography.Text>
            <div className="compact-list mt-4">
              {projects.length ? (
                projects.slice(0, 5).map((project) => (
                  <div key={project.id} className="compact-list-row">
                    <div className="min-w-0">
                      <Typography.Text className="block! font-medium!">{project.name ?? 'Untitled project'}</Typography.Text>
                      <Typography.Text className="text-[var(--muted)]!">
                        {project.description ?? 'No description'}
                      </Typography.Text>
                    </div>
                    <Typography.Text className="whitespace-nowrap! text-[var(--muted)]!">
                      {taskCounts[project.id] ?? 0} tasks
                    </Typography.Text>
                  </div>
                ))
              ) : (
                <Empty description="No projects yet" />
              )}
            </div>
          </div>
        </Col>
        <Col xs={24} xl={10}>
          <div className="content-card rounded-[24px] p-5">
            <Typography.Text className="text-xs! font-semibold! uppercase! tracking-[0.18em]! text-[var(--muted)]!">
              Recent Tasks
            </Typography.Text>
            <div className="compact-list mt-4">
              {recentTasks.length ? (
                recentTasks.map((task) => (
                  <div key={task.id} className="compact-list-row">
                    <div className="min-w-0">
                      <Typography.Text className="block! font-medium!">{task.title ?? 'Untitled task'}</Typography.Text>
                      <Typography.Text className="text-[var(--muted)]!">
                        {task.assignedUser?.name ?? task.assignedUser?.email ?? 'Unassigned'}
                      </Typography.Text>
                    </div>
                    <StatusBadge status={task.status ?? 'TODO'} />
                  </div>
                ))
              ) : (
                <Empty description="No recent tasks yet" />
              )}
            </div>
          </div>
        </Col>
      </Row>
    </Space>
  );
}
