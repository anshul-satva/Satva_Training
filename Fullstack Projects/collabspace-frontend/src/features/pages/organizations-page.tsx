import { ArrowRightOutlined, BankOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';
import { App as AntApp, Button, Card, Col, Form, Input, Modal, Row, Space, Typography } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RoleBadge, SectionHeader } from '../../components/common/ui';
import { useAuth } from '../../hooks/use-auth';
import { getErrorMessage } from '../../services/api';
import { organizationService } from '../../services/organizations';
import { canCreateOrganizations, useSelectedOrganization } from './shared';

export function OrganizationsPage() {
  const { message } = AntApp.useApp();
  const { memberships, refreshMe } = useAuth();
  const { activeMembership } = useSelectedOrganization();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();

  const createOrganization = async (values: { name?: string; description?: string }) => {
    setSubmitting(true);
    try {
      await organizationService.create(values);
      await refreshMe();
      message.success('Organization created');
      setOpen(false);
      form.resetFields();
    } catch (error) {
      message.error(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Space orientation="vertical" size={24} className="w-full">
      <SectionHeader
        eyebrow="Organizations"
        title="Multi-tenant workspace"
        description="Manage each organization, its team, and its project space."
        action={
          canCreateOrganizations(activeMembership?.role) ? (
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setOpen(true)}>Create organization</Button>
          ) : undefined
        }
      />
      <Row gutter={[20, 20]}>
        {memberships.map((membership) => (
          <Col xs={24} lg={12} key={membership.id}>
            <Card className="content-card border-0!">
              <Space orientation="vertical" size={18} className="w-full">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex min-w-0 flex-1 items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-(--surface-low) text-(--primary)">
                      <BankOutlined />
                    </div>
                    <div className="min-w-0">
                      <Typography.Title level={3} className="mb-1! font-[Manrope]!">
                        {membership.organization?.name ?? 'Organization'}
                      </Typography.Title>
                      <Typography.Paragraph className="mb-0! text-slate-500!" ellipsis={{ rows: 2 }}>
                        {membership.organization?.description ?? 'No description'}
                      </Typography.Paragraph>
                    </div>
                  </div>
                  <RoleBadge role={membership.role ?? 'MEMBER'} />
                </div>
                <Space size={10} wrap={false}>
                  <Button icon={<EyeOutlined />} onClick={() => navigate(`/organizations/${membership.organizationId}`)}>Open</Button>
                  <Button icon={<ArrowRightOutlined />} onClick={() => navigate(`/organizations/${membership.organizationId}/members`)}>Members</Button>
                </Space>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>
      <Modal open={open} title="Create Organization" footer={null} onCancel={() => setOpen(false)} forceRender>
        <Form form={form} layout="vertical" onFinish={createOrganization}>
          <Form.Item name="name" label="Organization Name">
            <Input placeholder="Acme Org" />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea rows={4} placeholder="Describe your workspace" />
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
