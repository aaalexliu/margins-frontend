import React, { Fragment } from 'react';
import { useQuery, gql } from '@apollo/client';
import { RouteComponentProps } from '@reach/router';

import { Typography, List } from 'antd';
import { PublicationListItem, Loading } from '../components';
import { TagCard } from '../containers';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import {
  GetAllTagsDocument,
  TagAndCountFragment
} from '../__generated__/graphql-types';

const { Title } = Typography;

const CenteredFlex = styled.div`
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  justify-content: center;
  align-items: stretch;
  &::after {
    content: "";
    flex: auto;
  }
`;

const Tags: React.FC<RouteComponentProps> = () => {

  const {
    data,
    loading,
    error,
    fetchMore
  } = useQuery(GetAllTagsDocument)

  if (loading) return <Loading />;
  if (error || !data) return <p>ERROR</p>;

  const nodes = data?.allTags?.nodes;

  const tags = nodes ? 
    nodes.filter(
      (node): node is TagAndCountFragment => node !== null
    )
    :
    undefined;

  return(
    <Fragment>
      <Title level={1}>Tags</Title>
        <div
          css={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'flex-start',
            alignItems: 'stretch',
          }}
        >
          { tags ? 
              tags.map(tag => {
                return (
                  <div
                    css={{
                      width: '225px',
                      margin: '2px',
                    }}
                    key={tag.tagId}
                  >
                    <TagCard
                      tagId={tag.tagId}
                    />
                  </div>
                )
              })
              : <p>No Tags</p>
          }
        </div>
      {/* {
        tag ?
          <List
            // className="demo-loadmore-list"
            loading={loading}
            itemLayout="horizontal"
            // loadMore={loadMore}
            dataSource={tag}
            renderItem={publication => <PublicationListItem publication={publication}/>}
          />
          :
          <p>No Tags</p>
      } */}
    </Fragment>
  );
}

export default Tags