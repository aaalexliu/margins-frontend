import React, { Fragment } from 'react';
import { useQuery, gql } from '@apollo/client';
import { RouteComponentProps } from '@reach/router';

import { Typography, List } from 'antd';
import { PublicationListItem, Loading } from '../components';
import { AuthorCard } from '../containers';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import {
  GetAllAuthorsAndChildPublicationsDocument,
  AuthorAndChildPublicationsFragment
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

const Authors: React.FC<RouteComponentProps> = () => {

  const {
    data,
    loading,
    error,
    fetchMore
  } = useQuery(GetAllAuthorsAndChildPublicationsDocument)

  if (loading) return <Loading />;
  if (error || !data) return <p>ERROR</p>;

  const nodes = data?.allAuthors?.nodes;

  const authors = nodes ? 
    nodes.filter(
      (node): node is AuthorAndChildPublicationsFragment => node !== null
    )
    :
    undefined;

  return(
    <Fragment>
      <Title level={1}>Authors</Title>
        <div
          css={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'flex-start',
            alignItems: 'stretch',
          }}
        >
          { authors ? 
              authors.map(author => {
                return (
                  <div
                    css={{
                      width: '280px',
                      margin: '2px',
                    }}
                    key={author.id}
                  >
                    <AuthorCard
                      id={author.id}
                    />
                  </div>
                )
              })
              : <p>No Tags</p>
          }
        </div>
    </Fragment>
  );
}

export default Authors;