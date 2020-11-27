import React, { useState } from 'react';
import { navigate } from '@reach/router';
import { Form, Input, Button } from 'antd';
import { AuthPageLayout } from '../components';

import { confirmSignup } from '../amplify/auth';
import { currentAccountVar, passwordVar } from '../apollo/cache';

import styled from '@emotion/styled';

const CenteredDiv = styled.div`
  margin: 0 auto;
  width: 75%;
  max-width: 250px;

  .verify-button {
    width: 100%;
  }
`;

const ConfirmSignup = () => {

  const [isLoading, setIsLoading] = useState(false);

  const email = currentAccountVar().email;

  const onFinish = async (values: any) => {
    console.log('success: ', values);
    setIsLoading(true);
    const signupConfirmResponse = await confirmSignup(
      email,
      passwordVar(),
      values.code
    );
    if (signupConfirmResponse.account !== undefined) {
      const account = signupConfirmResponse.account;
      console.log(account);
      //clear passwordVar after confirming and signing in
      passwordVar('');
      navigate('/app');
    } else {
      console.log(signupConfirmResponse.error);
      setIsLoading(false);
    }
  }

  const onFinishFailed = (errorInfo: any) => {
    console.log('failed', errorInfo);
  }

  return (
  <AuthPageLayout>
    <Form
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <Form.Item
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
      <Form.Item>
        <Button type="primary" loading={isLoading} htmlType="submit"
          css={{
            width: '100%'
          }}
        >
          Verify
        </Button>
      </Form.Item>
    </Form>
  </AuthPageLayout>
  );
};

export default ConfirmSignup;