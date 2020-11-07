import React from 'react';
import { useMutation, useQuery, gql } from '@apollo/client';
import { Card } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { Loading } from '../components';
import {
  ANNOTATION_ALL_FRAGMENT,
  extractAnnotationAll
} from '../utils/annotation-all'
import * as GetAnnotationByAnnotationIdTypes from './__generated__/GetAnnotationByAnnotationId';
import styled from '@emotion/styled';

const { Meta } = Card;

const ColoredQuote = styled.blockquote`
  // margin:50px auto;
  // padding:1.2em 30px 1.2em 75px;
  padding-left: 10px;
  border-left:8px solid;
  border-color: ${props => props.color ? props.color : 'grey'};
`;

function stringifyLocation(location: any): string {
  const locationArr: string[] = [];
  if (location.chapter !== undefined) locationArr.push(location.chapter);
  if (location.page !== undefined) locationArr.push(`Page: ${location.page}`);
  if (location.kindleLocation !== undefined) locationArr.push(`Kindle Location: ${location.kindleLocation}`);
  return locationArr.join(' - ');
}

export const GET_ANNOTATION_BY_ANNOTATION_ID = gql`
  query GetAnnotationByAnnotationId($annotationId: String!) {
    annotationByAnnotationId(annotationId: $annotationId) {
      ...AnnotationAll
    }
  }
  ${ANNOTATION_ALL_FRAGMENT}
`;

interface AnnotationCardProps {
  annotationId: string
}

const AnnotationCard: React.FC<AnnotationCardProps>
  = ({ annotationId }) => {

  const {
    data,
    loading,
    error,
    fetchMore
  } = useQuery<
  GetAnnotationByAnnotationIdTypes.GetAnnotationByAnnotationId,
  GetAnnotationByAnnotationIdTypes.GetAnnotationByAnnotationIdVariables
  >(
    GET_ANNOTATION_BY_ANNOTATION_ID,
    {
      variables: {
        annotationId
      }
    }
  );

  if (loading) return <Loading />;
  if (error || !data) return <p>Error in retrieving annotation data</p>

  const annotation = data.annotationByAnnotationId !== null ?
    data.annotationByAnnotationId :
    null;
  if (annotation === null) return <p>No Annotation Exists for ID {annotationId}</p>
  
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

  return (
    <Card
      title={stringifyLocation(highlightLocation)}
      actions={[
        <EditOutlined key="edit"/>,
      ]}
    >
      <ColoredQuote color={color ? color : undefined}>
        {highlightText}
      </ColoredQuote>
    </Card>
  )
}

export default AnnotationCard;