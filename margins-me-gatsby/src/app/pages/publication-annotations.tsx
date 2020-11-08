import React, { useState } from 'react';
import { useParams, RouteComponentProps } from '@reach/router';
import { useQuery, gql } from '@apollo/client';
import { PublicationCard, AnnotationCard } from '../containers';
import { Loading } from '../components';
import { Layout, Typography, Card, Affix, Menu } from 'antd';
import styled from '@emotion/styled';
import { ANNOTATION_ALL_FRAGMENT, extractAnnotationAll } from '../utils/annotation-all';
import * as GetAllAnnotationsForPublicationTypes from './__generated__/GetAllAnnotationsForPublication';
import { stripIgnoredCharacters } from 'graphql';

const { Header, Content, Footer, Sider } = Layout;
const { Title } = Typography;

const PaddedListItem = styled.li`
  padding-top: 10px;
`;

const UnstyledList = styled.ul`
  list-style: none;
  outline: none;
  padding: 0;
`;

const H3NoMargins = styled.h3`
  margin: 0;
`;

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
    ) : null;

  let annotationList;
  if (annotations == null) return <p>No annotations exist</p>;

  let lastSection = '';
  let sectionCount = 0;
  const sections: any= [];
  let annotationsWithLocations = annotations.flatMap(annotation => {
    const { highlightLocation, noteLocation } = extractAnnotationAll(annotation);
    const location = highlightLocation ? highlightLocation : noteLocation;
    // console.log(location);
    // console.log(location.section);
    // console.log(location.section != null);
    // console.log(location.section !== lastSection);
    if (location.section !=  null && location.section !== lastSection) {
      lastSection = location.section;
      sectionCount++;
      // console.log(lastSection);
      const ref = React.createRef<HTMLLIElement>();
      const section = {sectionId: `section-${sectionCount}-${lastSection}`, sectionName: lastSection, ref};
      sections.push(section);
      return [ section, annotation];
    } else {
      return [annotation];
    }
  });

  const sectionMenuItems = sections.map(section => {
    const clickHandler = (ref: any) => {
      ref.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'start'
      })
    }
    return (
      <Menu.Item key={section.sectionId} onClick={() => clickHandler(section.ref)}>
        {section.sectionName}
      </Menu.Item>
    )
  });

  const [ topElement, setTopElement ] = useState(['']);
  const sectionSider = sectionMenuItems.length > 0 ?
  <Affix offsetTop={0}>
    <Sider
      style={{
        overflow: 'auto',
        height: '100vh',
        // position: 'fixed',
        // left: 0,
      }}
      theme="light"
    >
      <Menu theme="light" selectedKeys={[topElement.slice(-1)[0]]}>
        {sectionMenuItems}
      </Menu>
    </Sider>
    </Affix>:
    null;
  
  // console.log(annotationsWithLocations);
  const annotationsLocationsList = annotationsWithLocations.map(item => {
    if("sectionId" in item)  {
      // const scrollHandler = () => {
      //   console.log('yelloooo');
      //   const scrollY  = window.scrollY;
      //   console.log(`on scroll ${item.sectionName} location: ${scrollY}`);
      // }
      const [ hideAffixed, setHideAffixed] = useState(false);
      const handleAffixChange = (affixed: any) => {
        if (affixed) {
          setHideAffixed(true);
          setTopElement(topElement.concat(item.sectionId));
        };
        if (!affixed) {
          setHideAffixed(false);
          setTopElement(topElement.slice(0, -1));
        }
      }
      return (
      <PaddedListItem key={item.sectionId} ref={item.ref}>
        <Affix offsetTop={0} onChange={handleAffixChange}>
          {hideAffixed ? null:
          <Card size="small"><H3NoMargins>{item.sectionName}</H3NoMargins></Card>}
        </Affix>
      </PaddedListItem>
      )
    } else {
      return(
      <PaddedListItem key={item.annotationId}>
        <AnnotationCard annotationId={item.annotationId} />
      </PaddedListItem>
      )
    }
  });


  // annotationList = annotations.map(annotation => {
  //   return (
  //   <PaddedListItem key={annotation.id}>
  //     <AnnotationCard annotationId={annotation.annotationId} />
  //   </PaddedListItem>
  //   );
  // });

  return (
    <Layout>
      {sectionSider}
      <Content>
        <PublicationCard publicationId={publicationId} />
        <UnstyledList>
        {annotationsLocationsList ? annotationsLocationsList :
          <p>No Annotations Found</p>}
        </UnstyledList>
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