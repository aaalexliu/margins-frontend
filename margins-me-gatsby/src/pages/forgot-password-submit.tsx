import React, { Fragment, useState } from 'react';

import { Form, Input, Button, Checkbox, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import PageLayout from '../components/page-layout';

import { navigate } from 'gatsby';

import { currentAccountVar, passwordVar } from '../apollo/cache';
import { forgotPasswordSubmit } from '../amplify/auth';
import { parse } from 'query-string';
import { useLocation } from '@reach/router';

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

const ForgetPasswordSubmit = () => {

  const [form] = Form.useForm();

  const location = useLocation();
  let { email } = parse(location.search);
  console.log('url email', email);

  if (Array.isArray(email)) email = email[0];
  email;

  const [isLoading, setIsLoading] = useState(false);

  const onFinish = async (values: any) => {
    console.log('success: ', values);
    if (typeof email !== 'string') return;
    setIsLoading(true);
    const forgotPasswordRes = await forgotPasswordSubmit(
      email,
      values.code,
      values.password
    );
    setIsLoading(false);
    if (forgotPasswordRes.success) {
      message.success('Successfully rest password! Redirecting to Login');
      navigate('/login');
    }
    console.log('error in submit', forgotPasswordRes.error);
    message.error(forgotPasswordRes.error.message);
  }

  const onFinishFailed = (errorInfo: any) => {
    console.log('failed', errorInfo);
  }

  return (
  <PageLayout>
    <CenteredDiv>
      <Form
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        layout="vertical"
      >
        <Form.Item
          label="Verification Code"
          name="code"
          rules={[
            {
              required: true,
              type: "string",
              min: 6,
              max: 6,
              message: 'Must be 6 digits'
            },
            {
              validator: (_, value) => {
                if (isNaN(value)) {
                  return Promise.reject('Only digits are allowed');
                }
                return Promise.resolve();
              }
            }
          ]}
        >
          <Input
            placeholder="6-digit verification code"
            type="string"
          />
        </Form.Item>
        <Form.Item
          name="password"
          label="New Password"
          rules={[
            {
              required: true,
              message: 'Please input your password!',
            },
          ]}
          hasFeedback
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          name="confirm"
          label="Confirm Password"
          dependencies={['password']}
          hasFeedback
          rules={[
            {
              required: true,
              message: 'Please confirm your password!',
            },
            ({ getFieldValue }) => ({
              validator(rule, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject('The two passwords that you entered do not match!');
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
        >
          <Button type="primary"
            loading={isLoading}
            htmlType="submit"
            className="verify-button"
            disabled={!email}
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
    </CenteredDiv>
  </PageLayout>
  );
}

export default ForgetPasswordSubmit;