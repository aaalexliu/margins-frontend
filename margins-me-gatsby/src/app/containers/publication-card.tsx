import React, { Fragment, useState } from 'react';
import { useMutation, useQuery, gql } from '@apollo/client';
import { Card, Descriptions, Button, Typography } from 'antd';
import { EditOutlined, DeleteOutlined, FileTextOutlined } from '@ant-design/icons';
import { Loading } from '../components';
import { PublicationFormModal } from './publication-form-modal';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import { Link } from 'gatsby';

import {
  extractPublicationAuthorAnnotationCount
} from '../graphql/fragments';
import { GetPublicationByPublicationIdDocument } from '../__generated__/graphql-types';

const { Meta } = Card;
const { Text } = Typography;

const MarginParagraph = styled.p`
  margin-left: 5px;
  margin-right: 5px;
`

interface PublicationDescriptionProps {
  authorNames: string,
  annotationCount: number
}

// const PublicationDescription: React.FC<PublicationDescriptionProps> =
//   ({authorNames, annotationCount }) => {
//   return (
//     <Descriptions
//         // title="Responsive Descriptions"
//         // bordered
//         column={{sm: 2, xs: 1 }}
//         size="small"
//         colon={false}
//       >
//         <Descriptions.Item label={<Text strong={true}>Authors:</Text>}>{authorNames}</Descriptions.Item>
//         <Descriptions.Item label={<Text strong={true}>Annotations:</Text>}>{annotationCount}</Descriptions.Item>
//     </Descriptions>
//   )
// }

export const GET_PUBLICATION_BY_PUBLICATION_ID = gql`
  query GetPublicationByPublicationId($publicationId: String!) {
    publicationByPublicationId(publicationId: $publicationId) {
      ...PublicationAuthorAnnotationCount
    }
  }
`;

interface PublicationCardProps {
  publicationId: string,
}

const PublicationCard: React.FC<PublicationCardProps>
   = ({ publicationId }) => {

  const [ isEditing, setIsEditing ] = useState(false);
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
    annotationCount,
    authors
  } = extractPublicationAuthorAnnotationCount(publication);

  console.log('current authors:', authors);
  return (
    <Card
      title={title}
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
    >
      <div css={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        margin: '0px -5px'
      }}>
        <MarginParagraph><Text strong={true}>Authors: </Text>{authorNames}</MarginParagraph>
        <Link to={`/app/annotations/publication/${publicationId}`}>
          {/* <MarginParagraph>Annotations: {annotationCount}</MarginParagraph> */}
          <MarginParagraph><Text strong={true}>Annotations: </Text>View {annotationCount} <FileTextOutlined /></MarginParagraph>
        </Link>
      </div>
      {/* <PublicationDescription
        authorNames={authorNames}
        annotationCount={annotationCount}
      /> */}
      <PublicationFormModal
        visible={isEditing}
        setVisible={setIsEditing}
        initialValues={
          {
            publicationId,
            title,
            authors
          }
        }
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
