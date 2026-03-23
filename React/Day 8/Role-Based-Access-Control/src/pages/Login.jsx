import React, { useState } from "react"
import { Form, Input, Button, Card, Typography, Alert } from "antd"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { login } from "../redux/slices/authSlice"
import { setPermissions } from "../redux/slices/permissionSlice"
import { loginService } from "../services/authService"

const { Title } = Typography

function Login() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  const handleFinish = async (values) => {
    setErrorMsg("")
    setLoading(true)

    try {
      console.log("1. Calling loginService...")
      const result = await loginService(values.email, values.password)

      console.log("2. Result received:", result)

      localStorage.setItem("authToken", result.token)

      console.log("3. Dispatching login...")
      dispatch(login({ token: result.token, user: result.user }))
      dispatch(setPermissions(result.permissions))

      console.log("4. Navigating to /")
      navigate("/")

    } catch (err) {
      console.log("ERROR:", err)
      console.log("ERROR response:", err.response?.data)
      setErrorMsg("Invalid email or password")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <Card className="w-96 shadow-lg" >
        <Title level={3} className="text-center! mb-6!">
          Login
        </Title>

        {errorMsg && (
          <Alert
            message={errorMsg}
            type="error"
            showIcon
            className="mb-4!"
          />
        )}

        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Please enter valid email" },
            ]}
          >
            <Input placeholder="Enter your email" size="large" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please enter your password" }]}
          >
            <Input.Password placeholder="Enter your password" size="large" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              size="large"
            >
              Login
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default Login