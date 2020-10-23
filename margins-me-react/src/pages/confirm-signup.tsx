import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { Form, Input, Button } from 'antd';

import { Auth } from 'aws-amplify';
import { currentAccountVar, passwordVar } from '../cache';
import { useQuery, gql } from '@apollo/client';

import styled from '@emotion/styled';

const CenteredDiv = styled.div`
  margin: 0 auto;
  width: 75%;
  max-width: 250px;

  .verify-button {
    width: 100%;
  }
`;

const CURRENT_EMAIL = gql`
  query getCurrentEmail {
    currentAccount @client {
      email
    }
  }
`;

const ConfirmSignup = () => {

  const navigate = useNavigate();
  const { data } = useQuery(CURRENT_EMAIL);

  const email = data.currentAccount.email;

  const onFinish = async (values: any) => {
    console.log('success: ', values);
    try {
      const success = await Auth.confirmSignUp(
        email,
        values.code
      );
      console.log(success);
      const user = await Auth.signIn(email, passwordVar());
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
    } catch(error) {
      console.log(error);
    }
  }


  const onFinishFailed = (errorInfo: any) => {
    console.log('failed', errorInfo);
  }

  return (
    <CenteredDiv>
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
          <Button type="primary" htmlType="submit" className="verify-button">
            Verify
          </Button>
        </Form.Item>
      </Form>
    </CenteredDiv>
  );
};

export default ConfirmSignup;