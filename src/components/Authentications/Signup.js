import React from 'react';
import { Alert, Button, Form, Input } from 'antd';
import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { SIGNUP_MUTATION } from '../../GraphQL/Mutations';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth-context/auth';

export const Signup = () => {
  const auth = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const redirectPath = location.state?.path || '/'
  const [signup] = useMutation(SIGNUP_MUTATION);
  const [loginError, setLoginError] = useState(null);
  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };
  const onAlertClose = () => {
    setLoginError(null);
  };
  const onFinish = (values) => {
    signup({
      variables: {
        username: values.username,
        email: values.email,
        password: values.password,
        role: 'admin',
      }
    })
    .then(res => {
      localStorage.setItem("authUser", JSON.stringify(res.data.register));
      auth.login(JSON.parse(localStorage.getItem("authUser")));
      navigate(redirectPath, { replace: true });
      window.location.reload();
    })
    .catch(error => {
      setLoginError(JSON.stringify(error.message));
    });
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <>
      <div>Signup</div>
      <div className="login-form-container">
        <Form
          {...layout}
          name="login"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="User Name"
            name="username"
            rules={[
              {
                required: true,
                message: 'Please input your username!',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: 'Please input your user email!',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: 'Please input your password!',
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            <Button type="primary" htmlType="submit" className='btn-login'>
              Submit
            </Button>
          </Form.Item>
          {loginError && <Alert
            message={loginError}
            type="error"
            closable
            onClose={onAlertClose}
          />}
        </Form>
      </div>
    </>
  )
}
