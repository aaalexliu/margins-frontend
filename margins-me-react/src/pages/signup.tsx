import React, { useState } from 'react';
import {
  Form,
  Input,
  Button,
} from 'antd';
import { useNavigate } from 'react-router-dom';

import styled from '@emotion/styled';

import { Auth } from 'aws-amplify';

const CenteredSignup = styled.div`
  margin: 0 auto;
  width: 75%;
  max-width: 500px;
`;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

const Signup = () => {
  const [form] = Form.useForm();

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };


  const onFinish = async (values: any) => {
    console.log('Received values of form: ', values);
    setIsLoading(true);
    try {
      const { user } = await Auth.signUp({
        username: values.email,
        password: values.password
      });
      console.log(user);

      navigate('/confirm-signup');
    } catch(error) {
      console.log('error signing up:', error);
      setIsLoading(false);
    }
  };

  return (
    <CenteredSignup>
      <Form
        {...formItemLayout}
        form={form}
        name="register"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        scrollToFirstError
        className="signup-form"
      >
        <Form.Item
          name="email"
          label="E-mail"
          rules={[
            {
              type: 'email',
              message: 'The input is not valid E-mail!',
            },
            {
              required: true,
              message: 'Please input your E-mail!',
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
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

        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit" loading={isLoading}>
            Register
          </Button>
        </Form.Item>
      </Form>
    </CenteredSignup>
  );
};

export default Signup;