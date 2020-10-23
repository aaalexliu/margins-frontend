import React, { Fragment, useState } from 'react';

import { Form, Input, Button, Checkbox } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';

import { Auth } from 'aws-amplify';
import { CognitoUser } from '@aws-amplify/auth';
import { currentAccountVar } from '../cache';
import { gql, useQuery } from '@apollo/client';
import { useNavigate, Link } from 'react-router-dom';

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

const Login = () => {

  const [form] = Form.useForm();

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  const onFinish = async (values: any) => {
    console.log('Success:', values);
    const { username, password } = values;
    setLoading(true);
    try {
      const user: CognitoUser = await Auth.signIn(username, password);
      setLoading(false);
      const userSession = user.getSignInUserSession();
      if (!userSession) throw new Error('sign in session null');
      const accessToken = userSession.getAccessToken().getJwtToken();

      const { attributes } = await Auth.currentAuthenticatedUser();

      currentAccountVar({
        isLoggedIn: true,
        accessToken,
        email: attributes.email,
        sub: attributes.sub
      });
      
      navigate('/');
      console.log('logged in');
    } catch (error) {
      console.log(error);
    }
  };


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
          <Button type="primary" loading={loading} htmlType="submit" className="login-form-button">
            Log in
          </Button>
          Or <Link to="/signup">sign up now!</Link>
        </Form.Item>
      </Form>
    </CenteredDiv>
  );
}

export default Login;