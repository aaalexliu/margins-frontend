import React, { Fragment, useState } from 'react';
import { useParams, RouteComponentProps } from '@reach/router';
import { useQuery, gql } from '@apollo/client';
import { PublicationCard, AnnotationContent, AnnotationAndPublicationCard } from '../containers';
import { Loading, SectionsSidebar } from '../components';
import { Layout, Typography, Card, Affix, Form, Button, Statistic, Modal, Divider } from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';

import {
  GetAllAnnotationsForTagDocument,
  AnnotationAndPublicationFragment,
  GetTagByTagIdDocument
} from '../__generated__/graphql-types';

const { Content } = Layout;
const { Text, Paragraph, Title } = Typography;

const TagAnnotations: React.FC<RouteComponentProps> = () => {

  const { tagId } = useParams();
  const [ loadingMore, setIsLoadingMore ] = useState(false);

  const {
    data,
    loading,
    error,
    fetchMore
  } = useQuery(
    GetAllAnnotationsForTagDocument,
    {
      variables: {
        tagId,
        first: 5
      }
    }
  );

  const {
    data: tagData,
    loading: tagLoading,
    error: tagError
  } = useQuery(GetTagByTagIdDocument, 
    {
      variables: {
        tagId,
      }
    });

  const tag = tagData?.tagByTagId;

  if (loading) return <Loading />;
  if (error || !data) return <p>ERROR</p>;

  const totalCount = data.allAnnotationTags?.totalCount;
  const annotationEdges = data?.allAnnotationTags?.edges;
  if ( annotationEdges === undefined ) return <p>No annotations exist</p>;

  const annotationWithPublications = annotationEdges.map(edge => edge.node?.annotationByAnnotationId).filter(
    (node): node is AnnotationAndPublicationFragment => node !== null)

  // if (annotations == null) return 


  const hasMore = data.allAnnotationTags?.pageInfo.hasNextPage;
  const endCursor = data.allAnnotationTags?.pageInfo.endCursor;

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
          width: '80%',
          maxWidth: '700px'
        }}
      >
        { tag ?
          <Title level={3}>Tag: {tag?.tagName} ({tag?.annotationTagsByTagId.totalCount})</Title>
          : <Title></Title>
        }
        <div css={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          // width: '100%'
          '& div.infinite-scroll-component__outerdiv': {
            width: '100%'
          }
        }}>

          <InfiniteScroll
            dataLength={annotationWithPublications.length}
            hasMore={!!hasMore}
            next={() => {
              fetchMore({
                variables: {
                  after: endCursor,
                  first: 5
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
          >
            { annotationWithPublications ?
              annotationWithPublications.map(annotation => {
                return (
                <div
                  css={{
                    marginBottom: '10px',
                    width: '100%'
                  }}
                  key={annotation.id}
                >
                  <AnnotationAndPublicationCard id={annotation.id}/>
                </div>
                )
              })
              :
              <p>No Annotations Found</p>
            }
          </InfiniteScroll>
        </div>


        {/* <UnstyledList>
        { annotationWithPublications ?
          annotationWithPublications.map(annotation => {
            return (
            <PaddedListItem key={annotation.id}>
              <AnnotationAndPublicationCard id={annotation.id}/>
            </PaddedListItem>
            )
          })
          :
          <p>No Annotations Found</p>
        }
        </UnstyledList> */}
      </div>
    </div>
  )
}

export default TagAnnotations;