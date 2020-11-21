import React, { Fragment, useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import { RouteComponentProps } from '@reach/router';

import { Typography, List, AutoComplete } from 'antd';
import { PublicationListItem, Loading } from '../components';
import { AuthorCard } from '../containers';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import {
  GetAllAuthorsAndChildPublicationsDocument,
  AuthorAndChildPublicationsFragment,
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
  } = useQuery(GetAllAuthorsAndChildPublicationsDocument);

  const [ filteredAuthors, setFilteredAuthors ] = useState<AuthorAndChildPublicationsFragment[]>([]);


  if (loading) return <Loading />;
  if (error || !data) return <p>ERROR</p>;

  const nodes = data?.allAuthors?.nodes;

  const authors = nodes ? 
    nodes.filter(
      (node): node is AuthorAndChildPublicationsFragment => node !== null
    )
    :
    [];
  
  let displayedAuthors = filteredAuthors.length > 0 ? filteredAuthors : authors;

  const onChange = (value: string) => {
    console.log('author search:', value);
    if (!authors) return;
    let regex = new RegExp(value, 'i');
    setFilteredAuthors(authors?.filter(author => {
      return regex.test(author.fullName);
    }))
  }

  return(
    <div
      css={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
        <Title level={1}>Authors</Title>
        <Title level={5} type="secondary"
          css={{
            marginTop: '0px !important'
          }}
        >Filter Authors</Title>
        <AutoComplete
          css={{
            width: '50%',
            minWidth: '250px',
            maxWidth: '500px'
          }}
          onChange={onChange}
          options={displayedAuthors?.map(author => {
            return {
              label: author.fullName,
              value: author.fullName
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

          { displayedAuthors ? 
              displayedAuthors.map(author => {
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
    </div>
  );
}

export default Authors;