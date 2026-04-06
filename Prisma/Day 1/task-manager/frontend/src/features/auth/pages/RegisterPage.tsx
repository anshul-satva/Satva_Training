import { FormEvent, useEffect, useState } from "react";
import { App, Button, Card, Form, Input, Typography } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { MailOutlined, UserAddOutlined, UserOutlined } from "@ant-design/icons";
import { useAuth } from "../../../app/providers/AuthProvider";
import { getApiErrorMessage } from "../../../shared/utils/error";

export const RegisterPage = () => {
  const { message } = App.useApp();
  const navigate = useNavigate();
  const { isAuthenticated, isHydrated, register } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isHydrated && isAuthenticated) {
      navigate("/tasks", { replace: true });
    }
  }, [isAuthenticated, isHydrated, navigate]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      await register(form);
      void message.success("Account created successfully. Please sign in.");
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 900);
    } catch (err) {
      void message.error(getApiErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="auth-screen">
      <div className="auth-orb auth-orb-one"></div>
      <div className="auth-orb auth-orb-two"></div>
      <div className="auth-grid">
        <Card className="auth-card" variant="borderless">
          <div className="auth-logo-badge auth-logo-register">
            <UserAddOutlined />
          </div>

          <Typography.Title level={2} className="brand-font auth-title">
            Create Account
          </Typography.Title>
          <Typography.Paragraph className="auth-subtitle">
            Start your workspace in a few seconds.
          </Typography.Paragraph>

          <Form layout="vertical" onSubmitCapture={handleSubmit} requiredMark={false}>
            <Form.Item label="Name">
              <Input
                size="large"
                prefix={<UserOutlined />}
                value={form.name}
                onChange={(event) =>
                  setForm((current) => ({ ...current, name: event.target.value }))
                }
                placeholder="John Doe"
              />
            </Form.Item>

            <Form.Item label="Email">
              <Input
                size="large"
                prefix={<MailOutlined />}
                value={form.email}
                onChange={(event) =>
                  setForm((current) => ({ ...current, email: event.target.value }))
                }
                placeholder="john@example.com"
              />
            </Form.Item>

            <Form.Item label="Password">
              <Input.Password
                size="large"
                value={form.password}
                onChange={(event) =>
                  setForm((current) => ({ ...current, password: event.target.value }))
                }
                placeholder="At least 6 characters"
              />
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={isSubmitting}
              icon={<UserAddOutlined />}
            >
              Create account
            </Button>
          </Form>

          <Typography.Paragraph className="auth-footer-text">
            Already have an account? <Link to="/login">Sign in</Link>
          </Typography.Paragraph>
        </Card>
      </div>
    </main>
  );
};
