import React, { Fragment, useState } from 'react';
import { useQuery } from '@apollo/client';
import { RouteComponentProps } from '@reach/router';

import { Typography, AutoComplete } from 'antd';
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
  } = useQuery(GetAllTagsDocument);

  const [ filteredTags, setFilteredTags ] = useState<TagAndCountFragment[]>([]);

  if (loading) return <Loading />;
  if (error || !data) return <p>ERROR</p>;

  const nodes = data?.allTags?.nodes;

  const tags = nodes ? 
    nodes.filter(
      (node): node is TagAndCountFragment => node !== null
    )
    :
    [];

  let displayedTags = filteredTags.length > 0 ? filteredTags : tags;

  const onChange = (value: string) => {
    console.log('author search:', value);
    if (!tags) return;
    let regex = new RegExp(value, 'i');
    setFilteredTags(tags?.filter(tag => {
      return regex.test(tag.tagName);
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
      <Title level={1}>Tags</Title>
      <Title level={5} type="secondary"
          css={{
            marginTop: '0px !important'
          }}
        >Filter Tags</Title>
        <AutoComplete
          css={{
            width: '50%',
            minWidth: '250px',
            maxWidth: '500px'
          }}
          onChange={onChange}
          options={displayedTags?.map(tag => {
            return {
              label: tag.tagName,
              value: tag.tagName
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
          { displayedTags ? 
              displayedTags.map(tag => {
                return (
                  <div
                    css={{
                      width: '280px',
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
    </div>
  );
}

export default Tags