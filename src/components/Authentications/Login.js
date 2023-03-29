import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Alert } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMutation } from "@apollo/client";

import { useAuth } from '../../auth-context/auth';
import { LOGIN_MUTATION } from '../../GraphQL/Mutations';
import './Login.css';

export const Login = () => {
  const [login] = useMutation(LOGIN_MUTATION);
  const [loginError, setLoginError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuth();

  const redirectPath = location.state?.path || '/'

  const onFinish = (values) => {
    login({
      variables: {
        email: values.email,
        password: values.password
      }
    })
    .then(res => {
      localStorage.setItem("authUser", JSON.stringify(res.data.login));
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

  const onAlertClose = () => {
    setLoginError(null);
  };

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  useEffect(() => {
    const authUser = JSON.parse(localStorage.getItem("authUser"));
    if(authUser) {
      navigate('/', { replace: true });
    }
  });

  return (
    <>
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
            label="Email"
            name="email"
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
