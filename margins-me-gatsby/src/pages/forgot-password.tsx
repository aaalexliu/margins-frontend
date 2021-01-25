import React, { Fragment, useState } from 'react';

import { Form, Input, Button, Checkbox, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import { AuthPageLayout } from '../components/page-layout';
import { SEO } from '../components';

import { navigate, Link } from 'gatsby';

import { currentAccountVar, passwordVar } from '../apollo/cache';
import { forgotPassword } from '../amplify/auth';

const ForgotPassword = () => {

  const [form] = Form.useForm();

  const [isLoading, setIsLoading] = useState(false);

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  const onFinish = async (values: any) => {
    console.log('Success:', values);
    const { email } = values;
    setIsLoading(true);
    const forgotPasswordRes = await forgotPassword(values.email);
    console.log('forgot password response', forgotPasswordRes);
    setIsLoading(false);
    navigate(`/forgot-password-submit?email=${encodeURIComponent(email)}`);
  }

  return (
  <AuthPageLayout>
    <SEO title="Forgot Password" />
    <Form
      name="forget-password"
      className="forgot-password"
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      layout="vertical"
    >
      <Form.Item
        // label="Email"
        name="email"
        rules={[{ required: true, message: 'Please input your Email!' }]}
      >
        <Input placeholder="Email" />
      </Form.Item>
      <Form.Item
      >
        <Button type="primary" loading={isLoading} htmlType="submit" className="login-form-button"
          css={{
            width: '100%'
          }}
        >
          Reset Password
        </Button>
      </Form.Item>
    </Form>
  </AuthPageLayout>
  );
}

export default ForgotPassword;