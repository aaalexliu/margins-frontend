import { gql } from '@apollo/client';
// import * as AnnotationAllTypes from './__generated__/AnnotationAll';
import { AnnotationAllFragment, Tag } from '../__generated__/graphql-types';

export const ANNOTATION_ALL_FRAGMENT = gql`
  fragment AnnotationAll on Annotation {
    __typename
    id
    annotationId
    color
    createdAt
    editedHighlightText
    editedNoteText
    extraEdits
    highlightLocation
    highlightText
    noteLocation
    noteText
    publicationId
    recordedAt
    updatedAt
    tagsByAnnotationTagAnnotationIdAndTagId {
      nodes {
        __typename
        id
        tagId
        tagName
      }
    }
  }
`;

export const extractAnnotationAll = (annotation: AnnotationAllFragment) => {
  let {
    extraEdits,
    highlightLocation,
    noteLocation,
    color
  } = annotation;
  let tags = annotation.tagsByAnnotationTagAnnotationIdAndTagId.nodes
    .filter((node): node is Pick<Tag, 'id' | 'tagId' | 'tagName'> => node != null);

  try {
    extraEdits = extraEdits ? JSON.parse(extraEdits) : undefined;
    highlightLocation = highlightLocation ? JSON.parse(highlightLocation) : undefined;
    noteLocation = noteLocation ? JSON.parse(noteLocation) : undefined;
  } catch (error) {
    console.log('error parsing json return from graphql for annotation');
    console.log(error);
  }

  color = color === 'blue' ? 'lightskyblue' : color;
  return {
    ...annotation,
    highlightLocation,
    noteLocation,
    extraEdits,
    color,
    tags
  }
}