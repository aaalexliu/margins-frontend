import React, { useState } from 'react';
import {
  Form,
  Input,
  Button,
} from 'antd';
import { navigate } from '@reach/router';

import styled from '@emotion/styled';

import { signup } from "../amplify/auth";
import { currentAccountVar, passwordVar } from '../apollo/cache';
import { AuthPageLayout } from '../components';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

const CenteredSignup = styled.div`
  margin: 0 auto;
  width: 75%;
  max-width: 350px;
`;

// const formItemLayout = {
//   labelCol: {
//     xs: { span: 24 },
//     sm: { span: 8 },
//   },
//   wrapperCol: {
//     xs: { span: 24 },
//     sm: { span: 16 },
//   },
// };
// const tailFormItemLayout = {
//   wrapperCol: {
//     xs: {
//       span: 24,
//       offset: 0,
//     },
//     sm: {
//       span: 16,
//       offset: 8,
//     },
//   },
// };

const Signup = () => {
  const [form] = Form.useForm();

  const [isLoading, setIsLoading] = useState(false);

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };


  const onFinish = async (values: any) => {
    console.log('Received values of form: ', values);
    setIsLoading(true);
    const { email, password } = values;
    const signupResponse = await signup(email, password);
    if (signupResponse.success) {
      currentAccountVar({
        ...currentAccountVar(),
        email: email,
      });

      passwordVar(password);

      navigate('/confirm-signup');
    } else {
      const { error } = signupResponse;
      console.log('error signing up:', error);
      const code = error.code;
      switch (code) {
        case 'UsernameExistsException':
          alert('User already exists, please Login!');
          navigate('/login');
      }
    }
  };

  return (
  <AuthPageLayout>
      <Form
        // {...formItemLayout}
        layout='vertical'
        form={form}
        name="register"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        scrollToFirstError
        className="signup-form"
      >
        <Form.Item
          name="email"
          rules={[
            {
              type: 'email',
              message: 'The input is not a valid E-mail!',
            },
            {
              required: true,
              message: 'Please input your E-mail!',
            },
          ]}
        >
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="Email"
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              type: 'string',
              min: 8,
              message: 'Password must have a minimum of 8 characters'
            },
          ]}
          hasFeedback
        >
          <Input.Password
            prefix={<LockOutlined className="site-form-item-icon" />}
            placeholder="Password. At least 8 characters"
          />
        </Form.Item>
        <Form.Item
          // {...tailFormItemLayout}
        >
          <Button
            type="primary"
            htmlType="submit"
            loading={isLoading}
            css={{
              width: '100%'
            }}
            >
            Register
          </Button>
        </Form.Item>
      </Form>
  </AuthPageLayout>
  );
};

export default Signup;