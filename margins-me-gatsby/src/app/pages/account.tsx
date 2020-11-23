import React, { useState } from 'react';
import styled from '@emotion/styled';
import { Typography, List, Card, Button, Input, Form, Modal, message } from 'antd';
import { BookOutlined, TagOutlined, ContactsOutlined } from '@ant-design/icons';
import { RouteComponentProps } from '@reach/router';
import { Link } from 'gatsby';
import { currentAccountVar } from '../../apollo/cache';
import { useQuery } from '@apollo/client';
import { changePassword } from '../../amplify/auth';


const { Title, Text, Paragraph } = Typography;

const Account: React.FC<RouteComponentProps> = () => {

  const [ changingPassword, setChangingPassword ] = useState(false);
  const [ form ] = Form.useForm();
  
  const onOkChangePassword = async () => {
    setChangingPassword(false);
    const values = await form.validateFields();
    console.log('change password values:\n', values);
    const res = await changePassword(values.oldPassword, values.newPassword);
    if (res.success != null) {
      message.success('Successfully changed password');
    } else {
      console.log(res.error);
      if (res.error.code === 'NotAuthorizedException') {
        message.error('Old Password is Incorrect');
        return;
      }
      message.error(res.error.message);
    }
  }
  
  return (
    <div
      css={{
        display: 'flex',
        justifyContent: 'center',
        width: '100%'
      }}
    >
      <div
        css={{
          display: 'flex',
          flexDirection: 'column',
          width: '80%',
          maxWidth: '700px',
          alignItems: 'center'
        }}
      >
        <Title level={3} >Account Settings</Title>
        <br />
        <List
          header={<h3>Profile</h3>}
          css={{
            width: '100%',
            // backgroundColor: 'white'
          }}
          itemLayout='vertical'

        >
            <List.Item>
              <Card>
                <div
                  css={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 2fr',
                    // gridAutoRows: '40px',
                    alignItems: 'center'
                  }}
                >
                  <strong>
                    Email
                  </strong>
                  <div>
                    {currentAccountVar().email}
                  </div>
                  <strong>
                    Password
                  </strong>
                  <div>
                      ********
                      <Button type='link'
                        onClick={() => setChangingPassword(true)}
                      >
                        Change Password
                      </Button>
                      <Modal
                        title="Change Password"
                        visible={changingPassword}
                        onCancel={() => setChangingPassword(false)}
                        onOk={onOkChangePassword}
                      >
                        <Form
                          layout="vertical"
                          name="changePassword"
                          form={form}
                        >
                          <Form.Item
                            name="oldPassword"
                            rules={[{
                              required: true,
                              message: 'Please enter your old password!'
                            }]}
                          >
                            <Input.Password
                              placeholder="Old Password"
                            />
                          </Form.Item>
                          <Form.Item
                            name="newPassword"
                            rules={[{
                              required: true,
                              type: 'string',
                              min: 8,
                              message: 'Password must have a minimum of 8 characters'
                            }]}
                          >
                            <Input.Password
                              placeholder="New Password"
                            />
                          </Form.Item>
                        </Form>
                      </Modal>
                  </div>
                </div>
              </Card> 
            </List.Item>
        </List>
      </div>
    </div>
  )
}

export default Account;