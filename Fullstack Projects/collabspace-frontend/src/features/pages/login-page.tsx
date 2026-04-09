import { AppstoreOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { App as AntApp, Button, Card, Form, Input, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/use-auth';
import { getErrorMessage } from '../../services/api';
import { normalizeEmail } from './shared';

export function LoginPage() {
  const { message } = AntApp.useApp();
  const navigate = useNavigate();
  const { login, user } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [navigate, user]);

  const onFinish = async (values: { email: string; password: string }) => {
    setSubmitting(true);
    try {
      await login({
        ...values,
        email: normalizeEmail(values.email),
      });
      message.success('Logged in successfully');
      navigate('/dashboard', { replace: true });
    } catch (error) {
      message.error(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-(--surface) p-6 md:p-10">
      <Card className="auth-surface w-full! max-w-md! border-0! p-2!">
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
            Sign in
          </Typography.Title>
        </div>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email' }]}>
            <Input size="large" prefix={<MailOutlined className="text-slate-400!" />} placeholder="anshul123@example.com" />
          </Form.Item>
          <Form.Item label="Password" name="password" rules={[{ required: true }]}>
            <Input.Password size="large" prefix={<LockOutlined className="text-slate-400!" />} placeholder="Enter your password" />
          </Form.Item>
          <Button htmlType="submit" type="primary" size="large" block loading={submitting}>
            Sign in
          </Button>
          <Typography.Paragraph className="mb-0! mt-4! text-center! text-slate-500!">
            New here? <Link to="/register">Create an account</Link>
          </Typography.Paragraph>
        </Form>
      </Card>
    </div>
  );
}
