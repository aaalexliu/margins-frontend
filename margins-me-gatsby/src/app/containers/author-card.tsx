import React, { Fragment, useState } from 'react';
import { useMutation, useQuery, gql } from '@apollo/client';
import { Card, Descriptions, Button, Typography } from 'antd';
import { EditOutlined, DeleteOutlined, FileTextOutlined } from '@ant-design/icons';
import { Loading } from '../components';
// import { PublicationFormModal } from './publication-form-modal';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import { Link } from 'gatsby';
import { GetAuthorAndChildPublicationsDocument } from '../__generated__/graphql-types';

const { Text, Paragraph } = Typography;

interface AuthorCardProps {
  id: string,
  authorId?: string
}

export const AuthorCard: React.FC<AuthorCardProps>
   = ({ id, authorId }) => {

  const [ isEditing, setIsEditing ] = useState(false);
  const {
    data,
    loading,
    error,
    fetchMore
  } = useQuery(
    GetAuthorAndChildPublicationsDocument,
    {
      variables: {
        id
      }
    }
  );

  if (loading) return <Loading />;
  if (error || !data) return <p>Error in retrieving author data</p>


  const author = data.author;

  if (author == null) return <p>Error in Author Data</p>;

  return (
    <Card
      title={author.fullName}
      extra={[
        <Button key="Edit" icon={<EditOutlined />} size="small" shape="circle" type="link"
          onClick={() => setIsEditing(!isEditing)}
        />,
        <Button key="Delete" icon={<DeleteOutlined />} size="small" shape="circle" type="link"
          // onClick={onDelete}
        />,
      ]}
      // css={{
      //   width: width
      // }}
      size="small"
    >
      <div css={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        // margin: '0px -5px'
      }}>
        <Paragraph
          ellipsis={{
            rows: 4,
            expandable: true,
            symbol: 'All'
          }}
        >
          <Text strong={true}>
          Publications {
          author.publicationAuthorsByAuthorId.totalCount ?
          `(${author.publicationAuthorsByAuthorId.totalCount})` :
          ''}:
          </Text>
          <br/>
          {
            author.publicationAuthorsByAuthorId.nodes.map(pubNode => {
              if (pubNode == null) return;
              const publication = pubNode.publicationByPublicationId;
              if (publication == null) return;

              return (
              <Fragment>
                <Link key={publication.publicationId}
                  to={`app/annotations/publication/${publication.publicationId}`}
                >
                  {publication.title}
                </Link>
                <br/>
              </Fragment>
              )
            })
          }
        </Paragraph>
      </div>
    </Card>
  )
}

export default AuthorCard;
