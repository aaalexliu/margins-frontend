import React, { useState } from 'react';

import { Form, Input, Button } from 'antd';

import { Auth } from 'aws-amplify';
import { currentAccountVar } from '../cache';
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

  const { data } = useQuery(CURRENT_EMAIL);

  const email = data.currentAccount.email;

  const onFinish = async (values: any) => {
    console.log('success: ', values);
    const success = await Auth.confirmSignUp(
      email,
      values.code
    );
    console.log(success);
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