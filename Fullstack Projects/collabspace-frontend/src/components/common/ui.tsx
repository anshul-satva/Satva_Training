import { FolderOpenOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Card, Progress, Space, Tag, Tooltip, Typography } from 'antd';
import type { ReactNode } from 'react';
import type { OrganizationRole, TaskStatus } from '../../types/api';

const statusColorMap: Record<TaskStatus, string> = {
  TODO: 'default',
  IN_PROGRESS: 'blue',
  DONE: 'green',
};

const roleColorMap: Record<OrganizationRole, string> = {
  ADMIN: 'red',
  MANAGER: 'blue',
  MEMBER: 'default',
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <div>
        <Typography.Text className="mb-2! block! text-xs! font-semibold! uppercase! tracking-[0.18em]! text-slate-500!">
          {eyebrow}
        </Typography.Text>
        <Typography.Title level={3} className="mb-1! text-[30px]! font-[Manrope]! font-semibold! tracking-[-0.02em]!">
          {title}
        </Typography.Title>
        <Typography.Paragraph className="mb-0! max-w-2xl! text-[15px]! leading-6! text-slate-500!">
          {description}
        </Typography.Paragraph>
      </div>
      {action}
    </div>
  );
}

export function StatCard({ title, value, accent }: { title: string; value: string; accent: string }) {
  return (
    <Card className="content-card border-0!">
      <div
        className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl text-lg text-white shadow-sm"
        style={{ background: `linear-gradient(135deg, ${accent}, #1f2937)` }}
      >
        <FolderOpenOutlined />
      </div>
      <Typography.Text className="text-slate-500!">{title}</Typography.Text>
      <Typography.Title level={3} className="mb-0! mt-2! text-[26px]! font-[Manrope]! font-semibold!">
        {value}
      </Typography.Title>
    </Card>
  );
}

export function StatusBadge({ status }: { status: TaskStatus }) {
  return <Tag color={statusColorMap[status]}>{status.replace('_', ' ')}</Tag>;
}

export function RoleBadge({ role }: { role: OrganizationRole }) {
  return <Tag color={roleColorMap[role]}>{role}</Tag>;
}

export function IconActionButton({
  title,
  icon,
  danger,
  onClick,
}: {
  title: string;
  icon: ReactNode;
  danger?: boolean;
  onClick?: () => void;
}) {
  return (
    <Tooltip title={title}>
      <Button
        aria-label={title}
        icon={icon}
        danger={danger}
        className="action-icon-button"
        onClick={onClick}
      />
    </Tooltip>
  );
}

export function ProjectCard({
  title,
  status,
  tasks,
  progress,
}: {
  title: string;
  status: string;
  tasks: number;
  progress: number;
}) {
  return (
    <Card className="content-card border-0!">
      <Space orientation="vertical" size={12} className="flex min-h-39.5 w-full justify-between">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-(--surface-low) text-(--secondary)">
              <FolderOpenOutlined />
            </div>
            <Typography.Title level={4} className="mb-1! text-[22px]! font-[Manrope]! font-semibold!">
              {title}
            </Typography.Title>
            <Typography.Paragraph
              className="mb-0! text-slate-500!"
              ellipsis={{ rows: 2, tooltip: status }}
            >
              {status}
            </Typography.Paragraph>
          </div>
          <Tag color="cyan">{tasks} Tasks</Tag>
        </div>
        <div>
          <Progress percent={progress} strokeColor="#00685f" railColor="#d9e3f6" showInfo={false} />
        </div>
      </Space>
    </Card>
  );
}

export function TaskPreviewCard({
  title,
  description,
  assignee,
  tag,
  archived,
}: {
  title: string;
  description: string;
  assignee: string;
  tag: string;
  archived?: boolean;
}) {
  return (
    <Card className="content-card border-0!">
      <Space orientation="vertical" size={10} className="w-full">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-2xl bg-(--surface-low) text-(--primary)">
              <FolderOpenOutlined />
            </div>
            <Typography.Title level={5} className="mb-0! text-[18px]! font-[Manrope]! font-semibold!">
              {title}
            </Typography.Title>
          </div>
          <Tag color={archived ? 'default' : 'geekblue'}>{tag}</Tag>
        </div>
        <Typography.Paragraph className="mb-0! text-sm! text-slate-500!" ellipsis={{ rows: 3, tooltip: description }}>
          {description}
        </Typography.Paragraph>
        <div className="flex items-center justify-between text-sm text-slate-500">
          <span className="inline-flex items-center gap-2">
            <UserOutlined />
            {assignee}
          </span>
          {archived ? <Tag>Archived</Tag> : null}
        </div>
      </Space>
    </Card>
  );
}
