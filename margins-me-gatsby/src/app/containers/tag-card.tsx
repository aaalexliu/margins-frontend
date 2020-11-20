import React, { Fragment, useState } from 'react';
import { useMutation, useQuery, gql } from '@apollo/client';
import { Card, Descriptions, Button, Typography } from 'antd';
import { EditOutlined, DeleteOutlined, FileTextOutlined } from '@ant-design/icons';
import { Loading } from '../components';
// import { PublicationFormModal } from './publication-form-modal';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import { Link } from 'gatsby';
import { GetTagByTagIdDocument } from '../__generated__/graphql-types';

const { Text } = Typography;

interface TagCardProps {
  tagId: string,
}

export const TagCard: React.FC<TagCardProps>
   = ({ tagId }) => {

  const [ isEditing, setIsEditing ] = useState(false);
  const {
    data,
    loading,
    error,
    fetchMore
  } = useQuery(
    GetTagByTagIdDocument,
    {
      variables: {
        tagId
      }
    }
  );

  if (loading) return <Loading />;
  if (error || !data) return <p>Error in retrieving tag data</p>


  const tag = data.tagByTagId;

  if (tag == null) return <p>Error in Tag Data</p>;

  return (
    <Card
      title={tag.tagName}
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
        <Link to={`/app/annotations/tag/${tagId}`}>
          <Text strong={true}>Annotations: </Text>View {tag.annotationTagsByTagId.totalCount} <FileTextOutlined/>
        </Link>
      </div>

      {/* <PublicationFormModal
        visible={isEditing}
        setVisible={setIsEditing}
        initialValues={
          {
            publicationId,
            title,
            authors
          }
        }
      /> */}
    </Card>
  )
}

export default TagCard;
