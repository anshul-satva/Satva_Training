import { AppstoreOutlined, BankOutlined, LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
import { App as AntApp, Button, Card, Form, Input, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/use-auth';
import { getErrorMessage } from '../../services/api';
import { normalizeEmail } from './shared';

export function RegisterPage() {
  const { message } = AntApp.useApp();
  const navigate = useNavigate();
  const { register, user } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [navigate, user]);

  const onFinish = async (values: {
    name?: string;
    email: string;
    password: string;
    organizationName: string;
  }) => {
    setSubmitting(true);
    try {
      await register({
        ...values,
        email: normalizeEmail(values.email),
      });
      message.success('Account created successfully. Please sign in.');
      navigate('/login', { replace: true });
    } catch (error) {
      message.error(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-(--surface) p-6 md:p-10">
      <Card className="auth-surface w-full! max-w-lg! border-0! p-2!">
        <div className="mb-8 text-center">
          <div className="mb-4 flex items-center justify-center gap-3 text-(--primary)">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-(--surface-low)">
              <AppstoreOutlined className="text-2xl!" />
            </div>
            <Typography.Text className="text-3xl! font-[Manrope]! font-semibold! text-(--primary)!">
              CollabSpace
            </Typography.Text>
          </div>
          <Typography.Title level={3} className="mb-0! mt-4! text-[28px]! font-[Manrope]! font-semibold!">
            Create organization
          </Typography.Title>
          <Typography.Paragraph className="mb-0! mt-3! text-slate-500!">
            Register the first admin for a new organization. Team members are added later by that admin.
          </Typography.Paragraph>
        </div>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item label="Full Name" name="name">
            <Input size="large" prefix={<UserOutlined className="text-slate-400!" />} placeholder="Anshul" />
          </Form.Item>
          <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email' }]}>
            <Input size="large" prefix={<MailOutlined className="text-slate-400!" />} placeholder="anshul123@example.com" />
          </Form.Item>
          <Form.Item label="Password" name="password" rules={[{ required: true, min: 6 }]}>
            <Input.Password size="large" prefix={<LockOutlined className="text-slate-400!" />} placeholder="Create password" />
          </Form.Item>
          <Form.Item label="Organization Name" name="organizationName" rules={[{ required: true }]}>
            <Input size="large" prefix={<BankOutlined className="text-slate-400!" />} placeholder="Acme Org" />
          </Form.Item>
          <Button htmlType="submit" type="primary" size="large" block loading={submitting}>
            Create admin workspace
          </Button>
          <Typography.Paragraph className="mb-0! mt-4! text-center! text-slate-500!">
            Already have an account? <Link to="/login">Sign in</Link>
          </Typography.Paragraph>
        </Form>
      </Card>
    </div>
  );
}
