import React, { useState } from 'react';
import { useParams, RouteComponentProps } from '@reach/router';
import { useQuery, gql } from '@apollo/client';
import { PublicationCard, AnnotationCard } from '../containers';
import { Loading, SectionsSidebar } from '../components';
import { Layout, Typography, Card, Affix, Menu, Button, Statistic } from 'antd';
import styled from '@emotion/styled';
// import css from '@emotion/core';
import { ANNOTATION_ALL_FRAGMENT, extractAnnotationAll } from '../utils/annotation-all';
import * as GetAllAnnotationsForPublicationTypes from './__generated__/GetAllAnnotationsForPublication';
import { Section, extractAnnotationSections } from '../utils/annotation-sections';

const { Content } = Layout;

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

interface SectionCardProps {
  section: Section<HTMLLIElement>,
  sectionStack: string[],
  setSectionStack: React.Dispatch<React.SetStateAction<string[]>>
}

const SectionCard: React.FC<SectionCardProps> =
  ({section, sectionStack, setSectionStack}) => {

  const [ hideCard, setHideCard] = useState(false);

  const handleAffixChange = (affixed: boolean | undefined) => {
    if (affixed) {
      setHideCard(true);
      setSectionStack(sectionStack.concat(section.sectionId));
    };
    if (!affixed) {
      setHideCard(false);
      setSectionStack(sectionStack.slice(0, -1));
    }
  }

  return (
    <Affix offsetTop={-40} onChange={handleAffixChange}>
      {hideCard ? null:
      <Card size="small"><H3NoMargins>{section.name}</H3NoMargins></Card>}
    </Affix>
  )
}

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
  const [ sectionStack, setSectionStack ] = useState(['']);
  const [ loadingMore, setIsLoadingMore ] = useState(false);

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
        first: 50
      }
    }
  );

  if (loading) return <Loading />;
  if (error || !data) return <p>ERROR</p>;

  const totalCount = data.allAnnotations?.totalCount;
  const annotationEdges = data?.allAnnotations?.edges;
  if ( annotationEdges === undefined ) return <p>No annotations exist</p>;

  const annotations = annotationEdges.map(edge => edge.node).filter(
    (node): node is GetAllAnnotationsForPublicationTypes.GetAllAnnotationsForPublication_allAnnotations_edges_node => node !== null)

  // if (annotations == null) return 

  const {annotationsAndSections, sections } = extractAnnotationSections(annotations);
  
  console.log(annotationsAndSections);
  console.log(sections);
  const annotationsAndSectionsList = annotationsAndSections.map(item => {
    if("sectionId" in item)  {
      return (
      <PaddedListItem key={item.sectionId} ref={item.ref}>
        <SectionCard section={item} sectionStack={sectionStack} setSectionStack={setSectionStack}/>
      </PaddedListItem>
      )
    } else {
      return(
      <PaddedListItem key={item.annotationId}>
        <AnnotationCard id={item.id} />
      </PaddedListItem>
      )
    }
  });

  const hasMore = data.allAnnotations?.pageInfo.hasNextPage;
  
  const fetch50More = 
    <Button
      type="primary"
      onClick={async () => {
        setIsLoadingMore(true);
        await fetchMore({
          variables: {
            afterCursor: annotationEdges.slice(-1)[0].cursor,
            first: 50
          },
        });
        setIsLoadingMore(false);
      }}
      loading={loadingMore}
      disabled={!hasMore}
    >
      Next 50
    </Button>;
  
  const fetchAll = 
  <Button
    type="default"
    onClick={async () => {
    setIsLoadingMore(true);
    await fetchMore({
      variables: {
        afterCursor: annotationEdges.slice(-1)[0].cursor,
        first: totalCount ? totalCount - annotations.length : 100
      },
    });
    setIsLoadingMore(false);
  }}
  loading={loadingMore}
  disabled={!hasMore}
>
  Remaining {totalCount ? totalCount - annotations.length : ''}
</Button>;

  return (
    <Layout>
      <SectionsSidebar sections={sections} sectionStack={sectionStack}/>
      <Layout>
      <Content>
        <PublicationCard publicationId={publicationId} />
        <Card>
          <div
            css={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%'
              // marginLeft: 'auto'
            }}
          >
          <Statistic
            title="Loaded Annotations"
            value={annotations.length}
            suffix={`/ ${totalCount}`}
          />

          {/* {`Loaded ${annotations.length} out of ${data.allAnnotations?.totalCount}`} */}
          <div>
          {fetch50More} {fetchAll}
          </div>
          </div>
        </Card>
        <UnstyledList>
        {annotationsAndSectionsList ? annotationsAndSectionsList :
          <p>No Annotations Found</p>}
        </UnstyledList>
      </Content>
      </Layout>
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