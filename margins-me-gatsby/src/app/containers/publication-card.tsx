import React, { Fragment } from 'react';
import { useMutation, useQuery, gql } from '@apollo/client';
import { Card, Descriptions, Button } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Loading } from '../components';

import {
  PUBLICATION_AUTHOR_ANNOTATION_COUNT_FRAGMENT,
  extractPublicationAuthorAnnotationCount
} from '../utils/publication-author-annotation-count';
import { GetPublicationByPublicationIdDocument } from '../__generated__/graphql-types';

const { Meta } = Card;

interface PublicationDescriptionProps {
  authorNames: string,
  annotationCount: number
}

const PublicationDescription: React.FC<PublicationDescriptionProps> =
  ({authorNames, annotationCount }) => {
  return (
    <Descriptions
        // title="Responsive Descriptions"
        // bordered
        column={{sm: 2, xs: 1 }}
        size="small"
      >
        <Descriptions.Item label="Authors">{authorNames}</Descriptions.Item>
        <Descriptions.Item label="Annotations">{annotationCount}</Descriptions.Item>
    </Descriptions>
  )
}

export const GET_PUBLICATION_BY_PUBLICATION_ID = gql`
  query GetPublicationByPublicationId($publicationId: String!) {
    publicationByPublicationId(publicationId: $publicationId) {
      ...PublicationAuthorAnnotationCount
    }
  }
`;

interface PublicationCardProps {
  publicationId: string
}

const PublicationCard: React.FC<PublicationCardProps>
   = ({ publicationId }) => {

  const {
    data,
    loading,
    error,
    fetchMore
  } = useQuery(
    GetPublicationByPublicationIdDocument,
    {
      variables: {
        publicationId
      }
    }
  );

  if (loading) return <Loading />;
  if (error || !data) return <p>Error in retrieving publication data</p>


  const publication = data.publicationByPublicationId;

  if (publication == null) return <p>Error in Publication Data</p>
  
  const {
    title,
    authorNames,
    annotationCount
  } = extractPublicationAuthorAnnotationCount(publication);

  return (
    <Card
      title={title}
      extra={[
        <Button key="Edit" icon={<EditOutlined />} size="small" shape="circle" type="link"
          // onClick={() => setIsEditing(!isEditing)}
        />,
        <Button key="Delete" icon={<DeleteOutlined />} size="small" shape="circle" type="link"
          // onClick={onDelete}
        />,
      ]}
    >
      <PublicationDescription
        authorNames={authorNames}
        annotationCount={annotationCount}
      />
    </Card>
  )
}

export default PublicationCard;

// sample card code from antd
// <Card
//   style={{ width: 300 }}
//   cover={
//     <img
//       alt="example"
//       src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
//     />
//   }
//   actions={[
//     <SettingOutlined key="setting" />,
//     <EditOutlined key="edit" />,
//     <EllipsisOutlined key="ellipsis" />,
//   ]}
// >
//   <Meta
//     avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
//     title="Card title"
//     description="This is the description"
//   />
// </Card>,
