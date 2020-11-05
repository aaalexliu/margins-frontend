import React, { Fragment } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, gql } from '@apollo/client';
import { PublicationCard } from '../containers';
import { Layout } from 'antd';

const { Header, Content, Footer, Sider } = Layout;

export const ANNOTATION_FRAGMENT = gql`
  fragment Annotation
`;

export const GET_ALL_ANNOTATIONS_FOR_PUBLICATION = gql`
  query GetAllAnnotationsForPublication($publicationId: String!, $first: Int, $afterCursor: Cursor){
  allAnnotations(condition: {publicationId: $publicationId}, first: $first, after: $afterCursor) {
    edges {
      cursor
      node {
        annotationId
        color
        createdAt
        editedHighlightText
        editedNoteText
        extraEdits
        highlightLocation
        highlightText
        noteLocation
        noteText
        publicationId
        recordedAt
        updatedAt
      }
    }
    totalCount
    pageInfo {
      endCursor
      hasNextPage
      hasPreviousPage
      startCursor
    }
  }
}

`;

const PublicationAnnotations = () => {

  const { publicationId } = useParams();

  return (
    <Layout>
      <Content>
        <PublicationCard publicationId={publicationId} />
      </Content>
    </Layout>
  )
}

export default PublicationAnnotations;

// sample layout code from antd
// <Layout className="site-layout-background" style={{ padding: '24px 0' }}>
//   <Sider className="site-layout-background" width={200}>
//     <Menu
//       mode="inline"
//       defaultSelectedKeys={['1']}
//       defaultOpenKeys={['sub1']}
//       style={{ height: '100%' }}
//     >
//       <SubMenu key="sub1" icon={<UserOutlined />} title="subnav 1">
//         <Menu.Item key="1">option1</Menu.Item>
//         <Menu.Item key="2">option2</Menu.Item>
//         <Menu.Item key="3">option3</Menu.Item>
//         <Menu.Item key="4">option4</Menu.Item>
//       </SubMenu>
//       <SubMenu key="sub2" icon={<LaptopOutlined />} title="subnav 2">
//         <Menu.Item key="5">option5</Menu.Item>
//         <Menu.Item key="6">option6</Menu.Item>
//         <Menu.Item key="7">option7</Menu.Item>
//         <Menu.Item key="8">option8</Menu.Item>
//       </SubMenu>
//       <SubMenu key="sub3" icon={<NotificationOutlined />} title="subnav 3">
//         <Menu.Item key="9">option9</Menu.Item>
//         <Menu.Item key="10">option10</Menu.Item>
//         <Menu.Item key="11">option11</Menu.Item>
//         <Menu.Item key="12">option12</Menu.Item>
//       </SubMenu>
//     </Menu>
//   </Sider>
//   <Content style={{ padding: '0 24px', minHeight: 280 }}>Content</Content>
// </Layout>