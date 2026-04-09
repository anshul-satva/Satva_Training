import { AppstoreOutlined, DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';
import { App as AntApp, Button, Card, Col, Empty, Form, Input, Modal, Row, Space } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EmptyState, ErrorState, PageLoader } from '../../components/common/feedback';
import { IconActionButton, ProjectCard, SectionHeader } from '../../components/common/ui';
import { getErrorMessage } from '../../services/api';
import { projectService } from '../../services/projects';
import type { Project } from '../../types/entities';
import { canManageProjects, useSelectedOrganization } from './shared';

export function ProjectsPage() {
  const { message, modal } = AntApp.useApp();
  const navigate = useNavigate();
  const { activeOrganizationId, activeMembership } = useSelectedOrganization();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();

  const loadProjects = useCallback(async () => {
    if (!activeOrganizationId) {
      setProjects([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      setProjects(await projectService.list(activeOrganizationId));
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [activeOrganizationId]);

  useEffect(() => {
    void loadProjects();
  }, [loadProjects]);

  const openCreate = () => {
    setEditingProject(null);
    form.resetFields();
    setOpen(true);
  };

  const openEdit = (project: Project) => {
    setEditingProject(project);
    form.setFieldsValue({
      name: project.name,
      description: project.description,
    });
    setOpen(true);
  };

  const submitProject = async (values: { name?: string; description?: string }) => {
    if (!activeOrganizationId && !editingProject) return;
    setSubmitting(true);
    try {
      if (editingProject?.id) {
        await projectService.update(editingProject.id, values);
        message.success('Project updated');
      } else {
        await projectService.create(activeOrganizationId as string, values);
        message.success('Project created');
      }
      setOpen(false);
      form.resetFields();
      await loadProjects();
    } catch (error) {
      message.error(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  const deleteProject = async (projectId: string) => {
    try {
      await projectService.remove(projectId);
      message.success('Project archived');
      await loadProjects();
    } catch (error) {
      message.error(getErrorMessage(error));
    }
  };

  const confirmArchiveProject = (projectId: string) => {
    modal.confirm({
      title: 'Archive this project?',
      content: 'Archived projects will be removed from active delivery views.',
      okText: 'Yes, archive',
      cancelText: 'Cancel',
      okButtonProps: { danger: true },
      onOk: async () => {
        await deleteProject(projectId);
      },
    });
  };

  if (loading) return <PageLoader />;
  if (error) return <ErrorState title="Failed to load projects" subtitle={error} />;
  if (!activeOrganizationId) return <EmptyState title="No active organization" description="Select an organization to manage projects." />;

  return (
    <Space orientation="vertical" size={24} className="w-full">
      <SectionHeader
        eyebrow="Projects"
        title="Delivery portfolio"
        description="Create, review, and manage projects for the active organization."
        action={
          canManageProjects(activeMembership?.role) ? (
            <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>Create project</Button>
          ) : undefined
        }
      />
      <Row gutter={[20, 20]}>
        {projects.length ? (
          projects.map((project) => (
            <Col xs={24} xl={8} key={project.id}>
              <Card className="content-card h-full! border-0!">
                <Space orientation="vertical" size={16} className="flex h-full w-full justify-between">
                  <ProjectCard title={project.name ?? 'Untitled project'} status={project.description ?? 'No description'} tasks={0} progress={0} />
                  <Space size={10} wrap={false} className="overflow-x-auto!">
                    <IconActionButton title="Open details" icon={<EyeOutlined />} onClick={() => navigate(`/projects/${project.id}`)} />
                    <IconActionButton title="Open board" icon={<AppstoreOutlined />} onClick={() => navigate(`/projects/${project.id}/board`)} />
                    {canManageProjects(activeMembership?.role) ? <IconActionButton title="Edit project" icon={<EditOutlined />} onClick={() => openEdit(project)} /> : null}
                    {canManageProjects(activeMembership?.role) ? (
                      <IconActionButton title="Archive project" icon={<DeleteOutlined />} danger onClick={() => confirmArchiveProject(project.id)} />
                    ) : null}
                  </Space>
                </Space>
              </Card>
            </Col>
          ))
        ) : (
          <Col span={24}>
            <Card className="content-card border-0!">
              <Empty description="No projects yet" />
            </Card>
          </Col>
        )}
      </Row>
      <Modal open={open} title={editingProject ? 'Edit Project' : 'Create Project'} footer={null} onCancel={() => setOpen(false)} forceRender>
        <Form form={form} layout="vertical" onFinish={submitProject}>
          <Form.Item name="name" label="Project Name">
            <Input placeholder="Website Revamp" />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea rows={4} />
          </Form.Item>
          <Space className="w-full justify-end">
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button htmlType="submit" type="primary" loading={submitting}>
              {editingProject ? 'Save' : 'Create'}
            </Button>
          </Space>
        </Form>
      </Modal>
    </Space>
  );
}
