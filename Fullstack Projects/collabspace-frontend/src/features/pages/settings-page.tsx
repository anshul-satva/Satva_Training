import { Button, Card, Col, Row, Space, Tag, Typography } from 'antd';
import { SectionHeader } from '../../components/common/ui';
import { useAuth } from '../../hooks/use-auth';

export function SettingsPage() {
  const { user, memberships, activeMembership, refreshMe } = useAuth();

  return (
    <Space orientation="vertical" size={24} className="w-full">
      <SectionHeader
        eyebrow="Settings"
        title="Workspace settings"
        description="Review your profile and current workspace access."
      />
      <Row gutter={[20, 20]}>
        <Col xs={24} xl={12}>
          <Card className="content-card border-0!">
            <Space orientation="vertical" size={16} className="w-full">
              <Typography.Title level={4} className="mb-0! font-[Manrope]!">Current user</Typography.Title>
              <Typography.Text>Name: {user?.name ?? 'No name'}</Typography.Text>
              <Typography.Text>Email: {user?.email ?? 'No email'}</Typography.Text>
              <Typography.Text>Organizations: {memberships.length}</Typography.Text>
              <Typography.Text>Active Role: {activeMembership?.role ?? 'N/A'}</Typography.Text>
              <Space wrap>
                <Button onClick={() => void refreshMe()}>Refresh profile</Button>
              </Space>
            </Space>
          </Card>
        </Col>
        <Col xs={24} xl={12}>
          <Card className="content-card border-0!">
            <Space orientation="vertical" size={16} className="w-full">
              <Typography.Title level={4} className="mb-0! font-[Manrope]!">Access summary</Typography.Title>
              <Typography.Paragraph className="mb-0! text-slate-500!">
                Your account can work across organizations, projects, tasks, comments, tags, and activity history.
              </Typography.Paragraph>
              <Tag color="processing">Workspace ready</Tag>
            </Space>
          </Card>
        </Col>
      </Row>
    </Space>
  );
}
