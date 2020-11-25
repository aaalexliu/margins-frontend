import React, { Fragment, useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import { RouteComponentProps } from '@reach/router';

import {
  PublicationsOrderBy,
  GetAllPublicationsDocument,
  PublicationAuthorAnnotationCountFragment
} from '../__generated__/graphql-types';
import { getAccountId } from '../utils';
import { Typography, AutoComplete } from 'antd';
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
  query GetAllPublications(
    $accountId: UUID!
    $orderBy: [PublicationsOrderBy!]
    $first: Int
    $afterCursor: Cursor
  ) {
    allPublications(
      condition: { accountId: $accountId }
      orderBy: $orderBy
      first: $first
      after: $afterCursor
    ) {
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
        // first: 10,
        accountId: getAccountId(),
        orderBy: [PublicationsOrderBy.PublicationIdDesc]
      }
    }
  );

  const [ filteredPublications, setFilteredPublications ] = useState<PublicationAuthorAnnotationCountFragment[]>([]);

  if (loading) return <Loading />;
  if (error || !data) return <p>ERROR</p>;

  const nodes = data?.allPublications?.edges.map(edge => edge.node);

  const publications = nodes ? 
    nodes.filter(
      (node): node is PublicationAuthorAnnotationCountFragment => node !== null
    )
    :
    [];

  let displayedPublications = filteredPublications.length > 0 ? filteredPublications : publications;

  const onChange = (value: string) => {
    console.log('publication search:', value);
    if (!publications) return;
    let regex = new RegExp(value, 'i');
    setFilteredPublications(publications?.filter(publication => {
      return regex.test(publication.title);
    }));
  }

  return(
    <div
      css={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
      <Title level={1}>Publications</Title>
        <Title level={5} type="secondary"
          css={{
            marginTop: '0px !important'
          }}
        >Filter Publications</Title>
        <AutoComplete
          css={{
            width: '50%',
            minWidth: '250px',
            maxWidth: '500px'
          }}
          onChange={onChange}
          options={displayedPublications?.map(publication => {
            return {
              label: publication.title,
              value: publication.title
            }
          })}
          defaultActiveFirstOption={true}
        />
        <br/>
        <div
          css={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'flex-start',
            alignItems: 'stretch',
          }}
        >
          { displayedPublications ? 
              displayedPublications.map(publication => {
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
    </div>
  );
}

export default Publications