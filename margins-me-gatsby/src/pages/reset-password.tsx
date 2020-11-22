import React, { Fragment, useState } from 'react';

import { Form, Input, Button, Checkbox, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import PageLayout from '../components/page-layout';

import { navigate, Link } from 'gatsby';

import { currentAccountVar, passwordVar } from '../apollo/cache';
import { forgotPassword } from '../amplify/auth';

const CenteredDiv = styled.div`
  margin: 0 auto;
  width: 50%;

  .login-form {
    max-width: 300px;
  }
  .login-form-forgot {
    float: right;
  }
  .ant-col-rtl .login-form-forgot {
    float: left;
  }
  .login-form-button {
    width: 100%;
  }
`;

const ResetPassword = () => {

  const [form] = Form.useForm();

  const [isLoading, setIsLoading] = useState(false);

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  const onFinish = async (values: any) => {
    console.log('Success:', values);
    const { email } = values;
    setIsLoading(true);
    await forgotPassword(values.email);
    setIsLoading(false);
    navigate('')
  }

  return (
<PageLayout>
  <CenteredDiv>
    <Form
      name="forget-password"
      className="forgot-password"
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      layout="vertical"
    >
      <Form.Item
        label="Email"
        name="email"
        rules={[{ required: true, message: 'Please input your Email!' }]}
      >
        <Input placeholder="Email" />
      </Form.Item>
      <Form.Item
      >
        <Button type="primary" loading={isLoading} htmlType="submit" className="login-form-button">
          Reset Password
        </Button>
      </Form.Item>
    </Form>
  </CenteredDiv>
</PageLayout>
  );
}

export default ResetPassword;