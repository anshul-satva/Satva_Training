import { EditOutlined, TeamOutlined } from '@ant-design/icons';
import { App as AntApp, Button, Card, Col, Empty, Form, Input, Modal, Row, Space, Tag, Typography } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { EmptyState, ErrorState, PageLoader } from '../../components/common/feedback';
import { ProjectCard, RoleBadge, SectionHeader, StatCard } from '../../components/common/ui';
import { getErrorMessage } from '../../services/api';
import { organizationService } from '../../services/organizations';
import type { OrganizationDetail } from '../../types/entities';
import { canEditOrganization, canManageMembers, useSelectedOrganization } from './shared';

export function OrganizationDetailPage() {
  const { message } = AntApp.useApp();
  const { activeMembership, activeOrganizationId } = useSelectedOrganization();
  const { organizationId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [organization, setOrganization] = useState<OrganizationDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();

  const loadOrganization = useCallback(async () => {
    if (!organizationId) return;
    setLoading(true);
    setError(null);
    try {
      const result = await organizationService.getById(organizationId);
      setOrganization(result);
      form.setFieldsValue({
        name: result.name,
        description: result.description,
      });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [form, organizationId]);

  useEffect(() => {
    void loadOrganization();
  }, [loadOrganization]);

  const onUpdate = async (values: { name?: string; description?: string }) => {
    if (!organizationId) return;
    setSubmitting(true);
    try {
      await organizationService.update(organizationId, values);
      await loadOrganization();
      message.success('Organization updated');
      setOpen(false);
    } catch (error) {
      message.error(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  if (organizationId !== activeOrganizationId) return <ErrorState title="Access Restricted" subtitle="You must select this organization from the sidebar dropdown to view its details." />;
  if (loading) return <PageLoader />;
  if (error) return <ErrorState title="Failed to load organization" subtitle={error} />;
  if (!organization) return <EmptyState title="Organization not found" description="The organization could not be loaded." />;

  return (
    <Space orientation="vertical" size={24} className="w-full">
      <SectionHeader
        eyebrow="Organization detail"
        title={organization.name ?? 'Organization'}
        description={organization.description ?? 'No description'}
        action={
          canEditOrganization(activeMembership?.role) ? (
            <Button icon={<EditOutlined />} onClick={() => setOpen(true)}>Edit organization</Button>
          ) : undefined
        }
      />
      <Row gutter={[20, 20]}>
        <Col xs={24} md={8}><StatCard title="Members" value={String(organization.members?.length ?? 0)} accent="#00685f" /></Col>
        <Col xs={24} md={8}><StatCard title="Projects" value={String(organization.projects?.length ?? 0)} accent="#3755c3" /></Col>
        <Col xs={24} md={8}><StatCard title="Tags" value={String(organization.tags?.length ?? 0)} accent="#825100" /></Col>
      </Row>
      <Row gutter={[20, 20]}>
        <Col xs={24} lg={12}>
          <Card className="content-card border-0!">
            <SectionHeader
              eyebrow="Team"
              title="Members"
              description="Roles and access within this organization."
              action={
                canManageMembers(activeMembership?.role) ? (
                  <Button onClick={() => navigate(`/organizations/${organization.id}/members`)}>Manage members</Button>
                ) : undefined
              }
            />
            <div className="mt-6 grid gap-3">
              {(organization.members ?? []).map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200/70 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-(--surface-low) text-(--secondary)">
                      <TeamOutlined />
                    </div>
                    <div>
                      <Typography.Text className="block! font-medium!">{item.user?.name ?? item.user?.email ?? 'Member'}</Typography.Text>
                      <Typography.Text className="text-slate-500!">{item.user?.email}</Typography.Text>
                    </div>
                  </div>
                  <RoleBadge role={item.role ?? 'MEMBER'} />
                </div>
              ))}
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card className="content-card border-0!">
            <SectionHeader
              eyebrow="Work"
              title="Projects & tags"
              description="Project and tag coverage for this workspace."
              action={<Button onClick={() => navigate('/projects')}>Open projects</Button>}
            />
            <div className="mt-6 grid gap-4">
              {(organization.projects ?? []).slice(0, 3).map((project) => (
                <ProjectCard
                  key={project.id}
                  title={project.name ?? 'Untitled project'}
                  status={project.description ?? 'No description'}
                  tasks={0}
                  progress={0}
                />
              ))}
              {(organization.tags?.length ?? 0) ? (
                <div className="flex flex-wrap gap-2">
                  {(organization.tags ?? []).map((tag) => (
                    <Tag key={tag.id} color={tag.color ?? 'cyan'}>{tag.name ?? 'Tag'}</Tag>
                  ))}
                </div>
              ) : (
                <Empty description="No tags yet" />
              )}
            </div>
          </Card>
        </Col>
      </Row>
      <Modal open={open} title="Edit Organization" footer={null} onCancel={() => setOpen(false)} forceRender>
        <Form form={form} layout="vertical" onFinish={onUpdate}>
          <Form.Item name="name" label="Organization Name">
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea rows={4} />
          </Form.Item>
          <Space className="w-full justify-end">
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button htmlType="submit" type="primary" loading={submitting}>Save</Button>
          </Space>
        </Form>
      </Modal>
    </Space>
  );
}
