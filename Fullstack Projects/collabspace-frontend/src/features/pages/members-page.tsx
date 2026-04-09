import { DeleteOutlined, LockOutlined, MailOutlined, PlusOutlined, UserOutlined, UserSwitchOutlined } from '@ant-design/icons';
import { App as AntApp, Button, Card, Form, Input, Modal, Select, Space, Typography } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ErrorState, PageLoader } from '../../components/common/feedback';
import { IconActionButton, RoleBadge, SectionHeader } from '../../components/common/ui';
import { getErrorMessage } from '../../services/api';
import { organizationService } from '../../services/organizations';
import type { OrganizationRole } from '../../types/api';
import type { OrganizationMembership } from '../../types/entities';
import { canManageMembers, normalizeEmail, roleOptions, useSelectedOrganization } from './shared';

export function MembersPage() {
  const { message, modal } = AntApp.useApp();
  const { activeMembership } = useSelectedOrganization();
  const { organizationId } = useParams();
  const [members, setMembers] = useState<OrganizationMembership[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [editMember, setEditMember] = useState<OrganizationMembership | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();

  const loadMembers = useCallback(async () => {
    if (!organizationId) return;
    setLoading(true);
    setError(null);
    try {
      setMembers(await organizationService.listMembers(organizationId));
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [organizationId]);

  useEffect(() => {
    void loadMembers();
  }, [loadMembers]);

  const addMember = async (values: { name?: string; email: string; password?: string; role?: OrganizationRole }) => {
    if (!organizationId) return;
    setSubmitting(true);
    try {
      await organizationService.addMember(organizationId, {
        ...values,
        email: normalizeEmail(values.email),
      });
      message.success('Member added');
      setAddOpen(false);
      addForm.resetFields();
      await loadMembers();
    } catch (error) {
      message.error(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  const updateRole = async (values: { role: OrganizationRole }) => {
    if (!organizationId || !editMember?.id) return;
    setSubmitting(true);
    try {
      await organizationService.updateMemberRole(organizationId, editMember.id, values);
      message.success('Member role updated');
      setEditMember(null);
      await loadMembers();
    } catch (error) {
      message.error(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  const removeMember = async (memberId: string) => {
    if (!organizationId) return;
    try {
      await organizationService.removeMember(organizationId, memberId);
      message.success('Member removed');
      await loadMembers();
    } catch (error) {
      message.error(getErrorMessage(error));
    }
  };

  const confirmRemoveMember = (memberId: string) => {
    modal.confirm({
      title: 'Remove this member?',
      content: 'This action will remove the user from this organization.',
      okText: 'Yes, remove',
      cancelText: 'Cancel',
      okButtonProps: { danger: true },
      onOk: async () => {
        await removeMember(memberId);
      },
    });
  };

  useEffect(() => {
    if (editMember) {
      editForm.setFieldsValue({ role: editMember.role ?? 'MEMBER' });
    }
  }, [editForm, editMember]);

  if (loading) return <PageLoader />;
  if (error) return <ErrorState title="Failed to load members" subtitle={error} />;

  return (
    <Space orientation="vertical" size={24} className="w-full">
      <SectionHeader
        eyebrow="Organization members"
        title="Member management"
        description="Admins register organization users and control role-based access."
        action={
          canManageMembers(activeMembership?.role) ? (
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setAddOpen(true)}>Register member</Button>
          ) : undefined
        }
      />
      <Card className="content-card border-0!">
        <div className="grid gap-3">
          {members.map((item) => (
            <div key={item.id} className="flex flex-col gap-4 rounded-[22px] border border-slate-200/70 px-4 py-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--surface-low)] text-[var(--primary)]">
                  <UserOutlined />
                </div>
                <div>
                  <Typography.Text className="block! font-medium!">{item.user?.name ?? item.user?.email ?? 'Member'}</Typography.Text>
                  <Typography.Text className="text-slate-500!">{item.user?.email}</Typography.Text>
                </div>
              </div>
              <div className="flex items-center justify-between gap-3 md:justify-end">
                <RoleBadge role={item.role ?? 'MEMBER'} />
                {canManageMembers(activeMembership?.role) ? (
                  <Space size={10}>
                    <IconActionButton title="Edit role" icon={<UserSwitchOutlined />} onClick={() => setEditMember(item)} />
                    <IconActionButton title="Remove member" icon={<DeleteOutlined />} danger onClick={() => confirmRemoveMember(item.id)} />
                  </Space>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </Card>
      <Modal open={addOpen} title="Register Member" footer={null} onCancel={() => setAddOpen(false)} forceRender>
        <Form form={addForm} layout="vertical" onFinish={addMember}>
          <Form.Item name="name" label="Full Name">
            <Input prefix={<UserOutlined className="text-slate-400!" />} />
          </Form.Item>
          <Form.Item name="email" label="Member Email" rules={[{ required: true, type: 'email' }]}>
            <Input prefix={<MailOutlined className="text-slate-400!" />} />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            extra="Required for a brand new user. Leave blank only if this email already has an account."
          >
            <Input.Password prefix={<LockOutlined className="text-slate-400!" />} />
          </Form.Item>
          <Form.Item name="role" label="Role">
            <Select options={roleOptions.map((role) => ({ label: role, value: role }))} />
          </Form.Item>
          <Space className="w-full justify-end">
            <Button onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button htmlType="submit" type="primary" loading={submitting}>Register</Button>
          </Space>
        </Form>
      </Modal>
      <Modal open={Boolean(editMember)} title="Update Member Role" footer={null} onCancel={() => setEditMember(null)} forceRender>
        <Form form={editForm} layout="vertical" onFinish={updateRole}>
          <Form.Item name="role" label="Role" rules={[{ required: true }]}>
            <Select options={roleOptions.map((role) => ({ label: role, value: role }))} />
          </Form.Item>
          <Space className="w-full justify-end">
            <Button onClick={() => setEditMember(null)}>Cancel</Button>
            <Button htmlType="submit" type="primary" loading={submitting}>Save</Button>
          </Space>
        </Form>
      </Modal>
    </Space>
  );
}
