import React, { Fragment, useState, useEffect } from 'react';

import { Form, Input, Button, Checkbox, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import { AuthPageLayout } from '../components';

import { gql, useQuery } from '@apollo/client';
import { navigate, Link } from 'gatsby';

import { currentAccountVar, passwordVar } from '../apollo/cache';
import { login, getAccountFromSession } from '../amplify/auth';

// const CenteredDiv = styled.div`
//   margin: 0 auto;
//   width: 50%;

//   .login-form {
//     max-width: 300px;
//   }
//   .login-form-forgot {
//     float: right;
//   }
//   .ant-col-rtl .login-form-forgot {
//     float: left;
//   }
//   .login-form-button {
//     width: 100%;
//   }
// `;

const Login = () => {

  const [form] = Form.useForm();

  const [isLoading, setIsLoading] = useState(false);
  const [passwordStatus, setPasswordStatus] = useState<
    "" | "error" | "success" | "warning" | "validating" | undefined
  >("");

  useEffect(() => {
    (async () => {
      const accountResponse = await getAccountFromSession();
      if (accountResponse?.account !== undefined) {
        const { accessToken, email, sub } = accountResponse.account;
        currentAccountVar({
          isLoggedIn: true,
          email,
          sub,
          accessToken
        });
        message.success('Already logged in. Redirecting to App');
        navigate('/app')
      }
    })()
  });

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  const onFinish = async (values: any) => {
    console.log('Success:', values);
    const { username, password } = values;
    setIsLoading(true);

    const loginResponse = await login(username, password);
    if (loginResponse.account !== undefined) {
      const { accessToken, email, sub} = loginResponse.account;
      currentAccountVar({
        isLoggedIn: true,
        accessToken,
        email,
        sub
      })
      
      navigate('/app');
    } else {
      const { error } = loginResponse;
      console.log('error logging in:', error);
      const code = error.code;
      switch (code) {
        case 'UserNotConfirmedException':
          alert('Your account is not verified, please confirm your account!');
          currentAccountVar({
            ...currentAccountVar(),
            email: username
          });
          passwordVar(password);
          navigate('/confirm-signup/');
          break;
        case 'NotAuthorizedException':
          setIsLoading(false);
          // setPasswordStatus('error');
          message.error('Wrong Username or Password');
          break;
        // case 'PasswordResetRequiredException':
        //   message.error(error.message)
        //   return true;
        default:
          message.error(error.message);
            return false;
      }
    }
  };

  return (
  <AuthPageLayout>
    <Form
      name="normal-login"
      className="login-form"
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <Form.Item
        name="username"
        rules={[{ required: true, message: 'Please input your Username or Email!' }]}
      >
        <Input
          prefix={<UserOutlined className="site-form-item-icon" />}
          placeholder="Username or Email"
        />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[{ required: true, message: 'Please input your Password!' }]}
        // hasFeedback={true}
        // validateStatus={passwordStatus}
      >
        <Input.Password
          prefix={<LockOutlined className="site-form-item-icon" />}
          type="password"
          placeholder="Password"
          name="password"
          // onChange={() => {
          //   if (passwordStatus === 'error') {
          //     setPasswordStatus('');
          //   }
          // }}
        />
      </Form.Item>
      <div
        css={{
          marginBottom: '10px'
        }}
      >
        <Link to="/forgot-password">Forgot Password?</Link>
      </div>

      {/* <Form.Item>
        <Form.Item name="remember" valuePropName="checked" noStyle>
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <a className="login-form-forgot" href="">
          Forgot password
        </a>
      </Form.Item> */}

      <Form.Item
        // help={passwordStatus}
      >
        <Button
          css={{
            width: '100%'
          }}
        type="primary" loading={isLoading} htmlType="submit" className="login-form-button">
          Log in
        </Button>
        Or <Link to="/signup">sign up now!</Link>
      </Form.Item>
    </Form>
  </AuthPageLayout>
  );
}

export default Login;