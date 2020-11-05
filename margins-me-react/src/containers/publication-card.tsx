import React, { Fragment } from 'react';
import { useMutation, gql } from '@apollo/client';
import { Card, Descriptions } from 'antd';
import { EditOutlined } from '@ant-design/icons';

import {
  extractPublicationAuthorAnnotationCount
} from '../utils/publication-author-annotation-count';
import * as PublicationAuthorAnnotationCountTypes from '../utils/__generated__/PublicationAuthorAnnotationCount';

const { Meta } = Card;

interface PublicationCardProps {
  publication: PublicationAuthorAnnotationCountTypes.PublicationAuthorAnnotationCount
}

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

const PublicationCard: React.FC<PublicationCardProps>
   = ({ publication }) => {
  
  const {
    publicationId,
    title,
    authorNames,
    annotationCount
  } = extractPublicationAuthorAnnotationCount(publication);

  return (
    <Card
      actions={[
        <EditOutlined key="edit" />,
      ]}
    >
      <Meta
        title={title}
        description={
          <PublicationDescription
            authorNames={authorNames}
            annotationCount={annotationCount}
          />
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
