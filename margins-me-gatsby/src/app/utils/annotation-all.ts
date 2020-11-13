import { gql } from '@apollo/client';
import * as AnnotationAllTypes from './__generated__/AnnotationAll';

export const ANNOTATION_ALL_FRAGMENT = gql`
  fragment AnnotationAll on Annotation {
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
        id
        tagId
        tagName
      }
    }
  }
`;

export const extractAnnotationAll = (annotation: AnnotationAllTypes.AnnotationAll) => {
  let {
    extraEdits,
    highlightLocation,
    noteLocation,
    color
  } = annotation;
  const tags = annotation.tagsByAnnotationTagAnnotationIdAndTagId.nodes;

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