import React, { Fragment } from 'react';
import { useParams, RouteComponentProps } from '@reach/router';
import { useQuery, gql } from '@apollo/client';
import { PublicationCard, AnnotationCard } from '../containers';
import { Loading } from '../components';
import { Layout } from 'antd';
import { ANNOTATION_ALL_FRAGMENT } from '../utils/annotation-all';
import * as GetAllAnnotationsForPublicationTypes from './__generated__/GetAllAnnotationsForPublication';

const { Header, Content, Footer, Sider } = Layout;

export const GET_ALL_ANNOTATIONS_FOR_PUBLICATION = gql`
  query GetAllAnnotationsForPublication($publicationId: String!, $first: Int, $afterCursor: Cursor){
    allAnnotations(condition: {publicationId: $publicationId}, first: $first, after: $afterCursor) {
      edges {
        cursor
        node {
          ...AnnotationAll
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
  ${ANNOTATION_ALL_FRAGMENT}
`;

const PublicationAnnotations: React.FC<RouteComponentProps> = () => {

  const { publicationId } = useParams();

  const {
    data,
    loading,
    error,
    fetchMore
  } = useQuery<
    GetAllAnnotationsForPublicationTypes.GetAllAnnotationsForPublication,
    GetAllAnnotationsForPublicationTypes.GetAllAnnotationsForPublicationVariables
  >(
    GET_ALL_ANNOTATIONS_FOR_PUBLICATION,
    {
      variables: {
        publicationId,
        first: 100
      }
    }
  );

  if (loading) return <Loading />;
  if (error || !data) return <p>ERROR</p>;

  const annotationNodes = data?.allAnnotations?.edges.map(edge => edge.node);
  const annotations = annotationNodes ?
    annotationNodes.filter(
      (node): node is GetAllAnnotationsForPublicationTypes.GetAllAnnotationsForPublication_allAnnotations_edges_node => node !== null
    ) :
    undefined;

  let annotationList;
  if (annotations !== undefined) {
    annotationList = annotations?.map(annotation => {
      return <AnnotationCard key={annotation.id} annotationId={annotation.annotationId} />
    });
  }

  return (
    <Fragment>
      <PublicationCard publicationId={publicationId} />
      {annotationList ? annotationList :
        <p>No Annotations Found</p>}
    </Fragment>
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