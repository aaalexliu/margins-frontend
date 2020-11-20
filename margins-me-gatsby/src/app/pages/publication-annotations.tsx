import React, { useState } from 'react';
import { useParams, RouteComponentProps } from '@reach/router';
import { useQuery, gql } from '@apollo/client';
import { PublicationCard, AnnotationCard, CreateAnnotationModal } from '../containers';
import { Loading, SectionsSidebar } from '../components';
import { Layout, Typography, Card, Affix, Form, Button, Statistic, Modal } from 'antd';
import styled from '@emotion/styled';
// import css from '@emotion/core';
import { ANNOTATION_ALL_FRAGMENT, extractAnnotationAll } from '../utils/annotation-all';
import * as GetAllAnnotationsForPublicationTypes from './__generated__/GetAllAnnotationsForPublication';
import { Section, extractAnnotationSections } from '../utils/annotation-sections';
import { GetAllTagsDocument } from '../__generated__/graphql-types';
import InfiniteScroll from 'react-infinite-scroll-component';

const { Content } = Layout;
const { Text, Paragraph } = Typography;

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
  section: Section<HTMLDivElement>,
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
    <Affix offsetTop={-45} onChange={handleAffixChange}>
      {/* {hideCard ? null:
      <Card size="small"><H3NoMargins>{section.name}</H3NoMargins></Card>} */}
      <Card size="small"><H3NoMargins>{section.name}</H3NoMargins></Card>
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
  const [ modalVisible, setModalVisible ] = useState(false);
  const [form] = Form.useForm();


  //this is mainly to load all tags into cache.
  let {
    data: tagData,
    error: tagError
  } = useQuery(GetAllTagsDocument);

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
      <div
        key={item.sectionId}
        ref={item.ref}
        css={{
          marginBottom: '10px',
          width: '100%'
        }}
      >
        <SectionCard section={item} sectionStack={sectionStack} setSectionStack={setSectionStack}/>
      </div>
      )
    } else {
      return(
      <div
        key={item.annotationId}
        css={{
          marginBottom: '10px',
          width: '100%'
        }}
      >
        <AnnotationCard id={item.id} />
      </div>
      )
    }
  });

  const hasMore = data.allAnnotations?.pageInfo.hasNextPage;
  const endCursor = data.allAnnotations?.pageInfo.endCursor;
  
  // const fetch50More = 
  //   <Button
  //     type="primary"
  //     onClick={async () => {
  //       setIsLoadingMore(true);
  //       await fetchMore({
  //         variables: {
  //           afterCursor: annotationEdges.slice(-1)[0].cursor,
  //           first: 50
  //         },
  //       });
  //       setIsLoadingMore(false);
  //     }}
  //     loading={loadingMore}
  //     disabled={!hasMore}
  //   >
  //     50
  //   </Button>;
  
  const fetchAll = 
  <Button
    type="default"
    onClick={async () => {
    setIsLoadingMore(true);
    await fetchMore({
      variables: {
        // afterCursor: annotationEdges.slice(-1)[0].cursor,
        afterCursor: endCursor,
        first: totalCount ? totalCount - annotations.length : 100
      },
    });
    setIsLoadingMore(false);
  }}
  loading={loadingMore}
  disabled={!hasMore}
>
  {/* {totalCount ? totalCount - annotations.length : ''} */}
  Load All
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
          <Button type="primary" onClick={() => setModalVisible(true)}>
            New Annotation
          </Button>
          <CreateAnnotationModal
            visible={modalVisible}
            publicationId={publicationId}
            onCreate={(data) => {
              console.log('boomshakalaka');
              console.log(data);
              setModalVisible(false);
            }}
            onCancel={() => setModalVisible(false)}
          />

          <div>
            {fetchAll}
          </div>
          <Statistic
            title="Loaded Annotations"
            value={annotations.length}
            suffix={`/ ${totalCount}`}
          />

          </div>
        </Card>
        <div
          css={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            '& div:first-child': {
              width: '100%'
            }
          }}
        >
          <InfiniteScroll
            dataLength={annotations.length}
            hasMore={!!hasMore}
            next={() => {
              fetchMore({
                variables: {
                  after: endCursor,
                  first: 50
                }
              })
            }}
            loader={<Loading />}
            endMessage={
              <Paragraph css={{
                textAlign: 'center',
                width: '100%'
              }}
              strong={true}>
                Loaded All
              </Paragraph>
            }
            css={{
              width: '100%'
            }}
          >
          {annotationsAndSectionsList ? annotationsAndSectionsList :
            <p>No Annotations Found</p>}
          </InfiniteScroll>
        </div>
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