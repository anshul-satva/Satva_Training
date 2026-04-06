import { FormEvent, useEffect, useState } from "react";
import { App, Button, Card, Form, Input, Typography } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LoginOutlined, MailOutlined } from "@ant-design/icons";
import { useAuth } from "../../../app/providers/AuthProvider";
import { getApiErrorMessage } from "../../../shared/utils/error";

export const LoginPage = () => {
  const { message } = App.useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isHydrated, login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirectPath =
    (location.state as { from?: string } | null)?.from || "/tasks";

  useEffect(() => {
    if (isHydrated && isAuthenticated) {
      navigate("/tasks", { replace: true });
    }
  }, [isAuthenticated, isHydrated, navigate]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      await login(form);
      navigate(redirectPath, { replace: true });
    } catch (err) {
      void message.error(getApiErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="auth-screen">
      {/* <div className="auth-orb auth-orb-one"></div>
      <div className="auth-orb auth-orb-two"></div> */}
      <div className="auth-grid">
        <Card className="auth-card" variant="borderless">
          <div className="auth-logo-badge">
            <LoginOutlined />
          </div>

          <Typography.Title level={2} className="brand-font auth-title">
            Welcome Back
          </Typography.Title>
          <Typography.Paragraph className="auth-subtitle">
            Sign in to continue to your task board.
          </Typography.Paragraph>

          <Form
            layout="vertical"
            onSubmitCapture={handleSubmit}
            requiredMark={false}
          >
            <Form.Item label="Email">
              <Input
                size="large"
                value={form.email}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    email: event.target.value,
                  }))
                }
                placeholder="john@example.com"
              />
            </Form.Item>

            <Form.Item label="Password">
              <Input.Password
                size="large"
                value={form.password}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    password: event.target.value,
                  }))
                }
                placeholder="Enter your password"
              />
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={isSubmitting}
              icon={<LoginOutlined />}
            >
              Sign in
            </Button>
          </Form>

          <Typography.Paragraph className="auth-footer-text">
            New here? <Link to="/register">Create an account</Link>
          </Typography.Paragraph>
        </Card>
      </div>
    </main>
  );
};
