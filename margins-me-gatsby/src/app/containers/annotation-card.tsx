import React, { Fragment, useState, useEffect } from 'react';
import { useMutation, useQuery, gql } from '@apollo/client';
import { generateObjectId } from '../utils/object-id';
import { getAccountId } from '../utils/account-id';
import { Card, Divider, Typography, Tag, Select } from 'antd';
import { EditOutlined, SyncOutlined } from '@ant-design/icons';
import { Loading } from '../components';
import {
  ANNOTATION_ALL_FRAGMENT,
  extractAnnotationAll
} from '../utils/annotation-all'

import {
  GetAnnotationDocument,
} from '../__generated__/graphql-types';
import styled from '@emotion/styled';
import { AnnotationCardTags } from './annotation-tags';

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

export const ADD_TAG_TO_ANNOTATION = gql`
  mutation AddTagToAnnotation($annotationId: String!, $tagId: String!) {
    createAnnotationTag(
      input: {
        annotationTag: {
          annotationId: $annotationId
          tagId: $tagId
        }
      }) {
      annotationByAnnotationId {
        ...AnnotationAll
      }
    }
  }
  ${ANNOTATION_ALL_FRAGMENT}
`

export const CREATE_AND_ADD_TAG_TO_ANNOTATION = gql`
  mutation CreateTagAndAddToAnnotation(
    $tagId: String!
    $tagName: String!
    $annotationId: String!
    $accountId: UUID!
  ) {
    __typename
    createTag(
      input: {
        tag: {
          tagId: $tagId
          tagName: $tagName
          annotationTagsUsingTagId: { create: { annotationId: $annotationId } }
          accountId: $accountId
        }
      }
    ) {
      tag {
        id
        tagId
        tagName
      }
      query {
        annotationByAnnotationId(annotationId: $annotationId) {
          ...AnnotationAll
        }
      }
    }
  }
  ${ANNOTATION_ALL_FRAGMENT}
`

export const DELETE_ANNOTATION_TAG = gql`
  mutation DeleteAnnotationTag($annotationId: String!, $tagId: String!) {
    __typename
    deleteAnnotationTagByAnnotationIdAndTagId(input: {annotationId: $annotationId, tagId: $tagId}) {
      tagByTagId {
        annotationTagsByTagId {
          totalCount
        }
        tagId
        tagName
        id
      }
      annotationByAnnotationId {
        ...AnnotationAll
      }
    }
  }
  ${ANNOTATION_ALL_FRAGMENT}
`

export const DELETE_TAG = gql`
  mutation DeleteTag($tagId: String!) {
    __typename
    deleteTagByTagId(input: {tagId: $tagId}) {
      deletedTagId
    }
  }
`

interface AnnotationCardProps {
  id: string
}

const AnnotationCard: React.FC<AnnotationCardProps>
  = ({ id }) => {
  

  const {
    data,
    loading,
    error,
  } = useQuery(GetAnnotationDocument,
    {
      variables: {
        id
      },
      // used to test why cache wasn't hitting.
      // fetchPolicy: 'cache-only',
      fetchPolicy: "cache-first",
    },
  );

  if (loading) return <Loading />;
  if (error || !data) return <p>Error in retrieving annotation data</p>

  const annotation = data.annotation !== null ?
    data.annotation :
    null;
  if (annotation == null) return <p>No Annotation Exists</p>
  
  const {
    annotationId,
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
    updatedAt,
    tags
  } = extractAnnotationAll(annotation);

  console.log(`${highlightText} tags:`, tags);

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
      <AnnotationCardTags annotationId={annotationId} tags={tags}/>
    </Card>
  )
}

export default AnnotationCard;