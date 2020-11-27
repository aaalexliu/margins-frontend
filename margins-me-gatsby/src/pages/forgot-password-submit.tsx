import React, { Fragment, useState } from 'react';

import { Form, Input, Button, Checkbox, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import { AuthPageLayout } from '../components';

import { navigate } from 'gatsby';

import { currentAccountVar, passwordVar } from '../apollo/cache';
import { forgotPasswordSubmit } from '../amplify/auth';
import { parse } from 'query-string';
import { useLocation } from '@reach/router';

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
  <AuthPageLayout>
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
            css={{
              width: '100%'
            }}
          >
            Submit
          </Button>
        </Form.Item>
      </Form>

  </AuthPageLayout>
  );
}

export default ForgetPasswordSubmit;