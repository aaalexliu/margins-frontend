import React, { Fragment, useState } from 'react';

import { Form, Input, Button, Checkbox } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';

import { Auth } from 'aws-amplify';
import { isLoggedInVar } from '../cache';
import { gql, useQuery } from '@apollo/client';


const onFinish = async (values: any) => {
  console.log('Success:', values);
  const { username, password } = values;
  try {
    const user = await Auth.signIn(username, password);
    console.log('logged in');
    const userInfo = await Auth.currentSession();
    console.log(userInfo);
  } catch (error) {
    console.log(error);
  }
};

const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo);
};

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

export default function LoginForm() {

  const IS_LOGGED_IN = gql`
  query IsUserLoggedIn {
    isLoggedIn @client
  }
`;

  const { data } = useQuery(IS_LOGGED_IN);
  console.log(data);

  const [form] = Form.useForm();

  return (
    <CenteredDiv>
      <Form
        name="normal-login"
        className="login-form"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          name="username"
          rules={[{ required: true, message: 'Please input your Username!' }]}
        >
          <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Please input your Password!' }]}
        >
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Password"
          />
        </Form.Item>
        <Form.Item>
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <a className="login-form-forgot" href="">
            Forgot password
          </a>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" className="login-form-button">
            Log in
          </Button>
          Or <a href="">register now!</a>
        </Form.Item>
      </Form>
    </CenteredDiv>
  );
}
