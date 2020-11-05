import React, { Fragment } from 'react';
import { useQuery, gql } from '@apollo/client';
import * as GetAllPublicationTypes from './__generated__/GetAllPublications';
import { PublicationsOrderBy } from '../__generated__/globalTypes';

import { Typography, List } from 'antd';
import { PublicationListItem, Loading } from '../components';
import { PUBLICATION_AUTHOR_ANNOTATION_COUNT_FRAGMENT } from '../utils/publication-author-annotation-count';

const { Title } = Typography;

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
  ${PUBLICATION_AUTHOR_ANNOTATION_COUNT_FRAGMENT}
`;

const Publications = () => {
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
  } = useQuery<
    GetAllPublicationTypes.GetAllPublications,
    GetAllPublicationTypes.GetAllPublicationsVariables
  >(
    GET_ALL_PUBLICATIONS,
    {
      variables: {
        first: 10,
        orderBy: [PublicationsOrderBy.PUBLICATION_ID_DESC]
      }
    }
  );

  if (loading) return <Loading />;
  if (error || !data) return <p>ERROR</p>;

  const nodes = data?.allPublications?.edges.map(edge => edge.node);

  const publications = nodes ? 
    nodes.filter(
      (node): node is GetAllPublicationTypes.GetAllPublications_allPublications_edges_node => node !== null
    )
    :
    undefined;

  return(
    <Fragment>
      <Title level={1}>Publications</Title>
      {
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
      }
    </Fragment>
  );
}

export default Publications