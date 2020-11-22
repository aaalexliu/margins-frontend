import React, { Fragment, useState } from 'react';
import { useQuery, NetworkStatus } from '@apollo/client';
import { RouteComponentProps } from '@reach/router';
import { getAccountId } from '../utils';
import {
  SearchAnnotationsDocument,
  AnnotationAndTsvFragment
} from '../__generated__/graphql-types';
import { Typography, Input } from 'antd';
import { PublicationListItem, Loading } from '../components';
import { AnnotationAndPublicationCard } from '../containers';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useLocation } from '@reach/router';
import { parse } from 'query-string';

const { Title, Paragraph, Text } = Typography;
const { Search: SearchInput } = Input;

const Search: React.FC<RouteComponentProps> = () => {
  const location = useLocation();
  let { query } = parse(location.search);
  if (Array.isArray(query)) query = query[0];

  const [ userQuery, setUserQuery ] = useState(query ? query : '');

  const {
    data,
    loading: initialLoading,
    error,
    fetchMore,
    refetch,
    networkStatus } =
    useQuery(SearchAnnotationsDocument, {
      variables: {
        matches: userQuery,
        accountId: getAccountId(),
        first: 100
      },
      notifyOnNetworkStatusChange: true,
    });

  const refetchLoading = networkStatus === NetworkStatus.loading;
  const loading = initialLoading || refetchLoading;

  let searchResults;
  if (loading ) searchResults = <Loading />;
  if (!data || error ) searchResults = <p>Error in retrieving search results</p>;

  const numResults = data?.allAnnotations?.totalCount
  const hasMore = data?.allAnnotations?.pageInfo.hasNextPage;
  const endCursor = data?.allAnnotations?.pageInfo.endCursor;
  // console.log('pageinfo', data?.allAnnotations?.pageInfo);

  const nodes = data?.allAnnotations?.edges.map(edge => edge.node);

  const annotations = nodes ?
    nodes.filter((annotation): annotation is AnnotationAndTsvFragment => annotation !== null)
    : [];

  console.log('endCursor', endCursor);

  // see search.graphql for explanation on pagination bugs, right now limiting to 100 results;
  searchResults = (
    // <InfiniteScroll
    //   dataLength={annotations.length}
    //   hasMore={!!hasMore}
    //   next={() => {
    //     console.log(`fetching more of ${userQuery}`);
    //     fetchMore({
    //       variables: {
    //         offset: annotations.length,
    //         matches: userQuery,
    //         accountId: getAccountId(),
    //       }
    //     })
    //   }}
    //   loader={<Loading />}
    //   endMessage={
    //     <Paragraph css={{
    //       textAlign: 'center',
    //       width: '100%'
    //     }}
    //     strong={true}>
    //       Loaded All
    //     </Paragraph>
    //   }
    // >
      annotations.map(annotation => {
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
    //  </InfiniteScroll>
  );

  const onSearch = async (value: string, event: any) => {
    console.log(`searching for: ${value}`);
    setUserQuery(value);
    const res = await refetch({
      matches: value,
      accountId: getAccountId(),
      first: 100
    });

  }

  return(
    <div
      css={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
      <Title level={1}>Search</Title>
        <SearchInput
          css={{
            width: '50%',
            minWidth: '250px',
            maxWidth: '500px'
          }}
          value={userQuery}
          enterButton={true}
          onSearch={onSearch}
          loading={loading}
        />
        <br/>
        <div
          css={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '90%',
            maxWidth: '700px',
            // this is for infinite scroll component outer div, which doesn't expand to 100% sometimes
            '& div.infinite-scroll-component__outerdiv': {
              width: '100%'
            }
          }}
        >
          <div
            css={{
              display: 'flex',
              width: '100%'
            }}
          >
            <Title level={5} type='secondary'>{numResults} Results</Title>
          </div>
          {searchResults}
        </div>
    </div>
  );
}

export default Search