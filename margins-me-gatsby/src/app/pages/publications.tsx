import React, { Fragment } from 'react';
import { useQuery, gql } from '@apollo/client';
import { RouteComponentProps } from '@reach/router';

import {
  PublicationsOrderBy,
  GetAllPublicationsDocument,
  PublicationAuthorAnnotationCountFragment
} from '../__generated__/graphql-types';
import { Typography, List } from 'antd';
import { PublicationListItem, Loading } from '../components';
import { PublicationCard } from '../containers';
import { css } from '@emotion/core';
import styled from '@emotion/styled';

const { Title } = Typography;

// const CenteredFlex = styled.div`
//   display: flex;
//   width: 100%;
//   flex-wrap: wrap;
//   justify-content: center;
//   align-items: stretch;
//   &::after {
//     content: "";
//     flex: auto;
//   }
// `;

export const GET_ALL_PUBLICATIONS = gql`
  query GetAllPublications($orderBy: [PublicationsOrderBy!], $first: Int, $afterCursor: Cursor) {
    allPublications(orderBy: $orderBy, first: $first, after: $afterCursor) {
      totalCount
      pageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
      }
      edges {
        cursor
        node {
          ...PublicationAuthorAnnotationCount
        }
      }
    }
  }
`;

const Publications: React.FC<RouteComponentProps> = () => {
  // const [bookTrips, { data }] = useMutation<
  //   BookTripsTypes.BookTrips,
  //   BookTripsTypes.BookTripsVariables
  // >(
  //   BOOK_TRIPS,
  //   {
  //     variables: { launchIds: cartItems },
  //   }
  // );
  const {
    data,
    loading,
    error,
    fetchMore
  } = useQuery(
    GetAllPublicationsDocument,
    {
      variables: {
        first: 10,
        orderBy: [PublicationsOrderBy.PublicationIdDesc]
      }
    }
  );

  if (loading) return <Loading />;
  if (error || !data) return <p>ERROR</p>;

  const nodes = data?.allPublications?.edges.map(edge => edge.node);

  const publications = nodes ? 
    nodes.filter(
      (node): node is PublicationAuthorAnnotationCountFragment => node !== null
    )
    :
    [];

  return(
    <Fragment>
      <Title level={1}>Publications</Title>
        <div
          css={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'flex-start',
            alignItems: 'stretch',
          }}
        >
          { publications ? 
              publications.map(publication => {
                return (
                  <div
                    css={{
                      width: '280px',
                      margin: '2px',
                    }}
                    key={publication.publicationId}
                  >
                    <PublicationCard
                      publicationId={publication.publicationId}
                    />
                  </div>
                )
              })
              : <p>No Publications</p>
          }
        </div>
      {/* {
        publications ?
          <List
            // className="demo-loadmore-list"
            loading={loading}
            itemLayout="horizontal"
            // loadMore={loadMore}
            dataSource={publications}
            renderItem={publication => <PublicationListItem publication={publication}/>}
          />
          :
          <p>No Publications</p>
      } */}
    </Fragment>
  );
}

export default Publications