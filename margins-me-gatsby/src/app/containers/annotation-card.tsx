import React, { Fragment } from 'react';
import { useMutation, useQuery, gql } from '@apollo/client';
import { Card, Divider, Typography } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { Loading } from '../components';
import {
  ANNOTATION_ALL_FRAGMENT,
  extractAnnotationAll
} from '../utils/annotation-all'
// import * as GetAnnotationByAnnotationIdTypes from './__generated__/GetAnnotationByAnnotationId';
import * as GetAnnotationTypes from './__generated__/GetAnnotation';
import styled from '@emotion/styled';

const { Meta } = Card;
const { Title, Paragraph, Text } = Typography;

const ColoredQuote = styled.blockquote`
  // margin:50px auto;
  // padding:1.2em 30px 1.2em 75px;
  padding-left: 10px;
  border-left:4px solid;
  border-color: ${props => props.color ? props.color : 'grey'};
`;

function isOrphanNote(highlightText: any, noteText: any): boolean {
  if (!highlightText && noteText) return true;
  return false;
}

function stringifyLocation(location: any): string {
  if (location === undefined ) return '';
  const locationArr: string[] = [];
  if (location.chapter !== undefined) locationArr.push(location.chapter);
  if (location.page !== undefined) locationArr.push(`Page: ${location.page}`);
  if (location.kindleLocation !== undefined) locationArr.push(`Kindle Location: ${location.kindleLocation}`);
  return locationArr.join(' - ');
}

// export const GET_ANNOTATION_BY_ANNOTATION_ID = gql`
//   query GetAnnotationByAnnotationId($annotationId: String!) {
//     annotationByAnnotationId(annotationId: $annotationId) {
//       ...AnnotationAll
//     }
//   }
//   ${ANNOTATION_ALL_FRAGMENT}
// `;

export const GET_ANNOTATION = gql`
  query GetAnnotation($id: ID!) {
    annotation(id: $id) {
      ...AnnotationAll
    }
  }
  ${ANNOTATION_ALL_FRAGMENT}
`;

interface AnnotationCardProps {
  id: string
}

const AnnotationCard: React.FC<AnnotationCardProps>
  = ({ id }) => {

  const {
    data,
    loading,
    error,
    fetchMore
  } = useQuery<
  GetAnnotationTypes.GetAnnotation,
  GetAnnotationTypes.GetAnnotationVariables
  >(
    GET_ANNOTATION,
    {
      variables: {
        id
      }
    }
  );

  if (loading) return <Loading />;
  if (error || !data) return <p>Error in retrieving annotation data</p>

  const annotation = data.annotation !== null ?
    data.annotation :
    null;
  if (annotation === null) return <p>No Annotation Exists</p>
  
  const {
    color,
    createdAt,
    editedHighlightText,
    editedNoteText,
    extraEdits,
    highlightLocation,
    highlightText,
    noteLocation,
    noteText,
    publicationId,
    recordedAt,
    updatedAt
  } = extractAnnotationAll(annotation);


  const notOrphanNote = !isOrphanNote(highlightText, noteText);

  const cardTitle = <Text strong={true}>{notOrphanNote ? 'Highlight' : 'Note'}</Text>;

  const cardLocation = 
    <Paragraph type="secondary" ellipsis={{ rows: 1, expandable: true, symbol: '..more' }}>
      {notOrphanNote ? stringifyLocation(highlightLocation): stringifyLocation(noteLocation)}
    </Paragraph>
  // const cardDescription = notOrphanNote ? stringifyLocation(highlightLocation) : stringifyLocation(noteLocation);

  const NoteDivider = notOrphanNote && noteText ?
    <Divider orientation="left" plain={true}>{`Note`}</Divider>:
    null;

  return (
    <Card
      // title={cardTitle}
      actions={[
        <EditOutlined key="edit"/>,
      ]}
      size="default"
    >
      {cardTitle}
      {cardLocation}
      {highlightText &&
      <ColoredQuote color={color ? color : undefined}>
        {highlightText}
      </ColoredQuote>}
      {NoteDivider}
      {noteText}
    </Card>
  )
}

export default AnnotationCard;