import { DeleteOutlined, EditOutlined, PlusOutlined, TagsOutlined } from '@ant-design/icons';
import { App as AntApp, Button, Card, Col, Empty, Form, Input, Modal, Row, Space, Typography } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { EmptyState, ErrorState, PageLoader } from '../../components/common/feedback';
import { IconActionButton, SectionHeader } from '../../components/common/ui';
import { getErrorMessage } from '../../services/api';
import { tagService } from '../../services/tags';
import type { TagEntity } from '../../types/entities';
import { accentColors, canManageTags, useSelectedOrganization } from './shared';

export function TagsPage() {
  const { message, modal } = AntApp.useApp();
  const { activeOrganizationId, activeMembership } = useSelectedOrganization();
  const [tags, setTags] = useState<TagEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<TagEntity | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();
  const [selectedColor, setSelectedColor] = useState<string>(accentColors[0]);

  const loadTags = useCallback(async () => {
    if (!activeOrganizationId) {
      setTags([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      setTags(await tagService.list(activeOrganizationId));
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [activeOrganizationId]);

  useEffect(() => {
    void loadTags();
  }, [loadTags]);

  const openCreate = () => {
    setEditingTag(null);
    setSelectedColor(accentColors[0]);
    form.resetFields();
    setOpen(true);
  };

  const openEdit = (tag: TagEntity) => {
    setEditingTag(tag);
    setSelectedColor(tag.color ?? accentColors[0]);
    form.setFieldsValue({ name: tag.name });
    setOpen(true);
  };

  const submitTag = async (values: { name?: string }) => {
    if (!activeOrganizationId && !editingTag) return;
    setSubmitting(true);
    try {
      if (editingTag?.id) {
        await tagService.update(editingTag.id, { name: values.name, color: selectedColor });
        message.success('Tag updated');
      } else {
        await tagService.create(activeOrganizationId as string, { name: values.name, color: selectedColor });
        message.success('Tag created');
      }
      setOpen(false);
      form.resetFields();
      await loadTags();
    } catch (error) {
      message.error(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  const deleteTag = async (tagId: string) => {
    try {
      await tagService.remove(tagId);
      message.success('Tag deleted');
      await loadTags();
    } catch (error) {
      message.error(getErrorMessage(error));
    }
  };

  const confirmDeleteTag = (tagId: string) => {
    modal.confirm({
      title: 'Delete this tag?',
      content: 'This will remove the tag from your organization.',
      okText: 'Yes, delete',
      cancelText: 'Cancel',
      okButtonProps: { danger: true },
      onOk: async () => {
        await deleteTag(tagId);
      },
    });
  };

  if (loading) return <PageLoader />;
  if (error) return <ErrorState title="Failed to load tags" subtitle={error} />;
  if (!activeOrganizationId) return <EmptyState title="No active organization" description="Select an organization to manage tags." />;

  return (
    <Space orientation="vertical" size={24} className="w-full">
      <SectionHeader
        eyebrow="Tags"
        title="Organization tags"
        description="Create and manage labels used across your work items."
        action={
          canManageTags(activeMembership?.role) ? (
            <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>Add tag</Button>
          ) : undefined
        }
      />
      <Row gutter={[20, 20]}>
        {tags.length ? (
          tags.map((tag) => (
            <Col xs={24} md={12} xl={8} key={tag.id}>
              <Card className="content-card border-0!">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl text-white" style={{ background: tag.color ?? '#00685f' }}>
                      <TagsOutlined />
                    </div>
                    <div className="min-w-0">
                      <Typography.Title level={5} className="mb-0! font-[Manrope]!">{tag.name ?? 'Tag'}</Typography.Title>
                      <Typography.Text className="text-slate-500!">{tag.color ?? 'No color'}</Typography.Text>
                    </div>
                  </div>
                  {canManageTags(activeMembership?.role) ? (
                    <Space size={10} wrap={false}>
                      <IconActionButton title="Edit tag" icon={<EditOutlined />} onClick={() => openEdit(tag)} />
                      <IconActionButton title="Delete tag" icon={<DeleteOutlined />} danger onClick={() => confirmDeleteTag(tag.id)} />
                    </Space>
                  ) : null}
                </div>
              </Card>
            </Col>
          ))
        ) : (
          <Col span={24}>
            <Card className="content-card border-0!">
              <Empty description="No tags yet" />
            </Card>
          </Col>
        )}
      </Row>
      <Modal open={open} title={editingTag ? 'Edit Tag' : 'Create Tag'} footer={null} onCancel={() => setOpen(false)} forceRender>
        <Form form={form} layout="vertical" onFinish={submitTag}>
          <Form.Item name="name" label="Tag Name">
            <Input placeholder="e.g. urgent_release" />
          </Form.Item>
          <Form.Item label="Accent Color">
            <div className="flex flex-wrap gap-3">
              {accentColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`h-10 w-10 rounded-full border-4 border-white shadow ${selectedColor === color ? 'ring-2 ring-slate-400' : ''}`}
                  style={{ background: color }}
                  onClick={() => setSelectedColor(color)}
                />
              ))}
            </div>
          </Form.Item>
          <Space className="w-full justify-end">
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button htmlType="submit" type="primary" loading={submitting}>
              {editingTag ? 'Save' : 'Create'}
            </Button>
          </Space>
        </Form>
      </Modal>
    </Space>
  );
}
