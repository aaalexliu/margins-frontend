import React, { Fragment } from 'react';
import { Layout, Menu } from 'antd';
import { Link } from 'react-router-dom';

import styled from '@emotion/styled';

const { Header, Content, Footer } = Layout;

const RightAlignedMenuItems = styled.div`
  margin-left: auto;
`;

export default function PageLayout (props: any) {
  return (
    <Layout className="layout">
      <Header>
        <Menu mode="horizontal">
            <Menu.Item>
              <Link to="/">Home</Link>
            </Menu.Item>
            <Menu.Item>
              <Link to ="/login">
                Login
              </Link>
            </Menu.Item>
        </Menu>
      </Header>
      <Content>
        {props.children}
      </Content>
      <Footer>
        Margins Me ©2020
      </Footer>
    </Layout>
  );
}


// ReactDOM.render(
//   <Layout className="layout">
//     <Header>
//       <div className="logo" />
//       <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>
//         <Menu.Item key="1">nav 1</Menu.Item>
//         <Menu.Item key="2">nav 2</Menu.Item>
//         <Menu.Item key="3">nav 3</Menu.Item>
//       </Menu>
//     </Header>
//     <Content style={{ padding: '0 50px' }}>
//       <Breadcrumb style={{ margin: '16px 0' }}>
//         <Breadcrumb.Item>Home</Breadcrumb.Item>
//         <Breadcrumb.Item>List</Breadcrumb.Item>
//         <Breadcrumb.Item>App</Breadcrumb.Item>
//       </Breadcrumb>
//       <div className="site-layout-content">Content</div>
//     </Content>
//     <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
//   </Layout>,
//   mountNode,
// );